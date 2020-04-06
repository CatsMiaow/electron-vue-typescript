const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const baseConfig = require('./webpack.renderer.base.js');
const { root } = require('./helper');

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',

  output: {
    path: root('app', 'dist', 'renderer'),
    publicPath: 'http://localhost:3000/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
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
