const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')
const babel = require('@babel/core')
const util = require('util')

const babelSchema = require('./babelSchema.json')

// babel.transform: 用来编译代码的方法(是一个普通的异步方法)
// util.promisify： 将一个普通的异步函数（babel.transform)转化为一个基于 promise 的异步方法
const transform = util.promisify(babel.transform)

module.exports = function(content, map, meta) {
  // 获取 loader 的 options 配置
  const options = getOptions(this) || {}
  // 检验 babel 的 options 配置
  validate(babelSchema, options, {
    name: 'Babel Loader'
  })

  // 创建异步
  const callback = this.async()

  // 使用 babel 编译代码
  transform(content, options)
    .then(({code, map}) => callback(null, code, map, meta))
    .catch(e => callback(e))

}