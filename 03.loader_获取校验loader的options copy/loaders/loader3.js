// loader 本质上是一个函数

// 获取 loader 的 options 选项
const { getOptions } = require('loader-utils')

// 校验 loader 的 options 选项是否符合 schema.json 的规范
const { validate } = require('schema-utils')

const schema = require('./schema.json')

module.exports = function(content, map, meta) {
  // 获取 options
  const options = getOptions(this)

  // 校验 options 是否合法
  validate(schema, options, {
    name: 'loader3'
  })

  console.log(333, options);

  return content
}

module.exports.pitch = function(){
  console.log('pitch 333');
}