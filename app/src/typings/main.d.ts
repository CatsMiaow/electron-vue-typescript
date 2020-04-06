// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Database } from '../types';

declare global {
  namespace NodeJS {
    interface Global {
      db: Database;
      logPath: string;
      appPath: string;
    }
  }
}
