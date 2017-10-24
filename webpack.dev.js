const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');

module.exports = merge(webpackCommon, {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './',
        hot: true,
        port: 3001,
    },
    devtool: 'cheap-module-eval-source-map',
});