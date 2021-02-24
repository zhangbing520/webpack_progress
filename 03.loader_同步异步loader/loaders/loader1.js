// loader 本质上是一个函数

// module.exports = function(content, map, meta) {
//   console.log(111);

//   return content
// }

// 同步： 直接 return，也可以调用自己的 callback 方法

module.exports = function(content, map, meta) {
  console.log(111);
  this.callback(null, content, map, meta)
  // return content 
  // 调用 callback 不需要返回值
}

module.exports.pitch = function(){
  console.log('pitch 111');
}