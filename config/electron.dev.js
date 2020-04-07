const electron = require('electron');
const electronDebug = require('electron-debug');
const installExtension = require('electron-devtools-installer');

// https://github.com/sindresorhus/electron-debug
electronDebug({ showDevTools: 'undocked' });

// https://github.com/MarshallOfSound/electron-devtools-installer
electron.app.on('ready', () => {
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));
});

require('../app/dist/main/app');
