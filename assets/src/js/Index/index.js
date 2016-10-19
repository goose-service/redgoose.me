import View from '../View';

const view = new View();


function Index() {

	this.options = {};
	this.masonry = null;
	this.$loadItemButton = null;

	this.init = (userOptions) => {
		this.options = Object.assign(userOptions, this.options);

		let $items = this.options.$articleIndex.find('.grid-item');
		this.initOpenArticle($items);

		this.$loadItemButton = this.options.$moreItemArea.find('a');
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
	 * @Return {String}
	 */
	this.itemTemplate = (src) => {
		let str = `` +
			`<div class="grid-item ${src.size_className}">` +
				`<a href="${this.options.root}/article/${this.options._nest ? this.options._nest+'/' : ''}${src.srl}/">` +
					`<figure style="background-image: url('${this.options.gooseRoot}/${src.json.thumbnail.url}')">` +
						src.title +
					`</figure>` +
				`</a>` +
			`</div>`;
		return str;
	};

	/**
	 * load item event
	 *
	 * @Param {String} url
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

		// done load item
		loadItem.done((articles, nextpage) => {
			// stop loading button
			this.loadingLoadItem(false);

			// update more item button
			if (nextpage)
			{
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
				return this.itemTemplate(o);
			}).join('');
			let $items = $(items);

			// init open article event
			this.initOpenArticle($items);

			// append items in index
			this.options.$articleIndex.append($items);
			this.masonry.appended($items);
		});

		return false;
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
				defer.resolve(res.articles, res.nextpage);
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
				view.open(button.attr('href') + '?popup=1');
				return false;
			});
		});
	}
}

export default Index;
