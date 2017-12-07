import $ from 'jQuery';
import Masonry from 'Masonry';

import * as util from './util';


export default function Index(parent)
{
	const self = this;

	this.srls = {};
	this.selector_articles = '#articles';
	this.$index = $('.index');
	this.$articles = this.$index.find('.index__articles');
	this.$category = this.$index.find('.index__categories');
	this.$more = this.$index.find('.index__loadMore');
	this.masonry = null;

	// masonry
	function masonry()
	{
		self.$articles.addClass('masonry');
		self.masonry = new Masonry(self.selector_articles, {
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			transitionDuration : '0s',
			hiddenStyle : {},
			visibleStyle : {}
		});
	}

	// more articles
	async function moreArticles(page)
	{
		// turn on loading
		moreButton(false);

		// TODO: call ajax
		await util.sleep(1000);

		// TODO 데이터 가져오기

		// turn off loading
		moreButton(true);

		return false;
	}

	// more load articles
	function loadMoreTrigger()
	{
		moreArticles(parseInt(this.getAttribute('nextPage'))).then();
		return false;
	}

	/**
	 * control more button
	 *
	 * @param {Boolean} sw
	 */
	function moreButton(sw)
	{
		// toggle category
		function toggleCategory()
		{
			$(this).toggleClass('categories__toggle-active');
			$(this).next().toggleClass('categories__index-active');
		}

		if (sw)
		{
			self.$more.children('a').on('click', loadMoreTrigger);
			self.$more.removeClass('loadMore-loading');
		}
		else
		{
			self.$more.children('a').off('click', loadMoreTrigger);
			self.$more.addClass('loadMore-loading');
		}
	}

	/**
	 * init
	 *
	 * @param {Object} options
	 */
	this.init = function(options={})
	{
		if (!this.$articles.length) return false;

		// set srls
		this.srls.nest = options.nest_srl;
		this.srls.category = options.category_srl;

		// set toggle category for mobile
		this.$category.children('.categories__toggle').on('click', toggleCategory);

		// set masonry
		masonry();

		// set more articles event
		moreButton(true);

		// set change page sensor
		// TODO
	}

}