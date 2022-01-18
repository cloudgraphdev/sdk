import { Logger } from '../logger'

export interface GraphQLInputData {
  query: string
  connectedData: any
  input?: any
  patch?: any
  name: string
}

export interface GraphQLQueryData {
  query: string
  input?: any
  variables: {
    input?: any
    patch?: any
  }
}

export interface StorageEngineConnectionConfig {
  scheme: string
  host: string
  port: string
}

export interface StorageEngineConfig extends StorageEngineConnectionConfig {
  type: string
  logger: Logger
}

export interface StorageEngine {
  get host(): string

  healthCheck: (showInitialStatus?: boolean) => Promise<boolean>

  setSchema: (schema: string[]) => Promise<void>

  validateSchema: (schema: string[], versionString: string) => Promise<void>

  getSchema: () => Promise<string>

  query: (query: string, path?: string) => Promise<any>

  push: (data: GraphQLInputData) => void

  run: (dropData?: boolean) => Promise<void>
}
