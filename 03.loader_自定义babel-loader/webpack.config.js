/**
 * 使用 npx webpack 来打包
 */

const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babelLoader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    ]
  },
  // 配置 loader 的解析规则
  resolveLoader: {
    // 配置 loader 的查找路径
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  }
}