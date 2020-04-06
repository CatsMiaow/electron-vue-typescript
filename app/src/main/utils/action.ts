import { BrowserWindow, dialog, ipcMain, MessageBoxReturnValue } from 'electron';

export async function destroy(mainWindow: BrowserWindow): Promise<void> {
  const click: MessageBoxReturnValue = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['Confirm', 'Cancel'],
    title: 'Reset',
    message: 'All registered data is deleted and the program is terminated.\nWould you like to continue?',
  });
  if (click.response > 0) {
    return;
  }

  ipcMain.emit('destroy');
}
