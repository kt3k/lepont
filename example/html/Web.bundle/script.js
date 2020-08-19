parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"wIHY":[function(require,module,exports) {
"use strict";var e,t="object"==typeof Reflect?Reflect:null,n=t&&"function"==typeof t.apply?t.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};function r(e){console&&console.warn&&console.warn(e)}e=t&&"function"==typeof t.ownKeys?t.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}module.exports=o,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var s=10;function u(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function f(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function v(e,t,n,i){var o,s,v;if(u(n),void 0===(s=e._events)?(s=e._events=Object.create(null),e._eventsCount=0):(void 0!==s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),v=s[t]),void 0===v)v=s[t]=n,++e._eventsCount;else if("function"==typeof v?v=s[t]=i?[n,v]:[v,n]:i?v.unshift(n):v.push(n),(o=f(e))>0&&v.length>o&&!v.warned){v.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+v.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=e,l.type=t,l.count=v.length,r(l)}return e}function l(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function a(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=l.bind(r);return i.listener=n,r.wrapFn=i,i}function h(e,t,n){var r=e._events;if(void 0===r)return[];var i=r[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?d(i):c(i,i.length)}function p(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function c(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function y(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function d(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return s},set:function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");s=e}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return f(this)},o.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i="error"===e,o=this._events;if(void 0!==o)i=i&&void 0===o.error;else if(!i)return!1;if(i){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var u=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw u.context=s,u}var f=o[e];if(void 0===f)return!1;if("function"==typeof f)n(f,this,t);else{var v=f.length,l=c(f,v);for(r=0;r<v;++r)n(l[r],this,t)}return!0},o.prototype.addListener=function(e,t){return v(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return v(this,e,t,!0)},o.prototype.once=function(e,t){return u(t),this.on(e,a(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){return u(t),this.prependListener(e,a(this,e,t)),this},o.prototype.removeListener=function(e,t){var n,r,i,o,s;if(u(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===t||n[o].listener===t){s=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():y(n,i),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,s||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},o.prototype.listeners=function(e){return h(this,e,!0)},o.prototype.rawListeners=function(e){return h(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):p.call(e,t)},o.prototype.listenerCount=p,o.prototype.eventNames=function(){return this._eventsCount>0?e(this._events):[]};
},{}],"PuGn":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("events");let s=0;function t(){return s++}class r extends e.EventEmitter{constructor(){super(...arguments),this.resolverTable={}}recv(e){const s=e.type;switch(e.type){case"result":this.onResult(e);break;case"event":this.onEvent(e.message);break;default:throw new Error(`Unknown bridge payload type ${s}`)}}onEvent({type:e,payload:s}){this.emit(e,s)}onResult(e){const{id:s,message:t,error:r}=e,n=this.resolverTable[s];if(!n)return void console.error(`Resolver for id=${s} not found.`);delete this.resolverTable[s];const[o,i]=n;if(r)i(new Error(r.message));else{const{type:e,payload:s}=t;o(s)}}async sendMessage(e){const s=t();return window.ReactNativeWebView.postMessage(JSON.stringify({id:s,message:e})),new Promise((e,t)=>{this.resolverTable[s]=[e,t]})}}const n=new r;function o(e){return n.sendMessage(e)}function i(e,s){return n.on(e,s)}function a(e,s){return n.off(e,s)}exports.sendMessage=o,exports.on=i,exports.off=a,Object.assign(window,{LePont:n});
},{"events":"wIHY"}],"RsBu":[function(require,module,exports) {
module.exports=require("../dist/browser");
},{"../dist/browser":"PuGn"}],"g4tf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("lepont/browser");function t(){n("Hello!"),e.sendMessage({type:"foo",payload:{"Hello, world!":"through LePont bridge"}}).catch(function(e){return alert(e)})}function n(e){var t=document.createElement("div");t.textContent=e,document.body.appendChild(t)}e.on("bar",function(e){n(JSON.stringify(e))});var o=function(e){return document.querySelector(e)};function r(){o(".inf-btn").addEventListener("click",t)}function i(){r()}setTimeout(i,500);
},{"lepont/browser":"RsBu"}]},{},["g4tf"], null)
//# sourceMappingURL=/script.js.map