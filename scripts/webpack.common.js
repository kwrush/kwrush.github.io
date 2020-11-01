const HtmlWebpackPlugin = require('html-webpack-plugin');

const { entryPath, templatePath, root } = require('./path');

module.exports = {
  entry: entryPath,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: `${root}/index.html`,
    }),
  ],
};
