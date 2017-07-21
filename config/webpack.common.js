const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');

const path = helpers.root('app', 'src', 'renderer');


module.exports = {
  entry: {
    vendor: `${path}/vendor.ts`,
    app: `${path}/main.ts`,
  },

  resolve: {
    extensions: ['.js', '.ts', '.html'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path,
    },
  },

  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      options: {
        configFile: `${path}/tslint.json`,
      },
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      options: {
        configFileName: `${path}/tsconfig.json`,
      },
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'file-loader?name=assets/[name].[hash].[ext]',
    }, {
      test: /\.css$/,
      exclude: `${path}/components`,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader?sourceMap',
      }),
    }, {
      test: /\.css$/,
      include: `${path}/components`,
      loader: 'raw-loader',
    }],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor'],
    }),

    new HtmlWebpackPlugin({
      template: 'app/src/renderer/index.html',
    }),

    // new CopyWebpackPlugin([{ from: '' }]),
  ],

  target: 'electron-renderer',
};
