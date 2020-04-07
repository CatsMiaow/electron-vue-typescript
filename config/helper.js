const path = require('path');

const rootPath = path.resolve(__dirname, '..');

exports.isDev = !!(process.env.NODE_ENV === 'development');
exports.root = (...args) => path.join(...[rootPath].concat(args));
