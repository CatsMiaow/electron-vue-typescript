import { remote } from 'electron';
import logger from 'electron-log';
import * as path from 'path';

const logPath: string = remote.getGlobal('logPath');

// error, warn, info, verbose, debug, silly
logger.transports.file.resolvePath = (): string => path.join(logPath, 'renderer.log');
logger.transports.file.maxSize = 1048576 * 7;

export { logger };
