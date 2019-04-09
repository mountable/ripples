const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    ripples: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new MinifyPlugin()
  ]
}