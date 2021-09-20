import ora, { Ora } from 'ora'

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
    this.logger = ora({ isSilent: this.level === LogLevel.Silent })
    this.spinnerMap = {}
  }

  level: LogLevel

  logger: Ora

  startText: string

  spinnerMap: {msg?: string, instance?: Ora}

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

  private parseMessage(msg: string | { [key: string]: any }): string {
    if (typeof msg === 'object') {
      return JSON.stringify(msg, null, 2)
    }
    return msg
  }

  startSpinner(msg): void {
    const instance = this.logger.start(msg)
    this.spinnerMap = {msg, instance}
  }

  successSpinner(msg): void {
    if (this.spinnerMap.instance) {
      const {instance} = this.spinnerMap
      instance.succeed(msg)
      this.spinnerMap = {}
    }
  }

  failSpinner(msg): void {
    if (this.spinnerMap.instance) {
      const {instance} = this.spinnerMap
      instance.fail(msg)
      this.spinnerMap = {}
    }
  }

  stopSpinner(): string {
    if (this.spinnerMap.instance) {
      const {instance} = this.spinnerMap
      instance.stop()
    }
    return this.spinnerMap.msg
  }
  
  spinnerFail(idx, msg): void {
    if (this.spinnerMap[idx]) {
      const {instance} = this.spinnerMap[idx]
      instance.fail(msg)
    }
  }
  
  spinnerSuccess(idx, msg): void {
    if (this.spinnerMap[idx]) {
      const {instance} = this.spinnerMap[idx]
      instance.succeed(msg)
    }
  }

  info(msg: string | { [key: string]: any }): void {
    if (this.level >= LogLevel.Info) {
      this.stopSpinner()
      this.logger.info(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  error(msg: string | { [key: string]: any }): void {
    if (this.level >= LogLevel.Error) {
      this.stopSpinner()
      this.logger.fail(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    } 
  }

  success(msg: string | { [key: string]: any }): void {
    if (this.level >= LogLevel.Success) {
      this.stopSpinner()
      this.logger.succeed(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    }
  }

  warn(msg: string | { [key: string]: any }): void {
    if (this.level >= LogLevel.Warn) {
      this.stopSpinner()
      this.logger.warn(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    } 
  }

  debug(msg: string | { [key: string]: any }): void {
    if (this.level >= LogLevel.Trace) {
      this.stopSpinner()
      this.logger.info(this.parseMessage(msg))
      this.spinnerMap.instance && this.startSpinner(this.spinnerMap.msg)
    } 
  }
}

export default new Logger(process.env.CG_DEBUG)
