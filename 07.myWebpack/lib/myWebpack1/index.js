const fs = require('fs')
const path = require('path')

const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

function myWebpack(config) {
  return new Compiler(config)
}

class Compiler {
  constructor(options = {}) {
    this.options = options
  }

  // 启动 webpack 打包
  run() {
    // 1. 读取入口文件内容
    // 入口文件路径
    const filePath = this.options.entry
    const file = fs.readFileSync(filePath, 'utf-8')
    // 2. 将其解析成 ast 抽象语法树(方便分析依赖)
    const ast = babelParser.parse(file, {
      sourceType: 'module' // 解析文件的模块化方案是 ES MOdule
    })
    // console.log(ast)

    // 获取到文件夹路径
    const dirname = path.dirname(filePath)

    // 定义存储依赖的容器
    const deps = {}

    // 收集依赖
    traverse(ast, {
      // 内部会遍历 ast 中 program.body， 判断里面语句类型
      // 如果 type: ImportDeclaration 就会触发当前函数
      ImportDeclaration({node}) {
        // 文件相对路径: './add.js'
        const relativePath = node.source.value
        // 生成基于入口文件的绝对路径
        const absolutePath = path.resolve(dirname, relativePath)
        // 添加依赖
        deps[relativePath] = absolutePath
      }
    })
   
    console.log(deps) 
                        /*
                          {
                            './add': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add',
                            './count': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count'
                          }
                        */
    

    // 编译代码： 将代码中浏览器不能识别的语法进行编译 
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })

    console.log(code)
                      /*
                        "use strict";
                        var _add = _interopRequireDefault(require("./add"));
                        var _count = _interopRequireDefault(require("./count"));
                        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
                        console.log((0, _add["default"])(1, 2));
                        console.log((0, _count["default"])(3, 1));
                      */

  }
}

module.exports = myWebpack