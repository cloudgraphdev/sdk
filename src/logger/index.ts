const consola = require('consola')

// const consola = require('consola')

// export const pinoLogger = pino({ name: 'cloud-graph', prettyPrint: process.env.NODE_ENV === 'development' })

export default class Logger {
  constructor(debug: boolean) {
    this.debugMode = debug
  }

  debugMode

  log(msg: string | Array<any> | Object, options: {verbose?: boolean; level?: string} = {}): void {
    const {verbose, level = 'info'} = options
    if (verbose) {
      if (this.debugMode) {
        consola[level](msg)
      }
    } else {
      consola[level](msg)
    }
  }
}