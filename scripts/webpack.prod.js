const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackCommon = require('./webpack.common.js');
const { outputPath } = require('./path.js');

module.exports = merge(webpackCommon, {
  mode: 'production',
  output: {
    publicPath: 'dist/',
    path: outputPath,
    filename: '[name].[hash].js',
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ parallel: true })],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'three',
          var: 'THREE',
          path: 'build/three.min.js',
        },
      ],
      publicPath: '../node_modules',
    }),
    new MiniCssExtractPlugin({
      filename: `[name].[hash].css`,
    }),
  ],
});
