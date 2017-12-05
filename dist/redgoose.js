(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jQuery'), require('Masonry')) :
	typeof define === 'function' && define.amd ? define(['jQuery', 'Masonry'], factory) :
	(global.Redgoose = factory(global.$,global.Masonry));
}(this, (function ($,Masonry) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Masonry = Masonry && Masonry.hasOwnProperty('default') ? Masonry['default'] : Masonry;

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

function sleep(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

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

function Index(parent) {
	const self = this;

	this.selector_articles = '#articles';
	this.$index = $('.index');
	this.$articles = this.$index.find('.index__articles');
	this.$category = this.$index.find('.index__categories');
	this.$more = this.$index.find('.index__loadMore');
	this.masonry = null;

	// masonry
	function masonry() {
		self.$articles.addClass('masonry');
		self.masonry = new Masonry(self.selector_articles, {
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			transitionDuration: '0s',
			hiddenStyle: {},
			visibleStyle: {}
		});
	}

	// more articles
	async function moreArticles(page) {
		// turn on loading
		self.$more.addClass('loadMore-loading');

		// TODO: call ajax
		await sleep(1000);

		// turn off loading
		//self.$more.removeClass('loadMore-loading');

		return false;
	}

	// toggle category
	function toggleCategory() {
		$(this).toggleClass('categories__toggle-active');
		$(this).next().toggleClass('categories__index-active');
	}

	this.init = function () {
		if (!this.$articles.length) return false;

		// set toggle category for mobile
		this.$category.children('.categories__toggle').on('click', toggleCategory);

		// set masonry
		masonry();

		// set more articles event
		this.$more.children('a').on('click', function () {
			moreArticles(parseInt(this.getAttribute('nextPage'))).then();
			return false;
		});

		// set change page sensor
		// TODO
	};
}

function Article() {}

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

	// TODO: default options 만들어서 `options`와 합치기

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
