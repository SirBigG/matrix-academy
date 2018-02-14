const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: __dirname + '/src/server.js',
  target: 'node',
    externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'academy.bundle.js'
  },
  module: {
    loaders: [
        { test: path.join(__dirname, 'src'), loader: 'babel-loader' }
    ]
  },
  //plugins: [
  //  new webpack.optimize.UglifyJsPlugin()
  //],
  node: {
    fs: 'empty',
    net: 'empty'
  }

};

module.exports = config;
