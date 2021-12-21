import { PolicyPackPlugin } from '../rules-engine/types'
import plugins from './plugins'

export default {
  [plugins.policies]: PolicyPackPlugin,
}
