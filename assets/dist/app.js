// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCookie = setCookie;
exports.isTouchDevice = void 0;

/**
 * set cookie
 *
 * @param {String} key
 * @param {String} value
 * @param {Number} day
 * @param {String} path
 */
function setCookie(key) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1';
  var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var date = new Date();
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
  document.cookie = "".concat(key, "=").concat(value, ";expires=").concat(date.toUTCString(), ";path=").concat(path);
}
/**
 * check touch device
 *
 * @return {Boolean}
 */


var isTouchDevice = function isTouchDevice() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};

exports.isTouchDevice = isTouchDevice;
},{}],"layout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var util = _interopRequireWildcard(require("./util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var $html = $('html');
var $header = $('.layout-header');
var saveScrollPosition = 0;
/**
 * toggle navigation
 */

function toggleNavigation() {
  var $button = $('.button--menu');
  $button.on('click', function () {
    if ($header.hasClass('on-menu')) {
      $header.removeClass('on-menu');
      $html.removeClass('not-scroll');
      $html.scrollTop(saveScrollPosition);
    } else {
      saveScrollPosition = $html.scrollTop();
      $header.addClass('on-menu');
      $html.addClass('not-scroll');
    }
  });
}
/**
 * initial navigation event
 */


function initNavigation() {
  var $buttons = $header.find('.layout-header__menus > ul > li > a');
  $buttons.on('click', function () {
    // 하위메뉴가 있고 터치 디바이스라면 클릭진행을 막는다.
    if ($(window).width() < 768) return true;
    return !(util.isTouchDevice() && $(this).next().length);
  });
}

function _default() {
  // toggle navigation
  toggleNavigation(); // initial navigation

  initNavigation();
}
},{"./util":"util.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var $html = $('html');
/**
 * toggle category on mobile
 */

function toggleCategoryNavigation() {
  var $button = $('.index__categories > button');
  if (!$button.length) return;
  $button.on('click', function () {
    $(this).parent().toggleClass('open');
  });
}

function _default() {
  toggleCategoryNavigation();
}
},{}],"detail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var util = _interopRequireWildcard(require("./util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var app = window.app;
var $detail = $('.detail');
/**
 * toggle like button event
 */

function toggleLikeButtonEvent() {
  var $button = $detail.find('.detail__like > button');
  $button.on('click', function () {
    var $self = $(this);
    $self.prop('disabled', true); // update star

    $.post("/on-like/".concat(app.srl), function (res) {
      try {
        res = JSON.parse(res);
        if (!res.success) throw 'error';
        $self.find('em').text(res.data.star);
        util.setCookie("redgoose-star-".concat(app.srl), '1', 10, app.url);
      } catch (e) {
        alert('Error update like');
      }
    });
  });
}
/**
 * filtering elements in body
 * 우선 이미지 태그들을 찾아서 태그로 한번 씌우는 작업을 한다.
 */


function filteringElementsInBody() {
  var $body = $detail.find('.detail__body');
  var $images = $body.find('img');
  $images.each(function () {
    $(this).wrap('<span class="image"></span>');
  });
}

function _default() {
  toggleLikeButtonEvent();
  filteringElementsInBody();
}
},{"./util":"util.js"}],"../../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../node_modules/parcel/src/builtins/bundle-url.js"}],"../scss/app.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../fonts/circular/CircularStd-Book.woff2":[["CircularStd-Book.c41c311d.woff2","../fonts/circular/CircularStd-Book.woff2"],"../fonts/circular/CircularStd-Book.woff2"],"./../fonts/circular/CircularStd-Book.woff":[["CircularStd-Book.d0856964.woff","../fonts/circular/CircularStd-Book.woff"],"../fonts/circular/CircularStd-Book.woff"],"./../fonts/circular/CircularStd-Medium.woff2":[["CircularStd-Medium.6906b176.woff2","../fonts/circular/CircularStd-Medium.woff2"],"../fonts/circular/CircularStd-Medium.woff2"],"./../fonts/circular/CircularStd-Medium.woff":[["CircularStd-Medium.8f0f6346.woff","../fonts/circular/CircularStd-Medium.woff"],"../fonts/circular/CircularStd-Medium.woff"],"./../fonts/circular/CircularStd-Bold.woff2":[["CircularStd-Bold.db9514a6.woff2","../fonts/circular/CircularStd-Bold.woff2"],"../fonts/circular/CircularStd-Bold.woff2"],"./../fonts/circular/CircularStd-Bold.woff":[["CircularStd-Bold.f1edc1ad.woff","../fonts/circular/CircularStd-Bold.woff"],"../fonts/circular/CircularStd-Bold.woff"],"./../fonts/circular/CircularStd-Black.woff2":[["CircularStd-Black.d1c43fdb.woff2","../fonts/circular/CircularStd-Black.woff2"],"../fonts/circular/CircularStd-Black.woff2"],"./../fonts/circular/CircularStd-Black.woff":[["CircularStd-Black.3a7d13d8.woff","../fonts/circular/CircularStd-Black.woff"],"../fonts/circular/CircularStd-Black.woff"],"./../images/ico-prev.svg":[["ico-prev.4ba37381.svg","../images/ico-prev.svg"],"../images/ico-prev.svg"],"./../images/ico-next.svg":[["ico-next.9c0bfeca.svg","../images/ico-next.svg"],"../images/ico-next.svg"],"_css_loader":"../../node_modules/parcel/src/builtins/css-loader.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _layout = _interopRequireDefault(require("./layout"));

var _index = _interopRequireDefault(require("./index"));

var _detail = _interopRequireDefault(require("./detail"));

require("../scss/app.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// css
// layout
(0, _layout.default)();
(0, _index.default)();
(0, _detail.default)();
},{"./layout":"layout.js","./index":"index.js","./detail":"detail.js","../scss/app.scss":"../scss/app.scss"}],"../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51958" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.map