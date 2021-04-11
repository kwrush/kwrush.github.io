const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackCommon = require('./webpack.common.js');
const { outputPath } = require('./path.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(webpackCommon, {
  mode: 'production',
  output: {
    publicPath: 'dist',
    path: outputPath,
    filename: '[name].[hash].js',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ parallel: true }), new CssMinimizerPlugin()],
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
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'three',
          var: 'THREE',
          path: 'build/three.min.js',
        },
        {
          name: '@tweenjs/tween.js',
          var: 'TWEEN',
          path: 'dist/tween.umd.js',
        },
      ],
      publicPath: '../node_modules',
    }),
    new MiniCssExtractPlugin({
      filename: `[name].[hash].css`,
    }),
  ],
});
