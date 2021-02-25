const fs = require('fs')
const path = require('path')
const { getAst, getDeps, getCode } = require('./parser')

class Compiler {
  constructor(options = {}) {
    // options 是 webpack 的配置对象
    this.options = options
    // 所有依赖的容器
    this.modules = []
  }

  // 启动 webpack 打包
  run() {
    // 入口文件路径
    const filePath = this.options.entry
    //第一次构建，得到的入口文件的信息
    const fileInfo = this.build(filePath)

    this.modules.push(fileInfo)
    // 遍历所有的依赖
    this.modules.forEach((fileInfo) => {
      /*
        {
          './add.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add.js',
          './count.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count.js'
        }
      */
      // 取出当前文件的所有依赖
      const deps = fileInfo.deps
      // 遍历
      for (const relativePath in deps) {
        // 依赖文件的绝对路径
        const absolutePath = deps[relativePath]
        // 对依赖文件进行处理
        const fileInfo = this.build(absolutePath)
        // 将处理后的结果添加到 modules 中，后面遍历就会遍历它了
        this.modules.push(fileInfo)
      }
    })

    // console.log(this.modules)
    /* 最初输出的 modules 数组
      > 07.myWebpack@1.0.0 build E:\迅雷下载\webpack_step2\07.myWebpack
      > node ./script/build.js

            [
              {
                filePath: './src/index.js',
                deps: {
                  './add.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add.js',
                  './count.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count.js'
                },
                code: '"use strict";\n' +
                  '\n' +
                  'var _add = _interopRequireDefault(require("./add.js"));\n' +
                  '\n' +
                  'var _count = _interopRequireDefault(require("./count.js"));\n' +
                  '\n' +
                  'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj
            : { "default": obj }; }\n' +
                  '\n' +
                  'console.log((0, _add["default"])(1, 2));\n' +
                  'console.log((0, _count["default"])(3, 1));'
              },
              {
                filePath: 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add.js',
                deps: {},
                code: '"use strict";\n' +
                  '\n' +
                  'Object.defineProperty(exports, "__esModule", {\n' +
                  '  value: true\n' +
                  '});\n' +
                  'exports["default"] = void 0;\n' +
                  '\n' +
                  'function add(x, y) {\n' +
                  '  return x + y;\n' +
                  '}\n' +
                  '\n' +
                  'var _default = add;\n' +
                  'exports["default"] = _default;'
              },
              {
                filePath: 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count.js',
                deps: {},
                code: '"use strict";\n' +
                  '\n' +
                  'Object.defineProperty(exports, "__esModule", {\n' +
                  '  value: true\n' +
                  '});\n' +
                  'exports["default"] = void 0;\n' +
                  '\n' +
                  'function count(x, y) {\n' +
                  '  return x - y;\n' +
                  '}\n' +
                  '\n' +
                  'var _default = count;\n' +
                  'exports["default"] = _default;'
              }
            ]
     */

    // 将依赖整理成更好的依赖关系图
    /* 我们希望整理后输出的 modules 数组
      {
        'index.js': {
          code: 'xxx',
          deps: { 'add.js': 'xxx' }
        },
        'add.js': {
          code: 'xxx',
          deps: {}
        }
      }
    */
    const depsGraph = this.modules.reduce((graph, module) => {
      return {
        ...graph,
        [module.filePath]: {
          code: module.code,
          deps: module.deps,
        },
      }
    }, {})

    console.log(depsGraph)
    /*
      E:\迅雷下载\webpack_step2\07.myWebpack>npm run build

        > 07.myWebpack@1.0.0 build E:\迅雷下载\webpack_step2\07.myWebpack
        > node ./script/build.js

        {
          './src/index.js': {
            code: '"use strict";\n' +
              '\n' +
              'var _add = _interopRequireDefault(require("./add.js"));\n' +
              '\n' +
              'var _count = _interopRequireDefault(require("./count.js"));\n' +
              '\n' +
              'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj
        : { "default": obj }; }\n' +
              '\n' +
              'console.log((0, _add["default"])(1, 2));\n' +
              'console.log((0, _count["default"])(3, 1));',
            deps: {
              './add.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add.js',
              './count.js': 'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count.js'
            }
          },
          'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\add.js': {
            code: '"use strict";\n' +
              '\n' +
              'Object.defineProperty(exports, "__esModule", {\n' +
              '  value: true\n' +
              '});\n' +
              'exports["default"] = void 0;\n' +
              '\n' +
              'function add(x, y) {\n' +
              '  return x + y;\n' +
              '}\n' +
              '\n' +
              'var _default = add;\n' +
              'exports["default"] = _default;',
            deps: {}
          },
          'E:\\迅雷下载\\webpack_step2\\07.myWebpack\\src\\count.js': {
            code: '"use strict";\n' +
              '\n' +
              'Object.defineProperty(exports, "__esModule", {\n' +
              '  value: true\n' +
              '});\n' +
              'exports["default"] = void 0;\n' +
              '\n' +
              'function count(x, y) {\n' +
              '  return x - y;\n' +
              '}\n' +
              '\n' +
              'var _default = count;\n' +
              'exports["default"] = _default;',
            deps: {}
          }
        }
    */

    this.generate(depsGraph)
  }

  // 开始构建
  build(filePath) {
    // 1. 将文件解析成 ast
    const ast = getAst(filePath)
    // 2. 获取 ast 中所有的依赖
    const deps = getDeps(ast, filePath)
    // 3. 将 ast 解析成代码
    const code = getCode(ast)

    return {
      // 文件路径
      filePath,
      // 当前文件的所有依赖
      deps,
      // 当前文件解析后的代码
      code,
    }
  }

  // 生成输出资源
  generate(depsGraph) {
    /* index.js 的代码
      "use strict";\n' +
      '\n' +
      'var _add = _interopRequireDefault(require("./add.js"));\n' +
      '\n' +
      'var _count = _interopRequireDefault(require("./count.js"));\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n' +
      '\n' +
      'console.log((0, _add["default"])(1, 2));\n' +
      'console.log((0, _count["default"])(3, 1));'
    */
    const bundle = `
      ;(function(depsGraph) {
        // require 的目的： 为了加载入口文件
        function require(module) {
          // 定义模块内部的 require 函数
          function localRequire(relativePath) {
            // 为了找到要引入模块的绝对路径，通过 require 加载
            return require(depsGraph[module].deps[relativePath])
          }
          // 定义暴露对象（将来模块要暴露的内容）
          var exports = {}

          ;(function (require, exports, code) {
            eval(code)
          })(localRequire, exports, depsGraph[module].code)

          // 作为 require 函数的返回值返回出去
          // 后面的 require 函数能得到暴露的内容
          return exports
        }
        // 加载入口文件
        require('${this.options.entry}')

      })(${JSON.stringify(depsGraph)})
    `
    // 生成输出文件的绝对路径
    const filePath = path.resolve(this.options.output.path, this.options.output.filename)
    // 写入文件
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}

module.exports = Compiler
