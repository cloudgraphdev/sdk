import {Logger} from '../logger'
import {Service, Opts} from '../types'
const inquirer = require('inquirer')
export default abstract class Provider {
  constructor(config: any) {
    this.logger = config.logger
    this.config = config.provider
  }
  interface = inquirer
  logger: Logger
  config: any

  async configure(flags: any): Promise<any> {
    throw new Error('Function configure has not been defined')
  }

  getSchema(): string[] {
    throw new Error(`Function getSchema has not been defined`)
  }

  getService(service: string): Service {
    throw new Error('Function getService has not been defined')
  }

  async getData({
    opts
  }: {opts: Opts}): Promise<any> {
    throw new Error('Function getData has not been defined')
  }
}