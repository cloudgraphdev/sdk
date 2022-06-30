import chalk from 'chalk'
import { groupBy, isEmpty } from 'lodash'

import { generateSchemaMapDynamically, mergeSchemas } from '../../utils/schema'
import {
  Engine,
  Logger,
  ProviderData,
  RuleFinding,
  SchemaMap,
  StorageEngine,
} from '../..'
import RulesEngine from '../../rules-engine'
import { Result, Rule, Severity } from '../../rules-engine/types'
import Plugin, { ConfiguredPlugin, PluginManager } from '../types'
import DgraphDataProcessor from '../../rules-engine/data-processors/dgraph-data-processor'
import DataProcessor from '../../rules-engine/data-processors/data-processor'
import getLinkedData from '../../utils/data'

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
      rules: Rule[]
    }
  } = {}

  private dataProcessors: {
    [name: string]: DataProcessor
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
        default: { rules = [], entity = 'Custom', extraFields = [] },
      } = (await pluginManager.getPlugin(policyPack)) ?? {}

      if (!rules) {
        throw new Error(
          `The policy pack ${policyPack} did not return a valid set of rules`
        )
      }

      return { rules, entity, extraFields }
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

  private displayResults(findingsResults: {
    [severity: string]: RuleFinding[]
  }): void {
    // TODO: Display Results will be improved on CG-549
    for (const severityLevel in findingsResults) {
      if (severityLevel) {
        const count = findingsResults[severityLevel].length
        let message = ''
        if (severityLevel === Severity.HIGH) {
          message = `${chalk.italic.redBright.red(
            `[ ${count || 0} ${
              count === 1 ? 'issue was' : 'issues were'
            } found during rules execution marked as high severity ]`
          )}`
        } else if (severityLevel === Severity.MEDIUM) {
          message = `${chalk.italic.yellow(
            `[ ${count || 0} ${
              count === 1 ? 'issue was' : 'issues were'
            } found during rules execution marked as medium severity ]`
          )}`
        }

        this.logger.info(
          message ||
            `${chalk.italic(
              `[ ${count || 0} ${
                count === 1 ? 'issue was' : 'issues were'
              } found during rules execution marked as ${severityLevel} severity ]`
            )}`
        )
      }
    }
  }

  private async executeRule({
    data,
    rules,
    policyPack,
  }: {
    data: any,
    rules: Rule[]
    policyPack: string
  }): Promise<RuleFinding[]> {
    const findings: RuleFinding[] = []

    // Run rules:
    for (const rule of rules) {
      try {
        if (rule.queries?.length > 0) {
          const { queries, ...ruleMetadata } = rule
          const subRules = queries.map(q => ({
            ...q,
            ...ruleMetadata,
          }))

          findings.push(
            ...(await this.executeRule({
              data,
              rules: subRules,
              policyPack,
            }))
          )
        } else {
          const ruleData = rule.gql ? data : undefined
          const results = (await this.policyPacksPlugins[
            policyPack
          ]?.engine?.processRule(rule, ruleData)) as RuleFinding[]

          findings.push(...results)
        }
      } catch (error) {
        this.logger.error(
          `Error processing rule ${rule.id} for ${policyPack} policy pack`
        )
        this.logger.debug(error)
      }
    }

    return findings
  }

  // TODO: Generalize data processor moving storage module to SDK with its interfaces
  private getDataProcessor(config: {
    providerName: string
    entityName: string
    typenameToFieldMap?: { [tn: string]: string }
    extraFields?: string[]
  }): DataProcessor {
    const dataProcessorKey = `${config.providerName}${config.entityName}`
    if (this.dataProcessors[dataProcessorKey]) {
      return this.dataProcessors[dataProcessorKey]
    }

    const dataProcessor = new DgraphDataProcessor(config)
    this.dataProcessors[dataProcessorKey] = dataProcessor
    return dataProcessor
  }

  async configure(
    pluginManager: PluginManager,
    plugins: ConfiguredPlugin[]
  ): Promise<any> {
    const { policyPacks = '' } = this.flags
    let allPolicyPacks = isEmpty(policyPacks) ? [] : policyPacks.split(',')
    if (allPolicyPacks.length >= 1) {
      this.logger.debug(`Executing rules for policy packs: ${allPolicyPacks}`)
    } else {
      const policies = plugins || []
      allPolicyPacks = policies
        .filter(policy => policy.providers.includes(this.provider.name))
        .map(policyFilteredByProvider => policyFilteredByProvider.name)

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

      // Initialize Data Processor
      const dataProcessor = this.getDataProcessor({
        providerName: this.provider.name,
        entityName: policyPackPlugin.entity,
        typenameToFieldMap: resourceTypeNamesToFieldsMap,
        extraFields: policyPackPlugin.extraFields,
      })

      // Initialize RulesEngine
      const rulesEngine = new RulesEngine(dataProcessor)

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
    providerData,
    processConnectionsBetweenEntities,
  }: {
    storageRunning: boolean
    storageEngine: StorageEngine
    providerData: ProviderData
    processConnectionsBetweenEntities: (props: {
      provider?: string
      providerData: ProviderData
      storageEngine: StorageEngine
      storageRunning: boolean
      schemaMap?: SchemaMap
    }) => void
  }): Promise<any> {
    !isEmpty(this.policyPacksPlugins) &&
      this.logger.info(
        `Beginning ${chalk.italic.green('RULES')} for ${this.provider.name}`
      )
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

        // Format metadata and link connections
        const linkedData = getLinkedData(providerData)

        const findings = await this.executeRule({
          data: linkedData,
          rules,
          policyPack,
        })

        // Prepare mutations
        const mutations = engine.prepareMutations(findings, rules)

        // Save connections
        processConnectionsBetweenEntities({
          providerData: {
            entities: mutations,
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

        const results = findings.filter(
          finding => finding.result === Result.FAIL
        )

        if (!isEmpty(results)) {
          this.displayResults(groupBy(results, 'rule.severity'))

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
