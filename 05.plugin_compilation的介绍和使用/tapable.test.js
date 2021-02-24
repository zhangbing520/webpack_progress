const { resolvePlugin } = require('@babel/core')
const {SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook} = require('tapable')

class Lesson {
  constructor() {
    // 初始化 hooks 容器
    this.hooks = {
      // SyncHook：同步 hooks，任务会依次执行
      // go: new SyncHook(['address'])
      // SyncBailHook：一旦有返回值就会退出
      go: new SyncBailHook(['address']),
      // 异步 hooks
      // AsyncParallelHook: 异步并行
      // leave: new AsyncParallelHook(['name', 'age']),
      // AsyncSeriesHook: 异步串行
      leave: new AsyncSeriesHook(['name', 'age'])
    }
  }
  tap() {
    // 往 hooks 容器中注册事件（添加回调函数）
    this.hooks.go.tap('class0318', (address) => {
      console.log('class0318', address)
      return 111
    })
    this.hooks.go.tap('class0410', (address) => {
      console.log('class0410', address)
    })

    this.hooks.leave.tapAsync('class0510', (name, age, cb) => {
      setTimeout(() => {
        console.log('class0510', name ,age)
        cb()
      }, 2000)
    })

    this.hooks.leave.tapPromise('class0510', (name, age) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('class0610', name, age)
          resolve()
        }, 1000)
      })
    })
  }

  start() {
    // 触发 hooks
    this.hooks.go.call('c318')
    this.hooks.leave.callAsync('jack', 18, function() {
      // 代表所有leave容器中的钩子都触发完了，才触发
      console.log('end')
    })
  }
}

const l = new Lesson()
// 注册
l.tap()
// 触发
l.start()