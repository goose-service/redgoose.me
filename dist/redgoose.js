(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jQuery'), require('Masonry')) :
	typeof define === 'function' && define.amd ? define(['jQuery', 'Masonry'], factory) :
	(global.Redgoose = factory(global.$,global.Masonry));
}(this, (function ($,Masonry) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Masonry = Masonry && Masonry.hasOwnProperty('default') ? Masonry['default'] : Masonry;

function AppHistory() {

	const $title = $('head > title');

	/**
  * check support
  *
  * @Return {Boolean}
  */
	function support() {
		return !!history.pushState;
	}

	/**
  * Push state
  *
  * @Param {Object} env
  * @Param {String} title
  * @Param {String} url
  */
	this.push = function (env, title, url) {
		if (!support()) return;
		if (!url) return;

		// change title
		if (title) {
			$title.text(title);
		}

		history.pushState(env || null, title || url, url);
	};

	/**
  * Replace state
  *
  * @Param {Object} env
  * @Param {String} title
  * @Param {String} url
  */
	this.replace = function (env, title, url) {
		if (!support()) return;
		if (!url) return;

		// change title
		if (title) {
			$title.text(title);
		}

		history.replaceState(env || null, title || url, url);
	};

	/**
  * initial history pop event
  */
	this.initPopEvent = function () {
		function onPopState(e) {
			console.log('on pop state');
		}

		window.addEventListener('popstate', onPopState);
	};
}

/**
 * Get window size
 *
 * @return {Object}
 */
function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * is touch device
 *
 * @return {Boolean}
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

/**
 * sleep
 *
 * @param {Number} delay
 * @return {Promise}
 */
function sleep(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

/**
 * printf
 *
 * @param {String} str
 * @param {String} values
 */

// set size
const SIZE_MOBILE = 640;

/**
 * Header
 */
function Header() {
	const self = this;
	this.$header = $('.layout-header');
	this.$gnb = this.$header.find('.gnb');

	/**
  * Toggle gnb from mobile
  */
	function toggleGnbFromMobile() {
		self.$header.find('.toggle-gnb').on('click', function () {
			$(this).toggleClass('toggle-gnb-active');
			self.$gnb.toggleClass('gnb-active');
		});
	}

	/**
  * gnb event for touch
  * 터치 디바이스이며 모바일보다 큰 사이즈라면 터치 작동에 대한 대응
  *
  */
	function gnbEventForTouch() {
		if (isTouchDevice() && SIZE_MOBILE < getWindowSize().width) {
			self.$gnb.find('.gnb__dep-1 > li > a').on('click', false);
		}
	}

	this.init = function () {
		gnbEventForTouch();
		toggleGnbFromMobile();
	};
}

const SCROLL_OFFSET = 30; // 페이지가 변화되는 스크롤 y축 위치 offset
const SCROLL_SPEED = 300; // 페이지 추가될때 스크롤 이동되는 속도
const BLOCK_DELAY = 80; // 아이템들이 추가될때 fade in 딜레이 간격
const LOAD_PAGE_PER_SIZE = 20; // 페이지 추가될때마다 불러올 아이템의 갯수


function Index(parent) {
	const self = this;

	/**
  * PUBLIC VARIABLES
  */

	this.srls = {};
	this.options = {};
	this.scrollTimer = null;
	this.selector_articles = '#articles';
	this.$index = $('.index');
	this.$articles = this.$index.find('.index__articles');
	this.$category = this.$index.find('.index__categories');
	this.$more = this.$index.find('.index__loadMore');
	this.masonry = null;

	/**
  * FUNCTIONS
  */

	/**
  * masonry
  * `masonry` 객체를 만들거나 제거한다.
  *
  * @param {Boolean} sw
  */
	function masonry(sw = true) {
		if (sw) {
			self.$articles.addClass('masonry');
			self.masonry = new Masonry(self.selector_articles, {
				itemSelector: '.grid-item',
				columnWidth: '.grid-sizer',
				transitionDuration: '0s',
				hiddenStyle: {},
				visibleStyle: {}
			});
		} else {
			self.$articles.removeClass('masonry');
			self.masonry.destroy();
			self.masonry = null;
		}
	}

	/**
  * more articles
  * 아이템을 더 불러왔을때..
  *
  * @param {Number} page
  * @return {Promise}
  */
	async function moreArticles(page) {
		let response = null;

		// turn on loading
		moreButton(false);

		// get articles
		try {
			response = await $.ajax({
				url: `${parent.options.root}/ajax/`,
				type: 'post',
				data: {
					page,
					size: self.options.size,
					field: 'srl,title,category_srl,json'
				},
				dataType: 'json'
			});
		} catch (e) {
			alert('Server error');
			console.error(e);
			moreButton(true);
			return false;
		}

		// update index
		updateIndex(response, true, true);

		// update more button
		self.$more.children('a').attr('data-next', response.nextpage);

		// refresh masonry layout
		if (self.masonry) {
			self.masonry.layout();
		}

		// turn off loading
		moreButton(true);

		return false;
	}

	/**
  * update index
  *
  * @param {Object} res
  * @param {Boolean} showAnimation
  * @param {Boolean} useScroll
  */
	function updateIndex(res, showAnimation = false, useScroll = false) {
		if (!res.nextpage) {
			self.$more.remove();
		}

		// check articles
		if (!(res.articles && res.articles.length)) return;

		// make article template
		let appendElements = res.articles.map((item, key) => {
			let url = `${parent.options.root}/article/${self.options.nest || ''}${item.srl}`;
			let image = `${parent.options.gooseRoot}/${item.json.thumbnail.url}`;
			let className = `grid-item grid-item__hidden ${item.size_className}`;
			return `<div class="${className}">` + `<a href="${url}" data-srl="${item.srl}" title="${item.title}">` + `<figure style="background-image: url('${image}')">` + `${item.title}` + `</figure>` + `</a>` + `</div>`;
		}).join('');

		// append articles
		let $appendElements = $(appendElements);

		// set event articles
		initItemsEvent($appendElements.children('a'));

		// append articles
		self.$articles.append($appendElements);

		// append articles using masonry
		if (self.masonry) {
			self.masonry.appended($appendElements);
		}

		// play animation blocks
		if (showAnimation) {
			animationBlocks($appendElements);
		}

		// move to next page by scroll
		if (useScroll) {
			let $firstElement = $appendElements.eq(0);
			let top = $firstElement.offset().top - SCROLL_OFFSET;
			$firstElement.attr('data-page', res.currentPage);
			$("html, body").stop().animate({ scrollTop: top }, SCROLL_SPEED, 'swing');
		}
	}

	/**
  * show animation block
  *
  * @param {Object} $blocks
  */
	function animationBlocks($blocks) {
		$blocks.each(function (key) {
			setTimeout(() => {
				$(this).removeClass('grid-item__hidden');
			}, BLOCK_DELAY * key);
		});
	}

	/**
  * control more button
  * 더 불러오기 버튼의 상태가 변한다.
  *
  * @param {Boolean} sw
  */
	function moreButton(sw) {
		// more load articles
		function loadMoreTrigger() {
			moreArticles(this.dataset.next).then();
			return false;
		}

		if (sw) {
			self.$more.children('a').on('click', loadMoreTrigger);
			self.$more.removeClass('loadMore-loading');
		} else {
			self.$more.children('a').off('click');
			self.$more.addClass('loadMore-loading');
		}
	}

	/**
  * toggle category
  */
	function toggleCategory() {
		$(this).toggleClass('categories__toggle-active');
		$(this).next().toggleClass('categories__index-active');
	}

	/**
  * scroll event
  *
  * @param {Boolean} sw
  */
	function scrollEvent(sw) {
		const delay = 100;

		function action() {
			const $el = self.$articles.children('[data-page]');
			const top = $(this).scrollTop();
			let $current = null;

			if (!$el.length) return false;

			if (top + $(this).height() === $(document).height()) {
				$current = $el.eq($el.length - 1) ? $el.eq($el.length - 1) : null;
			} else {
				$el.each(function (key) {
					if (top >= $(this).offset().top - (SCROLL_OFFSET + 5)) {
						$current = $(this);
					}
				});
			}

			// update page
			let page = $current && $current.length ? $current.data('page') : 1;
			updatePage(page);
		}

		if (sw) {
			$(window).off('scroll.redgoose');
			$(window).on('scroll.redgoose', function () {
				// 너무많은 스크롤 이벤트가 트리깅 하는것을 방지하기 위하여 셋 타임아웃을 걸어놓았다.
				clearTimeout(self.scrollTimer);
				self.scrollTimer = setTimeout(action, delay);
			});
		} else {
			$(window).off('scroll.redgoose');
		}
	}

	/**
  * update page
  * 변경된 페이지 번호로 url 업데이트 한다.
  *
  * @param {Number} page
  */
	function updatePage(page) {
		if (!URL) return;

		let url = new URL(window.location.href);
		let urlParams = url.searchParams;
		let urlPage = url.searchParams.get('page');
		urlPage = urlPage ? parseInt(urlPage) : 1;

		if (page === urlPage) return;

		if (page === 1) {
			urlParams.delete('page');
		} else {
			urlParams.set('page', page);
		}

		let newUrl = location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');

		// update url
		console.log('wwwww', newUrl);
		parent.history.replace({ url: newUrl, type: 'index' }, null, newUrl);
	}

	/**
  * init items event
  *
  * @param {Object} $items
  */
	function initItemsEvent($items) {
		function onClickArticle(e) {
			let srl = $(this).data('srl');
			if (!!srl) {
				parent.article.open(srl).then(onArticleOpen);
			}
			return false;
		}

		function onArticleOpen() {
			self.destroyIndexEvent();
		}

		$items.on('click', onClickArticle);
	}

	/**
  * METHODS
  */

	/**
  * init
  *
  * @param {Object} options
  */
	this.init = function (options = {}) {
		if (!this.$articles.length) return false;

		// set srls
		this.srls.nest = options.nest_srl;
		this.srls.category = options.category_srl;

		// set options
		this.options.size = options.size || LOAD_PAGE_PER_SIZE;

		// set toggle category for mobile
		this.$category.children('.categories__toggle').on('click', toggleCategory);

		// initial select item event
		initItemsEvent(this.$articles.find('.grid-item > a'));

		// initial history pop state event
		parent.history.initPopEvent();

		// set masonry
		masonry();

		// 페이지 이동 안되도록 주소변경
		self.$more.children('a').attr('href', 'javascript:;');

		// set more articles event
		moreButton(true);

		// set change page sensor
		scrollEvent(true);
	};

	/**
  * push page
  * 특정 페이지 데이터를
  *
  * @param {Number} page
  */
	this.pushPage = function (page) {
		moreArticles(page).then();
	};

	/**
  * destroy index event
  * 목록에 관련된 이벤트를 모두 끈다.
  */
	this.destroyIndexEvent = function () {
		if (this.masonry) {
			masonry(false);
		}
		scrollEvent(false);
	};

	/**
  * restore index event
  * 목록에 관련된 이벤트를 모두 다시켠다.
  */
	this.restoreIndexEvent = function () {
		if (!this.masonry) {
			masonry(true);
		}
		scrollEvent(true);
	};

	/**
  * use masonry
  * masonry 사용할지 안할지에 대한 공개 메서드
  *
  * @param {Boolean} sw
  */
	this.useMasonry = function (sw) {
		masonry(sw);
	};
}

function Article(parent) {
	const self = this;
	const $html = $('html');

	/**
  * PUBLIC VARIABLES
  */
	this.backupIndexScrollTop = 0;

	/**
  * FUNCTIONS
  */

	/**
  * open
  *
  * @param {Number} srl
  * @return {Promise}
  */
	async function open(srl) {
		const url = `${parent.options.root}/article/${srl}/`;

		// load article page
		parent.$popup.load(`${url}?mode=popup`, el => {
			let $el = $(el);
			let title = $el.find('.article__header > h1').text();
			title = !!title ? `${parent.options.title} / ${title}` : parent.options.title;

			// push history
			console.log(url);
			parent.history.push({ url: url, type: 'article' }, title, url);
		});

		// save scroll position
		self.backupIndexScrollTop = $html.scrollTop();

		// interaction
		parent.$popup.addClass('popupArticle-ready');
		await sleep(10);
		parent.$popup.addClass('popupArticle-show');
		await sleep(300);
		parent.$popup.removeClass('popupArticle-ready');
		window.scrollTo(0, 0);
		parent.$app.addClass('disabled');
	}

	/**
  * close
  *
  * @return {Promise}
  */
	async function close() {
		console.log('close article');
	}

	/**
  * METHODS
  */

	/**
  * open article
  *
  * @param {Number} srl
  */
	this.open = async function (srl) {
		await open(srl);
	};

	/**
  * close article
  *
  */
	this.close = async function () {
		close().then();
	};

	this.go = function (srl) {};
}

// default options
const defaultOptions = {
	root: '',
	gooseRoot: '',
	debug: false
};

/**
 * init google analytics
 *
 * @param {Boolean} sw
 */
function initGoogleAnalytics(sw) {
	if (!sw) return null;

	// Google Analytics
	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments);
		}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
	ga('create', 'UA-42563094-1', 'redgoose.me');
	ga('send', 'pageview');
}

/**
 * Redgoose
 *
 * @param {Object} options
 */
function Redgoose(options) {
	this.$app = $('main');
	this.popup = 'popupArticle';
	this.$popup = $(`#${this.popup}`);

	// assign options
	this.options = Object.assign({}, defaultOptions, options);

	// init history
	this.history = new AppHistory(this);

	// init header
	this.header = new Header(this);

	// init index
	this.index = new Index(this);

	// init article
	this.article = new Article(this);

	// init google analytics
	initGoogleAnalytics(false);
}

return Redgoose;

})));
//# sourceMappingURL=redgoose.js.map
