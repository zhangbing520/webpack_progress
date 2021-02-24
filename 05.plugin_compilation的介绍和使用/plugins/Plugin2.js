const fs = require('fs')
const util = require('util')

const webpack = require('webpack')
const { RawSource } = webpack.sources

const path = require('path')

// 将 fs.readFile 方法变成基于 Promise 风格的异步方法
const readFile = util.promisify(fs.readFile)


class  Plugin2 {

  apply(compiler) {
    // 初始化 compilation 钩子
    compiler.hooks.thisCompilation.tap('Plugin2', (compilation) => {
      // debugger
      // console.log(compilation);
      // 添加资源
      compilation.hooks.additionalAssets.tapAsync('Plugin2', async (cb) => {
        // debugger
        // console.log(compilation)

        // 往要输出资源中，添加一个 a.txt 的文件
        const content = 'hello plugin2'
        compilation.assets['a.txt'] = {
          // 文件大小
          size() {
            return content.length
          },
          // 文件内容
          source() {
            return content
          }
        }

        const data = await readFile(path.resolve(__dirname, 'b.txt'))

        // compilation.assets['b.txt'] = new RawSource(data)

        compilation.emitAsset('b.txt', new RawSource(data))

        cb()
      })
    })
  }
}

module.exports = Plugin2