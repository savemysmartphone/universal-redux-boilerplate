/* eslint camelcase:0 */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import baseConfig from './base.config.js';

export default {
  ...baseConfig,
  devtool: 'source-map',
  entry: {
    app: './app/index.js'
  },
  module: {
    ...baseConfig.module,

    loaders: [
      ...baseConfig.module.loaders,
      {test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]'},
      {test: /\.(jpe?g|png|gif)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]!image?optimizationLevel=7&progressive&interlaced'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss')}
    ]
  },
  plugins: [
    ...baseConfig.plugins,

    new ExtractTextPlugin('[name]-[hash].css'),

    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    })
  ]
};
