import logger, { Logger } from './logger'
import Client from './client'
import RulesEngine from './rules-engine'
import { Opts, Service, ServiceConnection, ProviderData } from './types'

export type { Opts, Service, ServiceConnection, Logger, Client, ProviderData }
export default {
  logger,
  Client,
  RulesEngine,
}
