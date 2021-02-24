const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const { validate } = require('schema-utils')
const globby = require('globby')
const webpack = require('webpack')

const schema = require('./schema.json')

const readFile = promisify(fs.readFile)
const { RawSource } = webpack.sources

class CopyWebpackPlugin  {
  constructor(options = {}) {
    // 验证 options 是否符合规范
    validate(schema, options, {
      name: "CopyWebpackPlugin"
    })

    this.options = options
  }

  apply(compiler) {
    // 初始化 compilation 的钩子
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
      // 添加资源的 hooks
      compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async(cb) => {
        // 将 from 中的资源复制到 to 中，输出出去
        const { from, ignore} = this.options
        // 我们希望默认为 '.' 输出到当前目录，如果有值输出到响应路径去
        const to = this.options.to ? this.options.to : '.'

        // context 就是 webpack 配置中的 context
        // 运行指令的目录（我们最终会在项目的根目录运行）
        const context = compiler.options.context  // process.cwd(): 运行代码的目录
        // 将输入路径变成绝对路径
        const absoluteFrom = path.isAbsolute(from) ? from : path.resolve(context, from)
        
        // 1. 过滤掉需要忽略 (ignore) 的文件
        // globby(要处理的文件夹， options)
        const paths = await globby(absoluteFrom, { ignore })

        console.log(paths) // 所有要加载的文件路径数组

        // 2. 读取 paths 中的所有资源

        const files = await Promise.all(
          // map 方法遇到 async 并不会等，而是会直接往下执行
          // paths.map 返回的是一个数组，数组里面是 async 函数的每一个 promise 项
          // 所以 promise.all([]) 方法就会等这个数组里面的每一个 promise 对象都变为成功状态，才会接着往下执行
          // 所以我们在 Promise.all 前面加上 await 就可以了
          paths.map(async (absolutePath) => {
            // 读取文件
            const data = await readFile(absolutePath)
            // basename 得到的是最后的文件名称
            const relativePath = path.basename(absolutePath)
            // 和 to 属性结合
            // 没有 to --> reset.css
            // 有 to --> css/reset.css
            const filename = path.join(to, relativePath)



            return {
              // data 就是文件数据
              data,
              // 文件名称
              filename
            }
          })
        )
        
        // 3. 生成 webpack 格式的资源
          const assets = files.map((file) => {
            const source = new RawSource(file.data)

            return {
              source,
              filename: file.filename
            }
          })

        // 4. 添加 compilation 中，输出出去
        assets.forEach((asset) => {
          compilation.emitAsset(asset.filename, asset.source)
        })

        cb()
      })
    })
  }

}

module.exports = CopyWebpackPlugin