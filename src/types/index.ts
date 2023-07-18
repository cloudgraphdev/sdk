import { Logger } from '../logger'

// Deprecated
export interface Opts {
  devMode: boolean
  debug: boolean
  logger: Logger
}
export interface ServiceConnection {
  id: string
  resourceType: string
  relation: string
  field: string
  insertAfterNodeInsertion?: boolean
}
export interface Service {
  format: ({
    service,
    region,
    account,
  }: {
    service: any
    region: string
    account: string
  }) => any
  getConnections?: ({
    service,
    region,
    account,
    data,
  }: {
    service: any
    region: string
    account: string
    data: any
  }) => { [key: string]: ServiceConnection[] }
  mutation?: string
  getData: ({
    regions,
    config,
    opts,
    account,
    rawData,
  }: {
    regions?: string
    config: any
    opts: Opts
    account?: string
    rawData: any
  }) => any
}

export interface EntityMutations {
  query?: string
  upsert: string
  delete: string
}

export interface Entity {
  className?: string
  name: string
  mutation: EntityMutations | string
  data: any[] | any
}

export interface ProviderError {
  service: string
  function: string
  message: string
}

export interface ProviderData {
  entities: Entity[]
  connections: { [key: string]: ServiceConnection[] }
  errors?: ProviderError[]
}

export type LoggerInput = string | { [key: string]: any } | unknown

export type SchemaMap = {
  [schemaName: string]: string
}
