
const { getAst, getDeps, getCode } = require('./parser')

class Compiler {
  constructor(options = {}) {
    this.options = options
  }

  // 启动 webpack 打包
  run() {
    // 入口文件路径
    const filePath = this.options.entry
    // 1. 将文件解析成 ast
    const ast = getAst(filePath)
    // 2. 获取 ast 中所有的依赖
    const deps = getDeps(ast, filePath)
    // 3. 将 ast 解析成代码
    const code = getCode(ast)

    console.log(ast)
    console.log(deps) 
    console.log(code)
  }
}

module.exports = Compiler