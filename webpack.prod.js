const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const autoprefixer = require('autoprefixer');
const webpackCommon = require('./webpack.common.js');

module.exports = merge(webpackCommon, {
  devtool: 'source-map',
  plugins: [
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'three',
          var: 'THREE',
          path: 'build/three.min.js'
        }
      ],
      publicPath: '/node_modules'
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
})