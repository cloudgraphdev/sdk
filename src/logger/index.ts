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
  }

  level: LogLevel

  logger: Ora

  startText: string

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

  private parseMessage(msg: string | any): string {
    if (typeof msg === 'object') {
      return JSON.stringify(msg, null, 2)
    }
    return msg
  }

  startSpinner(msg: string): Ora {
    this.startText = msg
    return this.logger.start(msg)
  }

  info(msg: string | any): void {
    if (this.level >= LogLevel.Info) this.logger.info(this.parseMessage(msg))
  }

  error(msg: string | any): void {
    if (this.level >= LogLevel.Error) this.logger.fail(this.parseMessage(msg))
  }

  success(msg: string | any): void {
    if (this.level >= LogLevel.Success)
      this.logger.succeed(this.parseMessage(msg))
  }

  warn(msg: string | any): void {
    if (this.level >= LogLevel.Warn) this.logger.warn(this.parseMessage(msg))
  }

  debug(msg: string | any): void {
    if (this.level >= LogLevel.Trace) this.logger.info(this.parseMessage(msg))
  }
}

export default new Logger(process.env.CG_DEBUG)
