const path = require('path');

module.exports = {
  root: path.resolve(__dirname, '..'),
  entryPath: path.resolve(__dirname, '../src/index.js'),
  outputPath: path.resolve(__dirname, '../dist'),
  templatePath: path.resolve(__dirname, '../src/index.html'),
};
