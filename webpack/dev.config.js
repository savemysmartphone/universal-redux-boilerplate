import path from 'path';
import webpack from 'webpack';
import { isArray } from 'lodash';

import startExpress from './utils/start-express';
import baseConfig from './base.config.js';

const PORT = parseInt(process.env.PORT, 10) + 1 || 3001;
const LOCAL_IP = require('dev-ip')();
const HOST = isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`;

export default {
  server: {
    port: PORT,
    options: {
      publicPath: PUBLIC_PATH,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunksModule: false
      }
    }
  },
  webpack: {
    ...baseConfig,
    devtool: 'cheap-module-source-map',
    entry: {
      app: [
        `webpack-hot-middleware/client?path=//${HOST}:${PORT}/__webpack_hmr`,
        './app/index.js'
      ]
    },
    output: {
      ...baseConfig.output,
      publicPath: PUBLIC_PATH
    },
    module: {
      ...baseConfig.module,

      loaders: [
        ...baseConfig.module.loaders,
        {test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]'},
        {test: /\.css$/, exclude: /node_modules/, loader: 'style!css!postcss'}
      ]
    },
    plugins: [
      ...baseConfig.plugins,

      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify('true'),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
      }),

      function() { this.plugin('done', startExpress); }
    ]
  }
};
