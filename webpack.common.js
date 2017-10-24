const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [ /node_modules/ ],
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // Adds CSS to the DOM by injecting a <style> tag
                    },
                    {
                        loader: 'css-loader' //  interprets @import and url() like import/require() and will resolve them.
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [ autoprefixer ];
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
}