import * as api from '../libs/api';
import IndexWork from './IndexWork';

const SCROLL_OFFSET = 100; // 페이지가 변화되는 스크롤 y축 위치 offset
const SCROLL_SPEED = 300; // 페이지 추가될때 스크롤 이동되는 속도
const SCROLL_DELAY = 100; // 스크롤 이벤트가 트리거까지 대기시간
const BLOCK_DELAY = 60; // 아이템들이 추가될때 fade in 딜레이 간격

/**
 * Index class
 */
export default function Index(app) {

	const self = this;

	this.name = 'index';
	this.app = app;
	this.work = new IndexWork(app, this);
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
		name: this.app.options.nest_name,
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
	function masonry(sw)
	{
		if (sw)
		{
			self.$index.addClass('masonry').removeClass('empty');
			self.masonry = new Masonry(self.index_selector, {
				itemSelector: '.indexWorks__item',
				columnWidth: '.indexWorks__sizer',
				transitionDuration : 0,
				hiddenStyle : {},
				visibleStyle : {},
			});
		}
		else
		{
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
	function loadingForCategory(sw)
	{
		if (sw)
		{
			// this.loading
			self.loading = setTimeout(function() {
				self.$loading.addClass('loading--show');
			}, 100);
		}
		else
		{
			if (self.loading)
			{
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
	function loadingForChangePage(sw)
	{
		if (sw)
		{
			self.$more.addClass('indexMore--processing');
		}
		else
		{
			self.$more.removeClass('indexMore--processing');
		}
	}

	/**
	 * init category event
	 * 모바일에서 카테고리 접기/펼치기 이벤트와 버튼을 클릭했을때 목록이 변하는 이벤트 설정
	 */
	function initCategoryEvents()
	{
		// toggle category list
		self.$categories.children('.indexCategories__toggle').on('click', function() {
			$(this).parent().toggleClass('active');
		});

		// change category
		const $categoryButtons = self.$categories.find('a');
		$categoryButtons.on('click', function() {
			if ($(this).parent().hasClass('on')) return false;
			const srl = parseInt(this.dataset.srl);
			self.changeCategory(srl, true).then();
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
	function indexItemElement(index, ready)
	{
		let dom = index.map(function(o, k) {
			let sizeSet = (o.json.thumbnail && o.json.thumbnail.sizeSet) ? o.json.thumbnail.sizeSet.split('*') : [1,1];
			let classname = `${parseInt(sizeSet[0]) === 2 ? 'w2' : ''} ${parseInt(sizeSet[1]) === 2 ? 'h2' : ''}`;
			if (ready) classname += ' ready';
			return `<div class="indexWorks__item${classname ? ' ' + classname.trim() : ''}">
				<a href="/article/${o.srl}" data-srl="${o.srl}">
					<img src="${self.app.options.urlApi}/${o.json.thumbnail.path}" alt="${o.title}">
				</a>
			</div>`;
		}).join('');
		let $dom = $(dom);

		// set items event
		initItemsEvent($dom);

		return $dom;
	}

	/**
	 * 스크롤을할때 주소에 페이지 번호가 변하는 기능을 초기화 한다.
	 *
	 * @param {Boolean} sw 이벤트 리스너를 껏다켜는 스위치
	 */
	function initScrollEvent(sw)
	{
		/**
		 * 현재 주소를 분석하여 새로운 `page`값이 적용된 url을 만들어서 `history.replace` 실행한다.
		 *
		 * @param {Number} page
		 */
		function updatePage(page)
		{
			const { history } = self.app;

			try
			{
				let url = new URL(window.location.href);
				let urlParams = url.searchParams;
				let urlPage = url.searchParams ? url.searchParams.get('page') : null;
				urlPage = urlPage ? parseInt(urlPage) : 1;

				if (page === urlPage) return;

				if (page === 1)
				{
					urlParams.delete('page');
				}
				else
				{
					urlParams.set('page', page);
				}

				let newUrl = location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');

				// change default page
				self.app.options.page = page;

				history.replace(
					{
						...history.env,
						...{ url: newUrl }
					},
					history.title,
					newUrl
				);
			}
			catch(e)
			{}
		}

		function action()
		{
			const $el = self.$index.children('[data-page]');
			const top = $(this).scrollTop();
			let $current = null;

			if (!$el.length) return false;

			if (top + $(this).height() === $(document).height())
			{
				$current = ($el.eq($el.length - 1)) ? $el.eq($el.length - 1) : null;
			}
			else
			{
				$el.each(function(key) {
					if (top >= ($(this).offset().top - (SCROLL_OFFSET + 5)))
					{
						$current = $(this);
					}
				});

				if (!$current)
				{
					$current = $el.eq(0);
				}

			}

			// update page
			let page = ($current && $current.length) ? $current.data('page') : 1;
			updatePage(page);
		}

		if (sw)
		{
			// set page on first item
			self.$index.children('.indexWorks__item').eq(0).attr('data-page', self.app.options.page || 1);
			$(window).off('scroll.redgoose_index').on('scroll.redgoose_index', function() {
				// 너무많은 스크롤 이벤트가 트리깅 하는것을 방지하기 위하여 셋 타임아웃을 걸어놓았다.
				clearTimeout(self.scrollEvent);
				self.scrollEvent = setTimeout(action, SCROLL_DELAY);
			});
		}
		else
		{
			$(window).off('scroll.redgoose_index');
		}
	}

	/**
	 * init items event
	 * 목록의 아이템 이벤트 설정
	 */
	function initItemsEvent($items)
	{
		$items.each(function() {
			const $button = $(this).children('a');
			$button.on('click', function(e) {
				e.preventDefault();
				let srl = parseInt(this.dataset.srl);
				let title = $(this).find('img').attr('alt');
				self.work.open(srl, title, true).then();
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
	 * @return {Promise}
	 */
	this.changeCategory = async function(srl, useHistory=false)
	{
		const { options } = self.app;

		// set select element
		let $selected = null;
		if (srl)
		{
			$selected = this.$categories.find(`a[data-srl=${srl}]`);
		}
		else
		{
			$selected = this.$categories.find('a').eq(0);
		}

		try
		{
			// change active menu
			self.$categories.find('li.on').removeClass('on');
			$selected.parent().addClass('on');

			// update value
			self.category = {
				srl: srl,
				name: $selected.children('span').text(),
			};

			// update history
			if (useHistory)
			{
				let url = `${options.urlRoot}/nest/${self.nest.id}${srl ? `/${srl}` : ''}`;
				let title = `${self.category.name !== 'All' ? `${self.category.name} - ` : ''}${self.nest.name} - ${options.title}`;
				self.app.history.push(
					{ url, title, srl, action: 'change-category' },
					title,
					url
				);
			}

			// off events in index
			self.toggleEvents(false);

			// on loading
			loadingForCategory(true);

			// remove empty element
			self.$index.children('.indexWorks__empty').remove();

			// hide more
			self.$more.addClass('indexMore--hide');

			// get datas
			let res = await api.get('/articles', {
				nest: options.nest_srl,
				field: 'srl,json,title',
				category: srl || '',
				order: 'srl',
				sort: 'desc',
				size: parseInt(self.app.options.size) || 10,
				ext_field: 'next_page',
			});
			if (!res.success) throw 404;
			res = res.data;

			// make elements
			let $elements = indexItemElement(res.index, false);

			// remove prev elements
			self.$index.children('.indexWorks__item').remove();

			// append elements
			self.$index.append($elements);

			// off loading
			loadingForCategory(false);

			// on events in index
			self.toggleEvents(true);

			// update more button
			if (res.nextPage)
			{
				self.$more.removeClass('indexMore--hide');
				self.$more.children('button').attr('data-page', res.nextPage);
			}
		}
		catch(e)
		{
			let message = null;
			switch (e)
			{
				case 404:
					message = 'Not found work.';
					break;
				default:
					console.error(e);
					message = 'Service error.';
					break;
			}
			// make elements
			let elements = `<div class="indexEmpty indexWorks__empty">
				<img src="${options.urlRoot}/assets/images/img-error.png" alt="error">
				<p>${message}</p>
			</div>`;
			// remove prev elements
			self.$index.children('.indexWorks__item').remove();
			// append elements
			self.$index.addClass('empty').append(elements);
			// off loading
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
	this.changePage = async function(page, scroll)
	{
		if (this.$more.hasClass('indexMore--processing')) return false;

		try
		{
			// on loading
			loadingForChangePage(true);

			// get data
			let params = {
				field: 'srl,json,title',
				app: this.app.options.app_srl,
				page,
				order: 'srl',
				sort: 'desc',
				size: parseInt(this.app.options.size) || 10,
				ext_field: 'next_page',
			};
			if (this.nest.srl) params.nest = this.nest.srl;
			if (this.category.srl) params.category = this.category.srl;
			let res = await api.get('/articles', params);
			if (!res.success) throw 404;
			res = res.data;

			// update more button
			if (res.nextPage)
			{
				this.$more.children('button').attr('data-page', res.nextPage);
			}
			else
			{
				this.$more.addClass('indexMore--hide');
			}

			// make new elements
			let $elements = indexItemElement(res.index, true);

			// append
			this.$index.append($elements);
			if (this.masonry) this.masonry.appended($elements);

			// play block animation
			$elements.each(function(key) {
				setTimeout(() => {
					$(this).removeClass('ready');
				}, BLOCK_DELAY * key);
			});

			if (scroll)
			{
				let $firstElement = $elements.eq(0);
				let top = $firstElement.offset().top - SCROLL_OFFSET;
				$firstElement.attr('data-page', page);
				$("html, body").stop().animate({ scrollTop: top }, SCROLL_SPEED, 'swing');
			}

			// off loading
			loadingForChangePage(false);
		}
		catch(e)
		{
			let message = null;
			switch (e)
			{
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
	this.toggleEvents = function(sw)
	{
		if (sw)
		{
			// reset masonry
			if (!self.masonry) masonry(true);
			// on scroll event
			initScrollEvent(true);
		}
		else
		{
			// destroy masonry
			if (self.masonry) masonry(false);
			// off scroll event
			initScrollEvent(false);
		}
	};

	// constructor
	(function constructor(){
		try
		{
			if (!Masonry) throw 'Not found Masonry vendor';

			// init toggle category event
			if (self.$categories && self.$categories.length)
			{
				initCategoryEvents();
			}

			// init masonry and items event
			if (self.$index && self.$index.children('.indexWorks__item') && self.$index.children('.indexWorks__item').length)
			{
				// init events
				self.toggleEvents(true);
				// set items event
				initItemsEvent(self.$index.children('.indexWorks__item'));
			}
			else
			{
				self.$index.addClass('empty');
			}

			// init more button
			if (self.$more && self.$more.length)
			{
				self.$more.children('button').on('click', function() {
					let page = parseInt(this.dataset.page) || null;
					if (!page) return false;
					self.changePage(page, true).then();
				});
			}

			// update history
			let url = location.pathname + location.search;
			let env = { url };
			if (!!self.nest.srl)
			{
				env.title = `${self.category.name ? `${self.category.name} - ` : ''}${self.nest.name} - ${self.app.options.title}`;
				env.category_srl = self.category.srl ? self.category.srl : null
				env.action = 'change-category';
			}
			else
			{
				env.title = self.app.options.title;
				env.action = 'none';
			}
			let srl = !!self.nest.srl ? (self.category.srl ? self.category.srl : null) : null;
			self.app.history.replace(env, env.title, url);
		}
		catch(e)
		{
			if (app.options.debug) console.error(e);
			$('.container').empty().html(`<article class="error">
				<figure class="error__image">
					<img src="${app.options.urlRoot}/assets/images/img-error.png" alt="error">
				</figure>
				<h1 class="error__message">Service error</h1>
			</article>`);
		}
	})();
}
