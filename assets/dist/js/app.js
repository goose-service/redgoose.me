/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _Index = __webpack_require__(1);\n\nvar _Index2 = _interopRequireDefault(_Index);\n\nvar _Mobile = __webpack_require__(2);\n\nvar _Mobile2 = _interopRequireDefault(_Mobile);\n\nvar _View = __webpack_require__(3);\n\nvar _View2 = _interopRequireDefault(_View);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// init Class\nwindow.Mobile = _Mobile2.default;\nwindow.Index = _Index2.default;\nwindow.View = _View2.default;\n\n// init mobile\nvar mobile = new _Mobile2.default();\nmobile.init();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/App.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/App.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction Index() {\n\tvar _this = this;\n\n\tthis.options = {};\n\tthis.masonry = null;\n\tthis.$loadItemButton = null;\n\n\tthis.init = function (userOptions) {\n\t\t_this.options = Object.assign(userOptions, _this.options);\n\n\t\tvar $items = _this.options.$articleIndex.find('.grid-item');\n\t\t_this.initOpenArticle($items);\n\n\t\t_this.$loadItemButton = _this.options.$moreItemArea.find('a');\n\t};\n\n\t/**\n  * init masonry\n  *\n  * @Param {Object} _index\n  */\n\tthis.initMasonry = function (_index) {\n\n\t\t// add className `grid`\n\t\t$(_index).addClass('grid');\n\n\t\t// init masonry\n\t\t_this.masonry = new Masonry(_index, {\n\t\t\titemSelector: '.grid-item',\n\t\t\tcolumnWidth: '.grid-sizer',\n\t\t\ttransitionDuration: '0s',\n\t\t\thiddenStyle: {},\n\t\t\tvisibleStyle: {}\n\t\t});\n\t};\n\n\t/**\n  * init load item\n  *\n  * @Param {Object} $body\n  */\n\tthis.initLoadItem = function ($body) {\n\t\tif (!_this.options.$moreItemArea.length) return false;\n\n\t\t_this.$loadItemButton.on('click', _this.loadItemEvent);\n\t};\n\n\t/**\n  * item template\n  *\n  * @Param {Object} src\n  * @Return {String}\n  */\n\tthis.itemTemplate = function (src) {\n\t\tvar str = '' + ('<div class=\"grid-item ' + src.size_className + '\">') + ('<a href=\"' + _this.options.root + '/article/' + (_this.options._nest ? _this.options._nest + '/' : '') + src.srl + '/\">') + ('<figure style=\"background-image: url(\\'' + _this.options.gooseRoot + '/' + src.json.thumbnail.url + '\\')\">') + src.title + '</figure>' + '</a>' + '</div>';\n\t\treturn str;\n\t};\n\n\t/**\n  * load item event\n  *\n  * @Param {String} url\n  */\n\tthis.loadItemEvent = function (e) {\n\n\t\tvar $button = $(e.currentTarget);\n\t\tvar url = $button.attr('href');\n\n\t\t// play loading button\n\t\t_this.loadingLoadItem(true);\n\n\t\t// off more items button\n\t\t_this.$loadItemButton.off('click');\n\n\t\t// load item\n\t\tvar loadItem = _this.load(url);\n\n\t\t// done load item\n\t\tloadItem.done(function (articles, nextpage) {\n\t\t\t// stop loading button\n\t\t\t_this.loadingLoadItem(false);\n\n\t\t\t// update more item button\n\t\t\tif (nextpage) {\n\t\t\t\tvar _url = _this.$loadItemButton.attr('href').replace(/page=(.+)/, \"page=\" + nextpage);\n\t\t\t\t_this.$loadItemButton.attr('href', _url).on('click', _this.loadItemEvent);\n\t\t\t} else {\n\t\t\t\t_this.options.$moreItemArea.addClass('hide');\n\t\t\t}\n\n\t\t\t// make items\n\t\t\tvar items = articles.map(function (o) {\n\t\t\t\treturn _this.itemTemplate(o);\n\t\t\t}).join('');\n\t\t\tvar $items = $(items);\n\n\t\t\t// init open article event\n\t\t\t_this.initOpenArticle($items);\n\n\t\t\t// append items in index\n\t\t\t_this.options.$articleIndex.append($items);\n\t\t\t_this.masonry.appended($items);\n\t\t});\n\n\t\treturn false;\n\t};\n\n\t/**\n  * loading load item\n  *\n  * @Param {Boolean} sw\n  */\n\tthis.loadingLoadItem = function (sw) {\n\t\tif (!_this.$loadItemButton.length) return false;\n\t\tif (sw) {\n\t\t\t_this.$loadItemButton.addClass('loading');\n\t\t} else {\n\t\t\t_this.$loadItemButton.removeClass('loading');\n\t\t}\n\t};\n\n\t/**\n  * load item\n  *\n  * @Param {String} url\n  * @Return {Object}\n  */\n\tthis.load = function (url) {\n\n\t\tvar defer = $.Deferred();\n\n\t\t$.post(url, function (res) {\n\t\t\tif (res.state == 'success') {\n\t\t\t\tdefer.resolve(res.articles, res.nextpage);\n\t\t\t} else {\n\t\t\t\tdefer.reject(res.message);\n\t\t\t}\n\t\t}, 'json');\n\n\t\treturn defer.promise();\n\t};\n\n\t/**\n  * init open article event\n  *\n  * @Param {Object} $items\n  */\n\tthis.initOpenArticle = function ($items) {\n\t\t$items.each(function (n, el) {\n\t\t\t$(el).find('a').on('click', function (e) {\n\t\t\t\tvar button = $(e.currentTarget);\n\t\t\t\tconsole.log(button.attr('href'));\n\t\t\t\treturn false;\n\t\t\t});\n\t\t});\n\t};\n}\n\nexports.default = Index;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Index/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Index/index.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction Mobile() {\n\tvar _this = this;\n\n\t/**\n  * toggle navigation\n  *\n  * @param {Object} $selector\n  * @param {Object} $target\n  */\n\tthis.toggleNavigation = function ($selector, $target) {\n\t\t$selector.on('click', function () {\n\t\t\t$target.toggleClass('active');\n\t\t});\n\t};\n\n\t/**\n  * toggle category list\n  *\n  * @param {Object} $selector\n  */\n\tthis.toggleCategory = function ($selector) {\n\t\t$selector.on('click', function (e) {\n\t\t\t$(e.currentTarget).parent().toggleClass('active');\n\t\t});\n\t};\n\n\tthis.init = function () {\n\t\t_this.toggleNavigation($('#toggleNavigation'), $('#navigation'));\n\t};\n}\n\nexports.default = Mobile;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Mobile/index.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Mobile/index.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction View() {\n\n\tthis.options = {};\n\n\tthis.init = function (userOptions) {};\n}\n\nexports.default = View;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/View/index.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/View/index.js?");

/***/ }
/******/ ]);