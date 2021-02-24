/**
 * 使用 npx webpack 来打包
 */

const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: 'loader1'
        use: [
          // 使用 use 多个loader时，执行顺序是从右到左
          'loader1',
          'loader2',
          {
            loader: 'loader3',
            options: {
              name: 'jack',
              age: 18
            }
          }
           
        ]
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