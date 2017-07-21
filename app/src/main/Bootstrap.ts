/**
 * Bootstrap.ts
 */
import { BrowserWindow, dialog, ipcMain, Tray } from 'electron';
import * as path from 'path';

import { logger } from './logger';
import { MenuBar } from './MenuBar';

export class Bootstrap {
  public mainWindow: Electron.BrowserWindow;
  public webContents: Electron.WebContents;
  private setting: object;
  private tray: Electron.Tray;
  private appPath: string = path.resolve(__dirname, '..', '..');

  constructor(public db: PouchDB.Database<{}>) {}

  // 일반 함수는 this 오류를 호출하여 화살표 함수로 처리
  public ready = (): void => { // Ready
    // DB 인덱스 생성 및 초기 데이터 입력
    this.db.createIndex({
      index: { fields: ['type'] }
    }).then((index: PouchDB.Find.CreateIndexResponse<{}>): Promise<{}> => {
      if (index.result !== 'created') {
        return this.db.get('setting');
      }

      return Promise.all([
        this.db.bulkDocs([
          { _id: 'setting', type: 'setting', item: null }
        ])
      ]);
    }).then((result: PouchDB.Core.Response[]) => {
      if (!Array.isArray(result)) {
        this.setting = result;
      }

      this.createWindow();
    }).catch((err: Error) => {
      logger.error('Database', err);
      dialog.showErrorBox('Database', err.message);
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: false,
      maximizable: false,
      alwaysOnTop: false,
      title: '테스티드',
      icon: `${this.appPath}/resource/electron.ico`,
      show: false,
      backgroundColor: '#fafafa'
    });
    this.webContents = this.mainWindow.webContents;

    new MenuBar(this.mainWindow, this.webContents).setAppMenu();

    this.setMainWindow();
    this.setWebContents();
    this.setIpcMain();
    this.setTray();
  }

  private setMainWindow(): void {
    this.mainWindow.loadURL((process.env.NODE_ENV === 'development')
      ? 'http://localhost:3000'
      : `file://${this.appPath}/dist/renderer/index.html`);

    // 최소화
    this.mainWindow.on('minimize', (event: Electron.Event) => {
      event.preventDefault();
      this.mainWindow.hide();
    });

    this.mainWindow.on('closed', () => {
      delete this.mainWindow;
    });

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });
  }

  private setWebContents(): void {
    this.webContents.on('did-finish-load', () => {
      // Finish Them!
    });
  }

  private setIpcMain(): void {
    ipcMain.on('ping', (event: Function, data: string) => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        buttons: [],
        title: 'PingPong',
        message: 'Ping!'
      });

      this.webContents.send('pong', true);
    });
  }

  private setTray(): void {
    // 트레이 설정
    this.tray = new Tray(`${this.appPath}/resource/electron.ico`);
    this.tray.setToolTip('테스티드');
    this.tray.on('click', () => {
      this.mainWindow.show();
    });
  }
}
