(()=>{"use strict";function e(e,n){for(var o=0;o<n.length;o++){var t=n[o];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}console.log("hello world");var n=function(){function n(e){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),this.name=e}var o,t;return o=n,(t=[{key:"setName",value:function(e){this.name=e}}])&&e(o.prototype,t),n}();console.log(new n("jack"))})();