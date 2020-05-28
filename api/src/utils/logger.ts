import Pino, { Logger as PinoLogger } from 'pino'
import Config from './config'

export type Logger = PinoLogger
export default Pino({
  level: Config.logLevel,
  serializers: {
    error: Pino.stdSerializers.err,
  },
})
