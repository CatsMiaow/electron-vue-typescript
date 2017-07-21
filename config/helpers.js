const path = require('path');

const rootPath = path.resolve(__dirname, '..');

const root = (...args) => path.join(...[rootPath].concat(args));


exports.root = root;
