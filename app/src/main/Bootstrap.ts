import { app, BrowserWindow, dialog, globalShortcut, ipcMain, Tray } from 'electron';
import { unlinkSync } from 'fs';
import LevelDOWN from 'leveldown';

import { Database } from '@/../types';
import { dbPath, isDev, lvPath } from '@/config';
import { MenuBar } from '@/MenuBar';
import { levelDefaults, logger } from '@/utils';

export class Bootstrap {
  public mainWindow!: Electron.BrowserWindow;
  private webContents!: Electron.WebContents;
  private tray!: Electron.Tray;
  private readonly appPath: string = global.appPath;

  constructor(public db: Database) { }

  // Ready
  public ready: () => Promise<void> = async () => {
    try {
      // Create DB default
      await levelDefaults({
        setting: {},
      });

      await this.createWindow();
    } catch (err) {
      logger.error('Ready ', err);
      dialog.showErrorBox('Ready', err.message);
    }
  };

  private async createWindow(): Promise<void> {
    this.mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      resizable: false,
      maximizable: false,
      // alwaysOnTop: true,
      title: 'yourtitle',
      icon: `${this.appPath}/resource/icon.png`,
      show: false,
      backgroundColor: '#FAFAFA',
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      },
    });
    this.webContents = this.mainWindow.webContents;

    if (isDev) {
      globalShortcut.register('CommandOrControl+R', () => this.webContents.reload());
    }

    const menubar: MenuBar = new MenuBar(this.mainWindow);
    menubar.setAppMenu();

    await this.setMainWindow();
    this.setWebContents();
    this.setIpcMain();
    this.setTray();
  }

  private async setMainWindow(): Promise<void> {
    await this.mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${this.appPath}/dist/renderer/index.html`);

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });

    this.mainWindow.on('minimize', (event: Electron.Event) => {
      event.preventDefault();
      this.mainWindow.hide();
    });

    this.mainWindow.on('closed', () => {
      delete this.mainWindow;
    });
  }

  private setWebContents(): void {
    this.webContents.on('did-finish-load', () => {
      //
    });
  }

  private setIpcMain(): void {
    // Data Reset
    ipcMain.on('destroy', async () => {
      logger.info('destroy');
      try {
        await this.webContents.session.clearStorageData({ storages: ['localstorage', 'cachestorage'] });
        await this.db.close();
        LevelDOWN.destroy(lvPath, (err: Error | undefined) => {
          if (err) {
            throw err;
          }
          try {
            unlinkSync(`${dbPath}/yourdb.db`);
          } catch { /**/ }
          app.quit();
        });
      } catch (err) {
        logger.error('Destroy ', err);
        dialog.showErrorBox('Destroy', err.message);
      }
    });
  }

  private setTray(): void {
    this.tray = new Tray(`${this.appPath}/resource/icon.png`);
    this.tray.setToolTip('yourtitle');
    this.tray.on('click', () => {
      this.mainWindow.show();
    });
  }
}
