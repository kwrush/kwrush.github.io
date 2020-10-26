const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');

module.exports = merge(webpackCommon, {
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: '../',
    hot: true,
    port: 3000,
  },
  devtool: 'cheap-module-source-map',
});
