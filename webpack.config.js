const slsw = require('serverless-webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  context: __dirname,
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: true,
    cacheWithContext: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2020'
        }
      }
    ]
  }
}