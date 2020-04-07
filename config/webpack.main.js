const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const rimraf = require('rimraf');

const { root, isDev } = require('./helper');

const path = root('app', 'src', 'main');
const dist = root('app', 'dist', 'main');
rimraf.sync(dist);

const baseConfig = {
  entry: {
    app: `${path}/app.ts`,
  },

  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
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
    }],
  },

  plugins: [],

  target: 'electron-main',
  externals: [nodeExternals(), nodeExternals({ modulesDir: `${path}/../../node_modules` })],
  node: { __dirname: true, __filename: true },
};

if (isDev) { // Development
  module.exports = webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'eval-source-map',

    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
      }),
    ],
  });
} else { // Production
  module.exports = webpackMerge(baseConfig, {
    mode: 'production',
    devtool: 'nosources-source-map',

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
            compress: true,
            output: {
              comments: false,
              beautify: false
            },
          }
        }),
      ],
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        DEBUG: false,
      }),
    ],
  });
}
