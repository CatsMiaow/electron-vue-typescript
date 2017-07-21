/**
 * logger.ts
 */
import { app } from 'electron';
import * as winston from 'winston';

import { template } from './utils';

interface IOptions {
   timestamp: Function;
   level: string;
   message: string;
   meta: object;
}

const logPath: string = `${app.getPath('userData')}/logs`;

const defaultOption: winston.FileTransportOptions = { // 기본 옵션 설정
  timestamp(): string {
    return new Date().toLocaleString();
  },
  formatter(options: IOptions): string {
    return template`${options.timestamp()} - ${options.level}:
      ${(options.message || '') +
        (options.meta
          && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}`;
  },
  json: false
};

// error, warn, info, verbose, debug, silly
const logger: winston.LoggerInstance = new (winston.Logger)({
  transports: [
    new (winston.transports.File)(Object.assign(defaultOption, {
      name: 'main-all',
      filename: `${logPath}/main.log`,
      maxsize: 1024 * 1024 * 8, // 8MB
      maxFiles: 20
    })),
    new (winston.transports.File)(Object.assign(defaultOption, {
      name: 'main-error',
      level: 'error',
      filename: `${logPath}/main-error.log`,
      maxsize: 1024 * 1024 * 8, // 8MB
      maxFiles: 10
    }))
  ],
  exitOnError: false
});

// 콘솔 출력 추가
if (process.env.ENV === 'development') {
  logger.add(winston.transports.Console);
}

export { logger };
