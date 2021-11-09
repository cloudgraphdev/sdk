import { Logger } from '../logger'

// Deprecated
export interface Opts {
  devMode: boolean
  debug: boolean
  logger: Logger
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
    afterNodeInsertion
  }: {
    service: any
    region: string
    account: string
    data: any
    afterNodeInsertion?: boolean
  }) => any
  mutation: string
  getData: ({
    regions,
    config,
    opts,
    rawData,
  }: {
    regions: string
    config: any
    opts: Opts
    rawData: any
  }) => any
}

export interface ServiceConnection {
  id: string
  resourceType: string
  relation: string
  field: string
}

export interface Entity {
  className?: string
  name: string
  mutation: string
  data: any[]
}

export interface ProviderData {
  entities: Entity[]
  connections: { [key: string]: ServiceConnection[] }
  additionalConnections?: { [key: string]: ServiceConnection[] }
}

export type LoggerInput = string | { [key: string]: any } | unknown
