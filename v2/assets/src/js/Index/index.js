import View from '../View';
import AppHistory from '../Util/AppHistory';
import CSS3 from '../Util/CSS3';

const appHistory = new AppHistory();
const ITEM_DELAY = 50;
const SCROLL_SPEED = 300;


function Index() {

	this.options = {};
	this.masonry = null;
	this.$loadItemButton = null;
	this.view = new View(this);

	// init app history
	appHistory.initPopEvent(this.view, this);

	/**
	 * init
	 *
	 * @Param {Object} userOptions
	 */
	this.init = (userOptions) => {

		this.options = $.extend({}, userOptions, this.options);

		let $items = this.options.$articleIndex.find('.grid-item');
		this.initOpenArticle($items);

		this.$loadItemButton = this.options.$moreItemArea.find('a');

		appHistory.replace(
			{ url: location.pathname + location.search, type: 'index' },
			null,
			location.pathname + location.search
		);

	};

	/**
	 * init masonry
	 *
	 * @Param {Object} _index
	 */
	this.initMasonry = (_index) => {

		// add className `grid`
		$(_index).addClass('grid');

		// init masonry
		this.masonry = new Masonry(_index, {
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			transitionDuration : '0s',
			hiddenStyle : {},
			visibleStyle : {}
		});
	};

	/**
	 * init load item
	 *
	 * @Param {Object} $body
	 */
	this.initLoadItem = ($body) => {
		if (!this.options.$moreItemArea.length) return false;

		this.$loadItemButton.on('click', this.loadItemEvent);
	};

	/**
	 * item template
	 *
	 * @Param {Object} src
	 * @Param {Boolean} isAnimation
	 * @Return {String}
	 */
	this.itemTemplate = (src, isAnimation) => {
		let str = `` +
			`<div class="grid-item ${src.size_className} ${isAnimation && 'ready'}">` +
				`<a href="${window.redgooseState.root}/article/${this.options._nest ? this.options._nest+'/' : ''}${src.srl}/">` +
					`<figure style="background-image: url('${window.redgooseState.gooseRoot}/${src.json.thumbnail.url}')">` +
						src.title +
					`</figure>` +
				`</a>` +
			`</div>`;
		return str;
	};

	/**
	 * load item event
	 *
	 * @Param {Object} e
	 */
	this.loadItemEvent = (e) => {

		let $button = $(e.currentTarget);
		let url = $button.attr('href');

		// play loading button
		this.loadingLoadItem(true);

		// off more items button
		this.$loadItemButton.off('click');

		// load item
		let loadItem = this.load(url);
		loadItem.done((articles, nextpage, currentpage) => {
			// stop loading button
			this.loadingLoadItem(false);

			// update index
			this.updateIndex(articles, nextpage, true, true);

			// update history
			let url = location.pathname + '?page=' + currentpage;
			appHistory.push({ url: url, type: 'index' }, null, url);
		});

		return false;
	};

	/**
	 * update index
	 *
	 * @Param {Object} articles
	 * @Param {int} nextpage
	 * @Param {Boolean} isAnimation
	 * @Param {Boolean} isMoveScroll
	 */
	this.updateIndex = (articles, nextpage, isAnimation, isMoveScroll) => {
		// update more item button
		if (nextpage)
		{
			this.options.$moreItemArea.removeClass('hide');

			let url = this.$loadItemButton.attr('href').replace(/page=(.+)/, "page=" + nextpage);
			this.$loadItemButton
				.attr('href', url)
				.on('click', this.loadItemEvent);
		}
		else
		{
			this.options.$moreItemArea.addClass('hide');
		}

		// make items
		let items = articles.map((o) => {
			return this.itemTemplate(o, isAnimation);
		}).join('');
		let $items = $(items);

		if (isAnimation)
		{
			$items.each((k, o) => {
				let delay = k * ITEM_DELAY;
				let $el = $(o);

				CSS3.transitionEnd($el, (e) => {
					$el.removeClass('ready show');
				});

				setTimeout(() => {
					$el.addClass('show');
				}, delay);
			});
		}

		// init open article event
		this.initOpenArticle($items);

		// append items in index
		this.options.$articleIndex.append($items);
		this.masonry.appended($items);

		// move scroll
		if (isMoveScroll)
		{
			let top = $items.eq(0).offset().top - 30;
			$("html, body").stop().animate({ scrollTop: top }, SCROLL_SPEED, 'swing');
		}
	};

	/**
	 * loading load item
	 *
	 * @Param {Boolean} sw
	 */
	this.loadingLoadItem = (sw) => {
		if (!this.$loadItemButton.length) return false;
		if (sw)
		{
			this.$loadItemButton.addClass('loading');
		}
		else
		{
			this.$loadItemButton.removeClass('loading');
		}
	};

	/**
	 * load item
	 *
	 * @Param {String} url
	 * @Return {Object}
	 */
	this.load = (url) => {

		let defer = $.Deferred();

		$.post(url, (res) => {
			if (res.state == 'success')
			{
				defer.resolve(res.articles, res.nextpage, res.currentpage);
			}
			else
			{
				defer.reject(res.message);
			}
		}, 'json');

		return defer.promise();
	};

	/**
	 * init open article event
	 *
	 * @Param {Object} $items
	 */
	this.initOpenArticle = ($items) => {
		$items.each((n, el) => {
			$(el).find('a').on('click', (e) => {
				let button = $(e.currentTarget);
				this.view.open(button.attr('href'));
				return false;
			});
		});
	};

	/**
	 * update
	 *
	 * @Param {String} url
	 */
	this.update = (url) => {

		// off more items button
		this.$loadItemButton.off('click');

		// off loading
		this.loadingLoadItem(true);

		// remove items
		this.masonry.remove(this.options.$articleIndex.find('.grid-item'));

		// load item
		let loadItem = this.load(url);
		loadItem.done((articles, nextpage, currentpage) => {
			// stop loading button
			this.loadingLoadItem(false);

			// update index
			this.updateIndex(articles, nextpage, false, false);

			this.masonry.layout();
		});

	}
}

export default Index;
