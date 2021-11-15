import ora, { Ora } from 'ora'
import fs from 'fs'

import { LoggerInput } from '../types'

export enum LogLevel {
  Silent = -1,
  Error = 0,
  Warn = 1,
  Log = 2,
  Info = 3,
  Success = 3,
  Debug = 4,
  Trace = 5,
}

export class Logger {
  constructor(debug: string) {
    const levelRange = ['-1', '0', '1', '2', '3', '4', '5']
    this.level = levelRange.indexOf(debug) > -1 ? Number(debug) : 3
    this.errorLogFile = './cg-debug.log'
    this.logger = ora({ isSilent: this.level === LogLevel.Silent })
    this.spinnerMap = {}
    this.clearLog()
  }

  level: LogLevel

  errorLogFile: string

  logger: Ora

  startText: string

  spinnerMap: { msg?: string; instance?: Ora }

  // Legacy log method
  log(
    msg: string | Array<any> | any,
    options: { verbose?: boolean; level?: string } = {}
  ): void {
    const { verbose, level = 'info' } = options
    if (verbose) {
      // TODO: Implement verbose loggeer
    } else {
      this.logger[level](msg)
    }
  }

  private parseMessage(msg: LoggerInput): string {
    let value = msg
    // Handle error objects to enable them to be stringified
    if (msg instanceof Error) {
      if (this.level > 3) {
        value = msg.stack
      } else {
        value = msg.toString()
      }
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  private clearLog(): void {
    if (this.level >= LogLevel.Trace) {
      fs.writeFileSync(this.errorLogFile, '')
    }
  }

  private writeLog(text: string): void {
    if (this.level >= LogLevel.Trace) {
      fs.appendFileSync(this.errorLogFile, `${text}\n`)
    }
  }

  startSpinner(msg: string): void {
    const instance = this.logger.start(msg)
    this.spinnerMap = { msg, instance }
  }

  successSpinner(msg: string): void {
    if (this.spinnerMap.instance) {
      const { instance } = this.spinnerMap
      instance.succeed(msg)
      this.spinnerMap = {}
    }
  }

  failSpinner(msg: string): void {
    if (this.spinnerMap.instance) {
      const { instance } = this.spinnerMap
      instance.fail(msg)
      this.spinnerMap = {}
    }
  }

  stopSpinner(): string {
    if (this.spinnerMap.instance) {
      const { instance } = this.spinnerMap
      instance.stop()
    }
    return this.spinnerMap.msg
  }

  /**
   * For the functions below, we can not log while a spinner is running. We try to stop the
   * spinner => log info/error/success/warn/debug => restart spinner if there is one
   */
  info(msg: LoggerInput): void {
    if (this.level >= LogLevel.Info) {
      this.stopSpinner()
      this.logger.info(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  error(msg: LoggerInput): void {
    if (this.level >= LogLevel.Error) {
      const parsedMessage = this.parseMessage(msg)
      this.stopSpinner()
      this.logger.fail(parsedMessage)
      this.writeLog(parsedMessage)
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  success(msg: LoggerInput): void {
    if (this.level >= LogLevel.Success) {
      this.stopSpinner()
      this.logger.succeed(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  warn(msg: LoggerInput): void {
    if (this.level >= LogLevel.Warn) {
      this.stopSpinner()
      this.logger.warn(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  debug(msg: LoggerInput): void {
    if (this.level >= LogLevel.Trace) {
      const parsedMessage = this.parseMessage(msg)
      this.stopSpinner()
      this.logger.info(parsedMessage)
      this.writeLog(parsedMessage)
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }
}

export default new Logger(process.env.CG_DEBUG)
