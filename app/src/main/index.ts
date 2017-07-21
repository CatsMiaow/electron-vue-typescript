/**
 * index.ts
 */
import { app } from 'electron';
import * as fs from 'fs';
import * as PouchDB from 'pouchdb';
import * as pouchdbFind from 'pouchdb-find';
import { Bootstrap } from './Bootstrap';
import { logger } from './logger';

// 서버에 오류 보고
// https://github.com/electron/electron/blob/master/docs-translations/ko-KR/api/crash-reporter.md
// crashReporter.start({ ... });

// https://pouchdb.com/api.html#query_index
PouchDB.plugin(pouchdbFind);

const dataPath: string = app.getPath('userData');
const db: PouchDB.Database<{}> = new PouchDB(`${dataPath}/pouchdb/tested.db`);

// 렌더러와 객체를 공유하기 위한 글로벌 변수 설정
global.db = {
  tested: db,
  localData: new PouchDB(`${dataPath}/pouchdb/localData.db`)
};
global.dataPath = dataPath;
// global.config, global.setting...

const system: Bootstrap = new Bootstrap(db);

// 단일 인스턴스 처리
const shouldQuit: boolean = app.makeSingleInstance((argv: string[], workingDirectory: string) => {
  if (system.mainWindow) {
    if (system.mainWindow.isMinimized()) {
      system.mainWindow.restore();
    }

    system.mainWindow.focus();
  }
});
// 중복 앱 종료
if (shouldQuit) {
  app.quit();
}

logger.info('Running...');

// 데이터 폴더 생성
if (!fs.existsSync(`${dataPath}/pouchdb`)) {
  fs.mkdirSync(`${dataPath}/pouchdb`, '0707');
}
// 로그 폴더 생성
if (!fs.existsSync(`${dataPath}/logs`)) {
  fs.mkdirSync(`${dataPath}/logs`, '0707');
}

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
    system.ready();
  }
});
