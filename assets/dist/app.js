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
})({"libs/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.serialize = serialize;
exports.setCookie = setCookie;
exports.isTouchDevice = void 0;

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
/**
 * sleep
 *
 * @param {Number} delay
 * @param params
 * @param {Number} timer
 * @return {Promise}
 */


exports.isTouchDevice = isTouchDevice;

function sleep() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return new Promise(function (resolve) {
    var _this = this;

    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        resolve(params, timer);
      }, delay);
    } else {
      setTimeout(function () {
        resolve(params, _this);
      }, delay);
    }
  });
}
/**
 * serialize
 * object to parameter
 *
 * @param {Object} obj
 * @param {Boolean} usePrefix
 * @return {String}
 */


function serialize(obj) {
  var usePrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var str = [];
  var res = '';

  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }

  res = str.join('&');
  return res && usePrefix ? "?".concat(res) : res;
}
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
},{}],"libs/api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.init = void 0;

var util = _interopRequireWildcard(require("./util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/** @property {Redgoose} app */
var app = null;

var init = function init(_app) {
  app = _app; // $(document).ajaxStart(function() {
  // 	console.warn('ajax start');
  // });
  // $(document).ajaxComplete(function() {
  // 	console.warn('ajax complete');
  // });
};

exports.init = init;

var get = function get(url, params) {
  return new Promise(function (resolve, reject) {
    url = /^http/.test(url) ? url : app.options.urlApi + url;
    $.ajax({
      url: url + util.serialize(params, true),
      type: 'get',
      headers: {
        'Authorization': app.options.token
      }
    }).then(resolve).catch(function () {
      return resolve(null);
    });
  });
};

exports.get = get;
},{"./util":"libs/util.js"}],"Work/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Work;

var api = _interopRequireWildcard(require("../libs/api"));

var util = _interopRequireWildcard(require("../libs/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function Work(app) {
  var self = this;
  this.name = 'work';
  this.app = app;
  this.$container = $('#work');
  this.$body = this.$container.find('.work__body');
  this.$like = this.$container.find('.work__like');
  this.loading = false;
  this.work = {};

  (function constructor() {
    try {
      // check container
      if (!(self.$container && self.$container.length)) {
        throw 'Not found container';
      } // init filtering elements in body


      if (self.$body && self.$body.length) {
        filteringElementsInBody();
      } // init like event


      if (self.$like && self.$like.length) {
        self.$like.children('button').on('click', function () {
          var $self = $(this);
          if ($self.hasClass('on')) return false;
          self.onLike(parseInt(this.dataset.srl)).then(function (cnt) {
            $self.addClass('on');
            $self.children('em').text(cnt);
          }).catch(alert);
        });
      } // show page


      self.$container.removeClass('work--hide');
    } catch (e) {
      if (self.app.options.debug) {
        console.error(e);
      }
    }
  })();
  /**
   * filtering elements in body
   * 우선 이미지 태그들을 찾아서 태그로 한번 씌우는 작업을 한다.
   */


  function filteringElementsInBody() {
    var $images = self.$body.find('img');
    $images.each(function () {
      $(this).wrap('<span class="image"></span>');
    });
  }
  /**
   * on like
   *
   * @param {Number} srl
   */


  this.onLike = function (srl) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (!srl) reject();
      api.get("/articles/".concat(srl, "/update"), {
        type: 'star'
      }).then(function (res) {
        if (!res.success) reject('Failed update like');
        util.setCookie("redgoose-like-".concat(srl), '1', 10, _this.app.options.urlCookie);
        resolve(res.data.star);
      }).catch(function (e) {
        reject(typeof e === 'string' ? e : 'Service error');
      });
    });
  };
}
},{"../libs/api":"libs/api.js","../libs/util":"libs/util.js"}],"Index/IndexWork.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IndexWork;

var _Work = _interopRequireDefault(require("../Work"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IndexWork(app, index) {
  if (!(app && index)) return;
  var self = this;
  this.$popup = null;
  this.indexHistory = null;
  /**
   * make element for popup
   *
   * @return {Array}
   */

  function popupElement() {
    var dom = "<div class=\"popup\">\n\t\t\t<div class=\"popup__body\"></div>\n\t\t\t<div class=\"loading popup__loading\">\n\t\t\t\t<div class=\"loading__loader\">\n\t\t\t\t\t<div class=\"loading__shadow\"></div>\n\t\t\t\t\t<div class=\"loading__box\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<nav class=\"popup__close\">\n\t\t\t\t<button type=\"button\" title=\"close\">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<img src=\"".concat(app.options.urlRoot, "/assets/images/ico-close.svg\" class=\"pc\" alt=\"close\"/>\n\t\t\t\t\t\t<img src=\"").concat(app.options.urlRoot, "/assets/images/ico-close2.svg\" class=\"mobile\" alt=\"close\"/>\n\t\t\t\t\t</div>\n\t\t\t\t</button>\n\t\t\t</nav>\n\t\t</div>");
    var $dom = $(dom); // init close event

    $dom.children('.popup__close').on('click', function () {
      return self.close(true);
    });
    return $dom;
  }
  /**
   * keyboard event
   *
   * @param {Boolean} sw
   */


  function keyboard(sw) {
    var $window = $(window);
    var keymap = {
      left: 37,
      right: 39,
      esc: 27,
      cmd: 91,
      ctrl: 17
    };
    var ready = true;

    function onKeyUp(e) {
      switch (e.keyCode) {
        case keymap.cmd:
        case keymap.ctrl:
          ready = true;
          break;

        case keymap.left:
          if (ready) self.prev();
          break;

        case keymap.right:
          if (ready) self.next();
          break;

        case keymap.esc:
          if (app.mode === 'work') self.close(true);
          break;
      }
    }

    function onKeyDown(e) {
      switch (e.keyCode) {
        case keymap.left:
        case keymap.right:
          ready = true;
          break;

        default:
          ready = false;
          break;
      }
    }

    if (sw) {
      // initial event
      $window.off('keyup.redgoose keydown.redgoose');
      $window.on('keyup.redgoose', onKeyUp);
      $window.on('keydown.redgoose', onKeyDown);
    } else {
      $window.off('keyup.redgoose keydown.redgoose');
    }
  }
  /**
   * open
   *
   * @param {int} srl
   * @param {String} alt
   * @param {Boolean} history
   */


  this.open = function (srl, alt) {
    var history = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!(srl && alt)) {
      alert('Not found work number or title');
      return;
    }

    try {
      // save scroll top
      index.scrollTop = window.pageYOffset || document.documentElement.scrollTop; // push history

      self.indexHistory = {
        env: app.history.env,
        title: app.history.title,
        url: app.history.url
      };

      if (history) {
        // save index history
        var url = "".concat(app.options.urlRoot, "/article/").concat(srl);
        var title = "".concat(alt, " on ").concat(app.options.title);
        app.history.push({
          url: url,
          title: title,
          srl: srl,
          action: 'open-work'
        }, title, url);
      } // off events in index


      index.toggleEvents(false); // change popup mode for html tag

      $('html').addClass('mode-popup'); // make element and append

      self.$popup = popupElement();
      $('body').append(self.$popup); // 빠르게 로딩심볼이 나오면 잔상이 남기 때문에 약간 늦춰서 보이도록 타임아웃을 검

      var timer = setTimeout(function () {
        if (self.$popup) self.$popup.children('.popup__loading').addClass('show');
      }, 200); // get work data

      $.get("/article/".concat(srl, "?mode=popup")).then(function (work) {
        // 로딩 타이머 끝나기전에 데이터를 불러왔으면 타임아웃을 클리어한다.
        clearTimeout(timer); // off loading

        self.$popup.children('.popup__loading').remove(); // append work element

        self.$popup.children('.popup__body').append(work); // init work mode

        app.mode = 'work';
        app.work = new _Work.default(app); // start keyboard event

        keyboard(true);
      });
    } catch (e) {
      if (app.options.debug) console.error(e); // alert message

      alert('Failed open work.'); // close window

      self.close(true);
    }
  };
  /**
   * close
   *
   * @param {Boolean} history
   */


  this.close = function () {
    var history = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    try {
      if (!(self.$popup && self.$popup.length)) {
        throw 'Failed to close window.';
      } // push history


      if (history) {
        app.history.push(self.indexHistory.env, self.indexHistory.title, self.indexHistory.url);
      }

      self.indexHistory = null; // stop keyboard event

      keyboard(false); // change mode and unset work

      app.mode = 'index';
      app.work = null; // remove popup element

      self.$popup.remove();
      self.$popup = null; // change popup mode for html tag

      $('html').removeClass('mode-popup'); // on events in index

      index.toggleEvents(true); // restore scrollY

      window.scrollTo(0, index.scrollTop);
    } catch (e) {
      if (app.options.debug) {
        console.error(e);
      }

      if (e && typeof e === 'string') {
        alert(e);
      }
    }
  };
}
},{"../Work":"Work/index.js"}],"Index/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Index;

var api = _interopRequireWildcard(require("../libs/api"));

var _IndexWork = _interopRequireDefault(require("./IndexWork"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SCROLL_OFFSET = 100; // 페이지가 변화되는 스크롤 y축 위치 offset

var SCROLL_SPEED = 300; // 페이지 추가될때 스크롤 이동되는 속도

var SCROLL_DELAY = 100; // 스크롤 이벤트가 트리거까지 대기시간

var BLOCK_DELAY = 60; // 아이템들이 추가될때 fade in 딜레이 간격

/**
 * Index class
 */

function Index(app) {
  var self = this;
  this.name = 'index';
  this.app = app;
  this.work = new _IndexWork.default(app, this);
  this.masonry = null;
  this.index_selector = '#index';
  this.$categories = $('#categories');
  this.$index = $(this.index_selector);
  this.$more = $('#index_button_more');
  this.$loading = $('#index_loading');
  this.loading = null;
  this.nest = {
    srl: this.app.options.nest_srl,
    id: this.app.options.nest_id,
    name: this.app.options.nest_name
  };
  this.category = {
    srl: this.app.options.category_srl,
    name: this.app.options.category_name
  };
  this.scrollEvent = null;
  this.scrollTop = 0;
  /**
   * switching masonry
   *
   * @param {Boolean} sw
   */

  function masonry(sw) {
    if (sw) {
      self.$index.addClass('masonry').removeClass('empty');
      self.masonry = new Masonry(self.index_selector, {
        itemSelector: '.indexWorks__item',
        columnWidth: '.indexWorks__sizer',
        transitionDuration: 0,
        hiddenStyle: {},
        visibleStyle: {}
      });
    } else {
      self.$index.removeClass('masonry');
      self.masonry.destroy();
      self.masonry = null;
    }
  }
  /**
   * switching loading for category
   *
   * @param {Boolean} sw
   */


  function loadingForCategory(sw) {
    if (sw) {
      // this.loading
      self.loading = setTimeout(function () {
        self.$loading.addClass('loading--show');
      }, 100);
    } else {
      if (self.loading) {
        clearTimeout(self.loading);
        self.loading = null;
      }

      self.$loading.removeClass('loading--show');
    }
  }
  /**
   * switching loading for change page
   *
   * @param {Boolean} sw
   */


  function loadingForChangePage(sw) {
    if (sw) {
      self.$more.addClass('indexMore--processing');
    } else {
      self.$more.removeClass('indexMore--processing');
    }
  }
  /**
   * init category event
   * 모바일에서 카테고리 접기/펼치기 이벤트와 버튼을 클릭했을때 목록이 변하는 이벤트 설정
   */


  function initCategoryEvents() {
    // toggle category list
    self.$categories.children('.indexCategories__toggle').on('click', function () {
      $(this).parent().toggleClass('active');
    }); // change category

    var $categoryButtons = self.$categories.find('a');
    $categoryButtons.on('click', function () {
      if ($(this).parent().hasClass('on')) return false;
      var srl = parseInt(this.dataset.srl);
      self.changeCategory(srl, true);
      self.$categories.removeClass('active');
      return false;
    });
  }
  /**
   * make index element
   *
   * @param {Array} index
   * @param {Boolean} ready
   * @return {Array}
   */


  function indexItemElement(index, ready) {
    var dom = index.map(function (o, k) {
      var sizeSet = o.json.thumbnail && o.json.thumbnail.sizeSet ? o.json.thumbnail.sizeSet.split('*') : [1, 1];
      var classname = "".concat(parseInt(sizeSet[0]) === 2 ? 'w2' : '', " ").concat(parseInt(sizeSet[1]) === 2 ? 'h2' : '');
      if (ready) classname += ' ready';
      return "<div class=\"indexWorks__item".concat(classname ? ' ' + classname.trim() : '', "\">\n\t\t\t\t<a href=\"/article/").concat(o.srl, "\" data-srl=\"").concat(o.srl, "\">\n\t\t\t\t\t<img src=\"").concat(self.app.options.urlApi, "/").concat(o.json.thumbnail.path, "\" alt=\"").concat(o.title, "\">\n\t\t\t\t</a>\n\t\t\t</div>");
    }).join('');
    var $dom = $(dom); // set items event

    initItemsEvent($dom);
    return $dom;
  }
  /**
   * 스크롤을할때 주소에 페이지 번호가 변하는 기능을 초기화 한다.
   *
   * @param {Boolean} sw 이벤트 리스너를 껏다켜는 스위치
   */


  function initScrollEvent(sw) {
    /**
     * 현재 주소를 분석하여 새로운 `page`값이 적용된 url을 만들어서 `history.replace` 실행한다.
     *
     * @param {Number} page
     */
    function updatePage(page) {
      var history = self.app.history;

      try {
        var url = new URL(window.location.href);
        var urlParams = url.searchParams;
        var urlPage = url.searchParams ? url.searchParams.get('page') : null;
        urlPage = urlPage ? parseInt(urlPage) : 1;
        if (page === urlPage) return;

        if (page === 1) {
          urlParams.delete('page');
        } else {
          urlParams.set('page', page);
        }

        var newUrl = location.pathname + (urlParams.toString() ? "?".concat(urlParams.toString()) : ''); // change default page

        self.app.options.page = page;
        history.replace(_objectSpread({}, history.env, {
          url: newUrl
        }), history.title, newUrl);
      } catch (e) {}
    }

    function action() {
      var $el = self.$index.children('[data-page]');
      var top = $(this).scrollTop();
      var $current = null;
      if (!$el.length) return false;

      if (top + $(this).height() === $(document).height()) {
        $current = $el.eq($el.length - 1) ? $el.eq($el.length - 1) : null;
      } else {
        $el.each(function (key) {
          if (top >= $(this).offset().top - (SCROLL_OFFSET + 5)) {
            $current = $(this);
          }
        });

        if (!$current) {
          $current = $el.eq(0);
        }
      } // update page


      var page = $current && $current.length ? $current.data('page') : 1;
      updatePage(page);
    }

    if (sw) {
      // set page on first item
      self.$index.children('.indexWorks__item').eq(0).attr('data-page', self.app.options.page || 1);
      $(window).off('scroll.redgoose_index').on('scroll.redgoose_index', function () {
        // 너무많은 스크롤 이벤트가 트리깅 하는것을 방지하기 위하여 셋 타임아웃을 걸어놓았다.
        clearTimeout(self.scrollEvent);
        self.scrollEvent = setTimeout(action, SCROLL_DELAY);
      });
    } else {
      $(window).off('scroll.redgoose_index');
    }
  }
  /**
   * init items event
   * 목록의 아이템 이벤트 설정
   */


  function initItemsEvent($items) {
    $items.each(function () {
      var $button = $(this).children('a');
      $button.on('click', function (e) {
        e.preventDefault();
        var srl = parseInt(this.dataset.srl);
        var title = $(this).find('img').attr('alt');
        self.work.open(srl, title, true);
      });
    });
  }
  /**
   * PUBLIC AREA
   */

  /**
   * change category
   *
   * @param {Number} srl
   * @param {Boolean} useHistory
   */


  this.changeCategory = function (srl) {
    var useHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var options = self.app.options; // set select element

    var $selected = null;

    if (srl) {
      $selected = this.$categories.find("a[data-srl=".concat(srl, "]"));
    } else {
      $selected = this.$categories.find('a').eq(0);
    }

    try {
      // change active menu
      self.$categories.find('li.on').removeClass('on');
      $selected.parent().addClass('on'); // update value

      self.category = {
        srl: srl,
        name: $selected.children('span').text()
      }; // update history

      if (useHistory) {
        var url = "".concat(options.urlRoot, "/nest/").concat(self.nest.id).concat(srl ? "/".concat(srl) : '');
        var title = "".concat(self.category.name !== 'All' ? "".concat(self.category.name, " - ") : '').concat(self.nest.name, " - ").concat(options.title);
        self.app.history.push({
          url: url,
          title: title,
          srl: srl,
          action: 'change-category'
        }, title, url);
      } // off events in index


      self.toggleEvents(false); // on loading

      loadingForCategory(true); // remove empty element

      self.$index.children('.indexWorks__empty').remove(); // hide more

      self.$more.addClass('indexMore--hide'); // get datas

      api.get('/articles', {
        app: options.app_srl,
        nest: options.nest_srl,
        field: 'srl,json,title',
        category: srl || '',
        order: 'srl',
        sort: 'desc',
        size: parseInt(self.app.options.size) || 10,
        ext_field: 'next_page'
      }).then(function (res) {
        if (!res.success) throw 404;
        res = res.data; // make elements

        var $elements = indexItemElement(res.index, false); // remove prev elements

        self.$index.children('.indexWorks__item').remove(); // append elements

        self.$index.append($elements); // off loading

        loadingForCategory(false); // on events in index

        self.toggleEvents(true); // update more button

        if (res.nextPage) {
          self.$more.removeClass('indexMore--hide');
          self.$more.children('button').attr('data-page', res.nextPage);
        }
      });
    } catch (e) {
      var message = null;

      switch (e) {
        case 404:
          message = 'Not found work.';
          break;

        default:
          console.error(e);
          message = 'Service error.';
          break;
      } // make elements


      var elements = "<div class=\"indexEmpty indexWorks__empty\">\n\t\t\t\t<img src=\"".concat(options.urlRoot, "/assets/images/img-error.png\" alt=\"error\">\n\t\t\t\t<p>").concat(message, "</p>\n\t\t\t</div>"); // remove prev elements

      self.$index.children('.indexWorks__item').remove(); // append elements

      self.$index.addClass('empty').append(elements); // off loading

      loadingForCategory(false);
    }
  };
  /**
   * change page
   *
   * @param {Number} page
   * @param {Boolean} scroll use scroll
   * @return {Promise}
   */


  this.changePage = function (page, scroll) {
    var _this = this;

    if (this.$more.hasClass('indexMore--processing')) return false;

    try {
      // on loading
      loadingForChangePage(true); // get data

      var params = {
        field: 'srl,json,title',
        app: this.app.options.app_srl,
        page: page,
        order: 'srl',
        sort: 'desc',
        size: parseInt(this.app.options.size) || 10,
        ext_field: 'next_page'
      };
      if (this.nest.srl) params.nest = this.nest.srl;
      if (this.category.srl) params.category = this.category.srl;
      api.get('/articles', params).then(function (res) {
        if (!res.success) throw 404;
        res = res.data; // update more button

        if (res.nextPage) {
          _this.$more.children('button').attr('data-page', res.nextPage);
        } else {
          _this.$more.addClass('indexMore--hide');
        } // make new elements


        var $elements = indexItemElement(res.index, true); // append

        _this.$index.append($elements);

        if (_this.masonry) _this.masonry.appended($elements); // play block animation

        $elements.each(function (key) {
          var _this2 = this;

          setTimeout(function () {
            $(_this2).removeClass('ready');
          }, BLOCK_DELAY * key);
        });

        if (scroll) {
          var $firstElement = $elements.eq(0);
          var top = $firstElement.offset().top - SCROLL_OFFSET;
          $firstElement.attr('data-page', page);
          $("html, body").stop().animate({
            scrollTop: top
          }, SCROLL_SPEED, 'swing');
        } // off loading


        loadingForChangePage(false);
      });
    } catch (e) {
      var message = null;

      switch (e) {
        case 404:
          message = 'Not found work.';
          break;

        default:
          console.error(e);
          message = 'Service error.';
          break;
      }

      alert(message);
      loadingForChangePage(false);
    }
  };
  /**
   * toggle events
   *
   * @param {Boolean} sw
   */


  this.toggleEvents = function (sw) {
    if (sw) {
      // reset masonry
      if (!self.masonry) masonry(true); // on scroll event

      initScrollEvent(true);
    } else {
      // destroy masonry
      if (self.masonry) masonry(false); // off scroll event

      initScrollEvent(false);
    }
  }; // constructor


  (function constructor() {
    try {
      if (!Masonry) throw 'Not found Masonry vendor'; // init toggle category event

      if (self.$categories && self.$categories.length) {
        initCategoryEvents();
      } // init masonry and items event


      if (self.$index && self.$index.children('.indexWorks__item') && self.$index.children('.indexWorks__item').length) {
        // init events
        self.toggleEvents(true); // set items event

        initItemsEvent(self.$index.children('.indexWorks__item'));
      } else {
        self.$index.addClass('empty');
      } // init more button


      if (self.$more && self.$more.length) {
        self.$more.children('button').on('click', function () {
          var page = parseInt(this.dataset.page) || null;
          if (!page) return false;
          self.changePage(page, true);
        });
      } // update history


      var url = location.pathname + location.search;
      var env = {
        url: url
      };

      if (!!self.nest.srl) {
        env.title = "".concat(self.category.name ? "".concat(self.category.name, " - ") : '').concat(self.nest.name, " - ").concat(self.app.options.title);
        env.category_srl = self.category.srl ? self.category.srl : null;
        env.action = 'change-category';
      } else {
        env.title = self.app.options.title;
        env.action = 'none';
      }

      var srl = !!self.nest.srl ? self.category.srl ? self.category.srl : null : null;
      self.app.history.replace(env, env.title, url);
    } catch (e) {
      if (app.options.debug) console.error(e);
      $('.container').empty().html("<article class=\"error\">\n\t\t\t\t<figure class=\"error__image\">\n\t\t\t\t\t<img src=\"".concat(app.options.urlRoot, "/assets/images/img-error.png\" alt=\"error\">\n\t\t\t\t</figure>\n\t\t\t\t<h1 class=\"error__message\">Service error</h1>\n\t\t\t</article>"));
    }
  })();
}
},{"../libs/api":"libs/api.js","./IndexWork":"Index/IndexWork.js"}],"Header/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Header;

var util = _interopRequireWildcard(require("../libs/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Header class
 */
function Header(app) {
  var self = this;
  this.name = 'header';
  this.app = app;
  this.$nav = $('#gnb');

  (function constructor() {
    // init navigation
    initNavigation();
  })();

  function initNavigation() {
    var $buttons = self.$nav.find('ul > li > a');
    $buttons.on('click', function () {
      // 하위메뉴가 있고 터치 디바이스라면 클릭진행을 막는다.
      return !(util.isTouchDevice() && $(this).next().length);
    });
  }
}
},{"../libs/util":"libs/util.js"}],"History.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = History;

/**
 * History class
 */
function History(app) {
  var self = this;
  var $title = $('head > title');
  this.name = 'history';
  this.app = app;
  this.env = null;
  this.title = null;
  this.url = null;

  (function constructor() {
    if (!support()) return;
    window.removeEventListener('popstate', onHook);
    window.addEventListener('popstate', onHook);
  })();
  /**
   * on hook history
   *
   * @param {String} e.state.url
   * @param {String} e.state.title
   * @param {String} e.state.action
   */


  function onHook(e) {
    var state = e.state || {};

    function save() {
      self.env = state;
      self.title = state.title;
      self.url = state.url;
    }

    try {
      switch (state.action) {
        case 'change-category':
          if (app.mode === 'work') {
            save();
            app.index.work.close(false);
            document.title = self.title;
            return;
          } else if (app.mode === 'index') {
            if (app.index && state.category_srl) {
              save();
              app.index.changeCategory(state.category_srl || null, false);
              return;
            }
          }

          throw 'no params';

        case 'open-work':
          if (app.mode === 'index') {
            app.index.work.open(e.state.srl, e.state.title, false).then(save);
            return;
          }

          return;

        case 'none':
          if (app.mode === 'work' && app.index.work.$popup && app.index.work.$popup.length) {
            save();
            app.index.work.close(false);
            document.title = self.title;
            return;
          }

          throw 'no page';

        default:
          throw 'none';
      }
    } catch (e) {
      window.location.reload();
    }
  }
  /**
   * check support history
   *
   * @Return {Boolean}
   */


  function support() {
    return !!history.pushState;
  }
  /**
   * PUBLIC AREA
   */

  /**
   * push state
   *
   * @param {Object} env
   * @param {String} title
   * @param {String} url
   */


  this.push = function (env, title, url) {
    if (!(support() && url)) return; // save member values

    this.env = env;
    this.title = title;
    this.url = url; // change title

    if (title) $title.text(title); // update history

    history.pushState(env || null, title || url, url);
  };
  /**
   * replace state
   *
   * @param {Object} env
   * @param {String} title
   * @param {String} url
   */


  this.replace = function (env, title, url) {
    if (!(support() && url)) return; // save member values

    this.env = env;
    this.title = title;
    this.url = url; // change title

    if (title) $title.text(title); // update history

    history.replaceState(env || null, title || url, url);
  };
}
},{}],"defaultOptions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {//
};
exports.default = _default;
},{}],"../../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{"./bundle-url":"../../node_modules/parcel/src/builtins/bundle-url.js"}],"../css/app.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../node_modules/parcel/src/builtins/css-loader.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _Index = _interopRequireDefault(require("./Index"));

var _Work = _interopRequireDefault(require("./Work"));

var _Header = _interopRequireDefault(require("./Header"));

var _History = _interopRequireDefault(require("./History"));

var _defaultOptions = _interopRequireDefault(require("./defaultOptions"));

var api = _interopRequireWildcard(require("./libs/api"));

require("../css/app.scss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Redgoose =
/**
 * constructor
 *
 * @param {String} type
 * @param {Object} options
 */
function Redgoose() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Redgoose);

  this.name = 'redgoose'; // set instance

  this.index = null;
  this.work = null;
  this.header = new _Header.default(this);
  this.history = new _History.default(this); // set etc

  this.mode = null;
  this.options = _objectSpread({}, _defaultOptions.default, options); // switching action

  switch (type) {
    case 'index':
      // change mode
      this.mode = 'index'; // init api

      if (this.options.urlApi && this.options.token) {
        api.init(this);
      } // play


      this.index = new _Index.default(this);
      break;

    case 'work':
      // change mode
      this.mode = 'view'; // init api

      if (this.options.urlApi && this.options.token) {
        api.init(this);
      } // play


      this.work = new _Work.default(this);
      break;

    case 'none':
      break;

    default:
      this.mode = 'error';
      console.error('Error initialize');
      break;
  }
};

module.exports = Redgoose;
},{"./Index":"Index/index.js","./Work":"Work/index.js","./Header":"Header/index.js","./History":"History.js","./defaultOptions":"defaultOptions.js","./libs/api":"libs/api.js","../css/app.scss":"../css/app.scss"}],"../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63098" + '/');

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
},{}]},{},["../../node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], "Redgoose")
//# sourceMappingURL=/app.map