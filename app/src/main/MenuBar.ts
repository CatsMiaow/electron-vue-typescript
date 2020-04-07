import { app, BrowserWindow, dialog, Menu, MenuItem, shell } from 'electron';
import axios, { AxiosResponse } from 'axios';

import { logPath, dbPath } from '@/config';
import { destroy, logger } from '@/utils';

interface Package {
  version: string;
}

export class MenuBar {
  private readonly template: Menu;

  constructor(public mainWindow: BrowserWindow) {
    this.template = Menu.buildFromTemplate([{
      label: 'View',
      submenu: [{
        label: 'Home',
        click(item: MenuItem, focusedWindow: BrowserWindow): void {
          if (focusedWindow) { // focusedWindow.reload();
            mainWindow.webContents.send('router:replace', '/');
          }
        },
      }, {
        type: 'separator',
      }, {
        label: 'Google',
        click(item: MenuItem, focusedWindow: BrowserWindow): void {
          if (focusedWindow) { mainWindow.webContents.send('router:replace', '/webviewer/google'); }
        },
      }, {
        label: 'Google Translate',
        click(item: MenuItem, focusedWindow: BrowserWindow): void {
          if (focusedWindow) { mainWindow.webContents.send('router:replace', '/webviewer/translate'); }
        },
      }],
    }, {
      label: 'Data',
      submenu: [{
        label: 'LocalStorage',
        click(item: MenuItem, focusedWindow: BrowserWindow): void {
          if (focusedWindow) { mainWindow.webContents.send('router:replace', '/data/local-storage'); }
        },
      }, {
        label: 'APIData',
        click(item: MenuItem, focusedWindow: BrowserWindow): void {
          if (focusedWindow) { mainWindow.webContents.send('router:replace', '/data/api-data'); }
        },
      }, {
        type: 'separator',
      }, {
        label: 'Reset',
        click: async (item: MenuItem, focusedWindow: BrowserWindow): Promise<void> => {
          if (focusedWindow) {
            await destroy(focusedWindow);
          }
        },
      }],
    }, {
      role: 'help',
      submenu: [{
        label: 'Open Logs',
        click: async (): Promise<void> => { await shell.openExternal(`file://${logPath}`); },
      }, {
        label: 'Open Databases',
        click: async (): Promise<void> => { await shell.openExternal(`file://${dbPath}`); },
      }, {
        type: 'separator',
      }, {
        label: 'Check for updates...',
        click: async (): Promise<void> => {
          try {
            const body: AxiosResponse<Package> = await axios.get<Package>('http://www.mocky.io/v2/595dd35c10000047017c17c2');
            const version: string = app.getVersion();

            let message = 'No updates available.';
            if (body.data.version && body.data.version > version) {
              message = 'A new version has been released. Blah blah...';
            }

            await dialog.showMessageBox(mainWindow, {
              type: 'info',
              buttons: [],
              title: 'Check for updates...',
              message,
            });
          } catch (err) {
            logger.error('Request ', err);
          }
        },
      }],
    }]);
  }

  public setAppMenu(): void {
    if (process.platform === 'darwin') {
      this.template.insert(2, new MenuItem({
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
        ],
      }));
    }
    Menu.setApplicationMenu(this.template);
  }
}
