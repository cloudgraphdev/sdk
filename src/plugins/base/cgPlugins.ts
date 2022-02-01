import { PluginType } from '../types'

// Define supported plugins by CG at the config file
export default {
  policies: 'policyPack',
} as { [configName: string]: PluginType }
