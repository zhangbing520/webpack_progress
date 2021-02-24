// loader 本质上是一个函数

module.exports = function(content, map, meta) {
  console.log(111);

  return content
}

module.exports.pitch = function(){
  console.log('pitch 111');
}