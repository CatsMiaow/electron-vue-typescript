import { app } from 'electron';
import { join } from 'path';

const isDev: boolean = (process.env.NODE_ENV === 'development');
const apiHost: string = isDev ? 'http://localhost:8100' : 'https://yourdomain.com';

app.setAppLogsPath();
const dataPath: string = app.getPath('userData');
const logPath: string = app.getPath('logs');
const dbPath: string = join(dataPath, 'databases');
const lvPath: string = join(dbPath, 'level');

export { isDev, apiHost, dataPath, logPath, dbPath, lvPath };
