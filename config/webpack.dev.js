const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = 'development';
process.env.NODE_ENV = ENV;
process.env.ENV = ENV;

module.exports = webpackMerge(commonConfig, {
  devtool: 'eval-source-map',

  output: {
    path: helpers.root('app', 'dist', 'renderer'),
    publicPath: 'http://localhost:3000/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
});
