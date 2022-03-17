import PolicyPackPlugin from '../../src/plugins/policyPack'
import Logger from '../../src/logger'
import JSONRule from '../evaluators/json-evaluator.test'
import ManualRule from '../evaluators/manual-evaluator.test'

jest.mock('../../src/logger')

const providerName = 'aws'
const config = {
  resources: 'schemaA, schemaB',
}
const schemasMap = {
  schemaA: `${providerName}SchemaA`,
  schemaB: `${providerName}SchemaB`,
}
const policyPacks = [
  {
    name: 'aws-cis-1.2.0',
    providers: ['aws'],
  },
]

const getPluginManager = (rules: any[]) => ({
  getPlugin: jest.fn().mockImplementation(() => ({
    default: {
      rules,
      entity: 'CIS',
    },
  })),
})

const storageEngine = {
  setSchema: jest.fn(),
  getSchema: jest.fn(),
  query: jest.fn(),
  run: jest.fn(),
}

describe('PolicyPack Plugin', () => {
  let plugin
  beforeEach(() => {
    // Initialize
    plugin = new PolicyPackPlugin({
      config,
      provider: {
        name: providerName,
        schemasMap,
      },
      flags: {},
      logger: Logger,
    })
    storageEngine.setSchema.mockClear()
    storageEngine.getSchema.mockClear()
    storageEngine.query.mockClear()
    storageEngine.run.mockClear()
  })

  test('Should configure and execute configured policy pack', async () => {
    // Get the Plugin Manager
    const pluginManager = getPluginManager([
      JSONRule.jsonRule,
      ManualRule.manualRule,
    ])

    // Configure Plugin
    await plugin.configure(pluginManager, policyPacks)

    expect(pluginManager.getPlugin).toHaveBeenCalledTimes(1)

    // Execute Plugin
    await plugin.execute({
      storageRunning: true,
      storageEngine,
      processConnectionsBetweenEntities: jest.fn(),
    })

    expect(storageEngine.getSchema).toHaveBeenCalled()
    expect(storageEngine.setSchema).toHaveBeenCalled()
    expect(storageEngine.query).toHaveBeenCalledTimes(1)
    expect(storageEngine.run).toHaveBeenCalledTimes(1)
  })

  test('Should configure and execute configured policy pack with composite rule', async () => {
    // Get the Plugin Manager
    const pluginManager = getPluginManager([
      JSONRule.jsonRule,
      JSONRule.compositeRule,
    ])

    // Configure Plugin
    await plugin.configure(pluginManager, policyPacks)

    expect(pluginManager.getPlugin).toHaveBeenCalledTimes(1)

    // Execute Plugin
    await plugin.execute({
      storageRunning: true,
      storageEngine,
      processConnectionsBetweenEntities: jest.fn(),
    })

    expect(storageEngine.getSchema).toHaveBeenCalled()
    expect(storageEngine.setSchema).toHaveBeenCalled()
    expect(storageEngine.query).toHaveBeenCalledTimes(3)
    expect(storageEngine.run).toHaveBeenCalledTimes(1)
  })
})
