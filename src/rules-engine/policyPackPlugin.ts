import chalk from 'chalk'
import { groupBy, isEmpty } from 'lodash'

import { generateSchemaMapDynamically, mergeSchemas } from '../utils/schema'
import {
  Engine,
  Logger,
  ProviderData,
  RuleFinding,
  SchemaMap,
  StorageEngine,
} from '..'
import RulesEngine from '../rules-engine'
import Plugin, { PluginManager } from '../plugin'

import { Result } from './types'

export default class PolicyPackPlugin extends Plugin {
  constructor({
    config,
    logger,
    provider,
    flags,
  }: {
    config: { [key: string]: string }
    logger: Logger
    provider: { name: string; schemasMap?: SchemaMap; serviceKey?: string }
    flags: {
      [flag: string]: any
    }
  }) {
    super()
    this.logger = logger
    this.config = config
    this.provider = provider
    this.flags = flags
  }

  private config: { [key: string]: any } = {}

  private flags: {
    [flag: string]: any
  }

  private provider: {
    name: string
    schemasMap?: SchemaMap
    serviceKey?: string
  } = {
    name: '',
    schemasMap: undefined,
    serviceKey: undefined,
  }

  logger: Logger

  private policyPacksPlugins: {
    [policyPackName: string]: {
      engine: Engine
      entity: string
      rules: any
    }
  } = {}

  private async getPolicyPackPackage({
    policyPack,
    pluginManager,
  }: {
    policyPack: string
    pluginManager: PluginManager
  }): Promise<any> {
    try {
      if (this.policyPacksPlugins[policyPack]) {
        return this.policyPacksPlugins[policyPack]
      }

      const {
        default: { rules = [], entity = '' },
      } = (await pluginManager.getPlugin(policyPack)) ?? {}

      if (!rules) {
        throw new Error(
          `The policy pack ${policyPack} did not return a valid set of rules`
        )
      }

      return { rules, entity }
    } catch (error: any) {
      this.logger.error(error)
      this.logger.warn(
        `There was an error installing or requiring a plugin for ${policyPack}, does one exist?`
      )
      this.logger.info(
        'For more information on this error, please see https://github.com/cloudgraphdev/cli#common-errors'
      )
      return null
    }
  }

  async configure(pluginManager: PluginManager): Promise<any> {
    const { policyPacks = '' } = this.flags
    let allPolicyPacks = isEmpty(policyPacks) ? [] : policyPacks.split(',')
    if (allPolicyPacks.length >= 1) {
      this.logger.debug(`Executing rules for policy packs: ${allPolicyPacks}`)
    } else {
      allPolicyPacks = this.config.policies || []
      this.logger.debug(
        `Executing rules for policy packs found in config: ${allPolicyPacks}`
      )
    }
    if (allPolicyPacks.length === 0) {
      this.logger.warn(
        'There are no policy packs configured and none were passed to execute'
      )
    }
    const failedPolicyPackList: string[] = []

    const resources =
      this.config[this.provider?.serviceKey ?? 'resources']?.split(',') || []

    // // Generate schema mapping
    const resourceTypeNamesToFieldsMap =
      this.provider.schemasMap ||
      generateSchemaMapDynamically(this.provider.name, resources)

    for (const policyPack of allPolicyPacks) {
      this.logger.info(
        `Beginning ${chalk.italic.green('RULES')} for ${policyPack}`
      )
      const policyPackPlugin = await this.getPolicyPackPackage({
        policyPack,
        pluginManager,
      })

      if (!policyPackPlugin?.rules) {
        failedPolicyPackList.push(policyPack)
        this.logger.warn(`No valid rules found for ${policyPack}, skipping...`)
        continue // eslint-disable-line no-continue
      }

      if (!policyPackPlugin?.entity) {
        failedPolicyPackList.push(policyPack)
        this.logger.warn(
          `No entity was specified for ${policyPack}, skipping...`
        )
        continue // eslint-disable-line no-continue
      }

      // Initialize RulesEngine
      const rulesEngine = new RulesEngine(
        this.provider.name,
        policyPackPlugin.entity,
        resourceTypeNamesToFieldsMap
      )

      this.policyPacksPlugins[policyPack] = {
        engine: rulesEngine,
        entity: policyPackPlugin.entity,
        rules: policyPackPlugin.rules,
      }
    }
  }

  async execute({
    storageRunning,
    storageEngine,
    processConnectionsBetweenEntities,
  }: {
    storageRunning: boolean
    storageEngine: StorageEngine
    processConnectionsBetweenEntities: (props: {
      provider?: string
      providerData: ProviderData
      storageEngine: StorageEngine
      storageRunning: boolean
      schemaMap?: SchemaMap
    }) => void
  }): Promise<any> {
    for (const policyPack in this.policyPacksPlugins) {
      if (policyPack && this.policyPacksPlugins[policyPack]) {
        const {
          engine,
          entity,
          rules = [],
        } = this.policyPacksPlugins[policyPack]

        this.logger.startSpinner(
          `${chalk.italic.green('EXECUTING')} rules for ${chalk.italic.green(
            policyPack
          )}`
        )
        // Update Schema:
        const currentSchema: string = await storageEngine.getSchema()
        const findingsSchema: string[] = engine?.getSchema() || []

        await storageEngine.setSchema([
          mergeSchemas(currentSchema, findingsSchema),
        ])

        const findings: RuleFinding[] = []

        // Run rules:
        for (const rule of rules) {
          try {
            const { data } = await storageEngine.query(rule.gql)
            const results = (await this.policyPacksPlugins[
              policyPack
            ]?.engine?.processRule(rule, data)) as RuleFinding[]

            findings.push(...results)
          } catch (error) {
            this.logger.error(
              `Error processing rule ${rule.ruleId} for ${policyPack} policy pack`
            )
            this.logger.debug(error)
          }
        }

        // Prepare entities mutations
        const entitiesData = engine?.prepareEntitiesMutations(findings)

        // Prepare provider mutations
        const providerData = engine?.prepareProviderMutations(findings)

        // Save connections
        processConnectionsBetweenEntities({
          providerData: {
            entities: [...entitiesData, ...providerData],
            connections: [] as any,
          },
          storageEngine,
          storageRunning,
        })
        await storageEngine.run(false)

        this.logger.successSpinner(
          `${chalk.italic.green(policyPack)} rules excuted successfully`
        )
        this.logger.successSpinner('success')

        // TODO: Use table to display results
        const results = findings.filter(
          finding => finding.result === Result.FAIL
        )
        if (!isEmpty(results)) {
          const { warning, danger } = groupBy(results, 'severity')
          warning &&
            this.logger.warn(
              `${chalk.italic.yellow(
                `${warning.length || 0} warning${warning.length > 1 ? 's' : ''}`
              )}  found during rules execution.`
            )
          danger &&
            this.logger.error(
              `${chalk.italic.redBright.red(
                `${danger.length || 0} vulnerabilit${
                  danger.length > 1 ? 'ies' : 'y'
                }`
              )}  found during rules execution.`
            )
          this.logger.info(
            `For more information, you can query ${chalk.italic.green(
              `query${this.provider.name}${entity}Findings`
            )} in the GraphQL query tool`
          )
        }
      }
    }
  }
}
