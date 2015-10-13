import path from 'path';
import webpack from 'webpack';
import cssnext from 'cssnext';
import writeStats from './utils/write-stats';

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

export default {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/'
  },
  module: {
    preLoaders: [
      {test: JS_REGEX, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: /\.json$/, exclude: /node_modules/, loader: 'json'},
      {test: JS_REGEX, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // write webpack stats
    function() { this.plugin('done', writeStats); },
  ],
  postcss: [
    cssnext({browsers: 'last 2 versions'})
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.babel', '.es6', '.json'],
    modulesDirectories: ['node_modules', 'app']
  }
}
