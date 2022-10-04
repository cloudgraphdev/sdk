import { DocumentNode } from 'graphql'
import inquirer from 'inquirer'

import { Logger } from '../logger'
import { Opts, ProviderData } from '../types'

export default abstract class Provider {
  constructor(config: any) {
    this.logger = config.logger
    this.config = config.provider ?? {}
  }

  interface = inquirer

  logger: Logger

  config: any

  // eslint-disable-next-line
  async configure(flags: any): Promise<{[key: string]: any}> {
    throw new Error('Function configure has not been defined')
  }

  getSchema(): DocumentNode {
    throw new Error('Function getSchema has not been defined')
  }

  // eslint-disable-next-line
  async getData({ opts }: { opts: Opts }): Promise<ProviderData> {
    throw new Error('Function getData has not been defined')
  }
}
