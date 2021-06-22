import {Provider, ValueOrPromise} from '@loopback/core';
import {createLogger, format, Logger as Winston, transports} from 'winston';



export class WinstonLogger {
  logger: Winston;

  constructor() {
    const logFormat = format.combine(
      format.uncolorize(),
      format.timestamp(),
      format.printf(
        (log) => `[${log.timestamp}] ${log.level} :: ${log.message}`,
      ),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
      level:
        process.env.LOG_LEVEL ??
        'info',
    });
  }

  logInfo(info: string): void {
    this.logger.info(info);
  }

  logError(error: string): void {
    this.logger.error(error);
  }
}

export interface ILogger {
  logInfo(info: string): void;
  logError(info: string): void;
}

export class LoggerProvider implements Provider<ILogger>{
  logger: ILogger;

  constructor() {
    this.logger = new WinstonLogger();
  }
  value(): ValueOrPromise<ILogger> {
    return this.logger;
  }

}
