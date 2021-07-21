import {Logger} from '../logger'

// Deprecated
export interface Opts {
  devMode: boolean;
  debug: boolean;
  logger: Logger;
}

export interface Service {
  format: any,
  getConnections?: any,
  mutation: string,
  getData: any
}

export interface ServiceConnection {
  id: string,
  resourceType: string,
  relation: string
  field: string
}