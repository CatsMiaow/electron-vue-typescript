const packager = require('electron-packager');
const rebuild = require('electron-rebuild').rebuild;
const helpers = require('./helpers');

console.log('> Packaging...');

packager({
  name: 'Tested',
  arch: 'all',
  platform: 'win32',
  electronVersion: '1.6.11',
  dir: helpers.root('app'),
  icon: helpers.root('app/resource/electron.ico'),
  out: helpers.root('package'),
  overwrite: true,
  prune: true,
  asar: true,
  ignore: /^\/(src)/,
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    rebuild(buildPath, electronVersion, arch)
      .then(() => callback())
      .catch(error => callback(error));
  }],
}, (err, appPaths) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`> Package complete: ${appPaths}`);
});
