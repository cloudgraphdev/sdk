import logger, { Logger } from './logger'
import Client from './client'
import RulesEngine from './rules-engine'
import {
  StorageEngineConnectionConfig,
  StorageEngineConfig,
  StorageEngine,
  GraphQLInputData,
  GraphQLQueryData,
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
import Plugin, {
  PluginManager,
  PluginModule,
  PluginType,
  ConfiguredPlugin,
} from './plugins/types'
import pluginMap from './plugins/base/pluginMap'
import {
  sortResourcesDependencies,
  intersectStringArrays,
  getKeyByValue,
  toCamel,
} from './utils'
import {
  mergeSchemas,
  getSchemaFromFolder,
  generateSchemaMapDynamically,
} from './utils/schema'

// Export Utils
export {
  sortResourcesDependencies,
  intersectStringArrays,
  getKeyByValue,
  toCamel,
  mergeSchemas,
  getSchemaFromFolder,
  generateSchemaMapDynamically,
}

export { PluginModule, PluginType, Result, pluginMap }

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
  GraphQLQueryData,
  SchemaMap,
  Plugin,
  PluginManager,
  ConfiguredPlugin,
}
export default {
  logger,
  Client,
  RulesEngine,
}
