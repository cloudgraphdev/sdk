import logger, {Logger} from './logger'
import Client from './client'
import {Opts, Service, ServiceConnection} from './types'

export type { Opts, Service, ServiceConnection, Logger, Client }
export default {
  logger,
  Client
}