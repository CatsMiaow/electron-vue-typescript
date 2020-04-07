import { app, crashReporter } from 'electron';
import EncodingDown from 'encoding-down';
import * as fs from 'fs';
import LevelDOWN from 'leveldown';
import LevelUp from 'levelup';
import * as path from 'path';

import { apiHost, dataPath, dbPath, isDev, logPath, lvPath } from '@/config';
import { Database } from '@/../types';
import { Bootstrap } from '@/Bootstrap';
import { logger } from '@/utils';

crashReporter.start({
  productName: 'electron-vue-typescript',
  companyName: 'yourcompany',
  submitURL: `${apiHost}/crash`,
  uploadToServer: true,
});

// Create data folder
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, '0707');
}
// Create database folder
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, '0707');
}

const db: Database = LevelUp(EncodingDown(LevelDOWN(lvPath), { valueEncoding: 'json' }));

//#region global
global.db = db;
global.logPath = logPath;
global.appPath = isDev ? path.resolve(__dirname, '..', '..') : app.getAppPath();
//#endregion

const system: Bootstrap = new Bootstrap(db);

const gotTheLock: boolean = app.requestSingleInstanceLock();
if (gotTheLock) {
  app.on('second-instance', () => {
    if (system.mainWindow) {
      if (system.mainWindow.isMinimized()) {
        system.mainWindow.restore();
      }
      system.mainWindow.focus();
    }
  });
} else {
  app.quit();
}

logger.info('Running...');

app.allowRendererProcessReuse = true;
app.on('ready', system.ready);

app.on('window-all-closed', () => {
  // OS X
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // OS X
  if (system.mainWindow === null) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    system.ready();
  }
});
