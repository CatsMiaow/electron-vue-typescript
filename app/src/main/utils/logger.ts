import logger from 'electron-log';
import * as path from 'path';

import { logPath } from '@/config';

// error, warn, info, verbose, debug, silly
logger.transports.file.resolvePath = (): string => path.join(logPath, 'main.log');
logger.transports.file.maxSize = 1048576 * 7;

export { logger };
