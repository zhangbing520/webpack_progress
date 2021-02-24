// loader 本质上是一个函数

// 异步 loader
module.exports = function(content, map, meta) {
  console.log(222);

  // 通过 this.async() 整个 loader 会停住，它就不会再往下执行, 等调用 callback 方法的时候就会往下执行
  const callback = this.async();

  setTimeout(() => {
    callback(null, content)
  }, 1000)

  // return content
}

module.exports.pitch = function(){
  console.log('pitch 222');
}