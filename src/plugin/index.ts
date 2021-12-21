export default abstract class Plugin {
  configure(pluginManager: any): Promise<{ [key: string]: any }> {
    throw new Error(`Function configure has not been defined: ${pluginManager}`)
  }

  execute(
    storageRunning: any,
    storageEngine: any,
    processConnectionsBetweenEntities: any
  ): Promise<any> {
    throw new Error(
      `Function configure has not been defined ${storageRunning} ${storageEngine} ${processConnectionsBetweenEntities}`
    )
  }
}
