import logger, { Logger } from './logger'
import Client from './client'
import { Opts, Service, ServiceConnection, ProviderData } from './types'

export type { Opts, Service, ServiceConnection, Logger, Client, ProviderData }
export default {
  logger,
  Client,
}
