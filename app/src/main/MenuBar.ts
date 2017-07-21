/**
 * MenuBar.ts
 */
import { app, dialog, Menu, shell } from 'electron';
import * as request from 'request-promise-native';

import { logger } from './logger';

interface IPackage {
  version: string;
}

export class MenuBar {
  private template: Electron.Menu;
  private dataPath: string = app.getPath('userData');

  constructor(
    public mainWindow: Electron.BrowserWindow,
    public webContents: Electron.WebContents
  ) {
    this.template = Menu.buildFromTemplate([{
      label: 'View',
      submenu: [{
        label: '홈(Home)',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { // focusedWindow.reload();
            webContents.send('router:replace', '/');
          }
        }
      }, {
        label: '구글',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { webContents.send('router:replace', '/webviewer/google'); }
        }
      }, {
        label: '네이버',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { webContents.send('router:replace', '/webviewer/naver'); }
        }
      }, {
        label: '다음',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { webContents.send('router:replace', '/webviewer/daum'); }
        }
      }]
    }, {
      label: 'Data',
      submenu: [{
        label: 'Local',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { webContents.send('router:replace', '/local-data'); }
        }
      }, {
        label: 'API',
        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow): void {
          if (focusedWindow) { webContents.send('router:replace', '/api-data'); }
        }
      }]
    }, {
      role: 'help',
      submenu: [{
        label: 'Github',
        click: (): void => { shell.openExternal('https://github.com/CatsMiaow'); }
      }, {
        label: 'Tested',
        click: (): void => { shell.openExternal('https://tested.kr'); }
      }, {
        type: 'separator'
      }, {
        label: '로그 폴더 열기',
        click: (): void => { shell.openExternal(`file://${this.dataPath}/logs`); }
      }, {
        type: 'separator'
      }, {
        label: '업데이트 확인...',
        click: (): void => {
          request({
            method: 'GET',
            strictSSL: false,
            uri: 'http://www.mocky.io/v2/595dd35c10000047017c17c2',
            json: true
          }).then((body: IPackage) => {
            let message: string = '현재 사용 가능한 업데이트가 없습니다.';
            if (body.version && body.version > app.getVersion()) {
              message = '새로운 버전이 나왔습니다. 블라블라...';
            }

            dialog.showMessageBox(mainWindow, {
              type: 'info',
              buttons: [],
              title: '업데이트 확인...',
              message
            });
          }).catch((err: Error) => {
            logger.error('Request', err);
          });
        }
      }]
    }]);
  }

  public setAppMenu(): void {
    Menu.setApplicationMenu(this.template);
  }
}
