// const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rimraf = require('rimraf');

const { isDev, root } = require('./helper');

const path = root('app', 'src', 'renderer');
rimraf.sync(root('app', 'dist', 'renderer'));

module.exports = {
  entry: {
    vendor: `${path}/vendor.ts`,
    app: `${path}/app.ts`,
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
      exclude: /node_modules/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        cache: true,
        failOnError: true,
        configFile: `${path}/../../../.eslintrc`,
      },
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      options: {
        configFileName: `${path}/tsconfig.json`,
        declaration: isDev,
        sourceMap: isDev,
        inlineSources: isDev,
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
        use: [{
          loader: 'css-loader',
          options: { sourceMap: isDev },
        }],
      }),
    }, {
      test: /\.css$/,
      include: `${path}/components`,
      loader: 'raw-loader',
    }],
  },

  /* optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  }, */

  plugins: [
    new HtmlPlugin({
      template: 'app/src/renderer/index.html',
    }),
  ],

  target: 'electron-renderer',
};
