import { ProviderData, SchemaMap, StorageEngine } from '..'

export enum PluginType {
  Provider = 'provider',
  PolicyPack = 'policyPack',
}

export enum PluginModule {
  'provider' = 'cg-provider',
  'policyPack' = 'policy-pack',
}

export interface PluginManager {
  getPlugin: (plugin: string, version?: string) => Promise<any>

  queryRemoteVersion: (importPath: string) => Promise<string>

  getVersion: (importPath: string) => Promise<string>

  checkRequiredVersion: (importPath: string) => Promise<boolean>

  removePlugin: (plugin: string) => Promise<void>
}

export default abstract class Plugin {
  configure(pluginManager: PluginManager): Promise<{ [key: string]: any }> {
    throw new Error(`Function configure has not been defined: ${pluginManager}`)
  }

  execute({
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
    throw new Error(
      `Function configure has not been defined ${storageRunning} ${storageEngine} ${processConnectionsBetweenEntities}`
    )
  }
}
