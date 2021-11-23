import logger, { Logger } from './logger'
import Client from './client'
import RulesEngine from './rules-engine'
import { Opts, Service, ServiceConnection, ProviderData, Entity } from './types'
import {
  Rule,
  RuleFinding,
  Result,
  JsRule,
  JsonRule,
  Engine,
} from './rules-engine/types'

export type {
  Opts,
  Service,
  ServiceConnection,
  Logger,
  Client,
  ProviderData,
  Engine,
  Rule,
  RuleFinding,
  JsRule,
  JsonRule,
  Entity,
}
export default {
  logger,
  Client,
  RulesEngine,
  Result,
}
