import logger, { Logger } from './logger'
import Client from './client'
import RulesEngine from './rules-engine'
import {
  StorageEngineConnectionConfig,
  StorageEngineConfig,
  StorageEngine,
  GraphQLInputData,
} from './storage'
import {
  Opts,
  Service,
  ServiceConnection,
  ProviderData,
  Entity,
  SchemaMap,
} from './types'
import {
  Rule,
  RuleFinding,
  Result,
  JsRule,
  JsonRule,
  Engine,
} from './rules-engine/types'
import Plugin, { PluginModule, PluginType } from './plugin'
import pluginMap from './plugin/pluginMap'
import cloudGraphPlugin from './plugin/cgPlugins'
import {
  mergeSchemas,
  getSchemaFromFolder,
  generateSchemaMapDynamically,
} from './utils/schema'

export {
  PluginModule,
  PluginType,
  Result,
  cloudGraphPlugin,
  pluginMap,
  mergeSchemas,
  getSchemaFromFolder,
  generateSchemaMapDynamically,
}

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
  StorageEngineConnectionConfig,
  StorageEngineConfig,
  StorageEngine,
  GraphQLInputData,
  SchemaMap,
  Plugin,
}
export default {
  logger,
  Client,
  RulesEngine,
}
