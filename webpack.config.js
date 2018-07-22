/* global  __dirname */

const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')

const config = {
  entry: {
    index: './src/index',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // produces only index.js
    library: packageJson.name,
    libraryTarget: 'umd',
  },
  externals: {
    // react: 'commonjs react',
    // 'react-dom': 'commonjs react-dom',
    react: 'react',
    'react-dom': 'react-dom',
  },
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    ...(process.env.NODE_ENV !== 'production'
      ? []
      : [new webpack.optimize.UglifyJsPlugin({ sourceMap: true })]),
  ],
  stats: {
    children: false,
  },
}

module.exports = config
