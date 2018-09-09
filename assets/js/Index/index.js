import * as api from '../libs/api';
import * as util from '../libs/util';

/**
 * Index class
 */
export default function Index(app) {

	const self = this;

	this.name = 'index';
	this.app = app;
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

	(function constructor(){
		try
		{
			if (!Masonry) throw 'Not found Masonry vendor';

			// init toggle category event
			if (self.$categories && self.$categories.length)
			{
				initCategoryEvents();
			}

			// init masonry
			if (self.$index && self.$index.length)
			{
				// on masonry
				masonry(true);
			}

			if (self.$more && self.$more.length)
			{
				// TODO: more 이벤트 만들기
			}

			// update history
			if (!!self.nest.srl)
			{
				let url = `${self.app.options.urlRoot}/nest/${self.nest.id}${self.category.srl ? `/${self.category.srl}` : ''}`;
				let title = `${self.category.name ? `${self.category.name} / ` : ''}${self.nest.name} / ${self.app.options.title}`;
				self.app.history.replace(
					{
						url,
						title,
						srl: self.category.srl ? self.category.srl : null,
						action: 'change-category'
					},
					title,
					url
				);
			}

			// TODO: scroll event
		}
		catch(e)
		{
			console.error(e);
		}
	})();

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
	 * switching loading
	 *
	 * @param {Boolean} sw
	 */
	function loading(sw)
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
			self.changeCategory(srl, true);
			self.$categories.removeClass('active');
			return false;
		});
	}

	/**
	 * make index element
	 *
	 * @param {Array} index
	 * @return String
	 */
	function element(index)
	{
		let dom = index.map(function(o, k) {
			let sizeSet = (o.json.thumbnail && o.json.thumbnail.sizeSet) ? o.json.thumbnail.sizeSet.split('*') : [1,1];
			let classname = `${parseInt(sizeSet[0]) === 2 ? 'w2' : ''} ${parseInt(sizeSet[1]) === 2 ? 'h2' : ''}`.trim();
			return `<div class="indexWorks__item ${classname}">
				<a href="/articles/${o.srl}" data-srl="${o.srl}">
					<img src="${self.app.options.urlApi}/${o.json.thumbnail.path}" alt="${o.title}">
				</a>
			</div>`;
		}).join('');

		return dom;
	}

	/**
	 * PUBLIC AREA
	 */

	this.more = function()
	{
		//
		console.log('more load works');
	};

	this.open = function()
	{
		//
		console.log('open work');
	};

	this.close = function()
	{
		//
		console.log('close work');
	};

	/**
	 * change category
	 *
	 * @param {Number} srl
	 * @param {Boolean} useHistory
	 * @return {Promise}
	 */
	this.changeCategory = async function(srl, useHistory=false)
	{
		const { options } = this.app;

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
			this.$categories.find('li.on').removeClass('on');
			$selected.parent().addClass('on');

			// update value
			this.category = {
				srl: srl,
				name: $selected.children('span').text(),
			};

			// update history
			if (useHistory)
			{
				let url = `${options.urlRoot}/nest/${this.nest.id}${srl ? `/${srl}` : ''}`;
				let title = `${this.category.name ? `${this.category.name} / ` : ''}${this.nest.name} / ${options.title}`;
				this.app.history.push(
					{ url, title, srl, action: 'change-category' },
					title,
					url
				);
			}

			// off masonry
			if (this.masonry) masonry(false);
			// on loading
			loading(true);
			// remove empty element
			this.$index.children('.indexWorks__empty').remove();
			// hide more
			self.$more.addClass('indexMore--hide');

			// get datas
			let res = await api.get('/articles', {
				nest: options.nest_srl,
				field: 'srl,json,title',
				category: srl || '',
				order: 'srl',
				sort: 'desc',
				ext_field: 'next_page',
			});
			if (!res.success) throw 404;
			res = res.data;

			// make elements
			let elements = element(res.index);
			// remove prev elements
			this.$index.children('.indexWorks__item').remove();
			// append elements
			this.$index.append(elements);
			// off loading
			loading(false);
			// start masonry
			masonry(true);
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
			let img = null;
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
			this.$index.children('.indexWorks__item').remove();
			// append elements
			this.$index.addClass('empty').append(elements);
			// off loading
			loading(false);
		}
	}

}
