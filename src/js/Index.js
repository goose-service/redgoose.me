import $ from 'jQuery';
import Masonry from 'Masonry';

import * as util from './util';


export default function Index(parent)
{
	const self = this;

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
		self.$more.addClass('loadMore-loading');

		// TODO: call ajax
		await util.sleep(1000);

		// turn off loading
		//self.$more.removeClass('loadMore-loading');

		return false;
	}

	// toggle category
	function toggleCategory()
	{
		$(this).toggleClass('categories__toggle-active');
		$(this).next().toggleClass('categories__index-active');
	}

	this.init = function()
	{
		if (!this.$articles.length) return false;

		// set toggle category for mobile
		this.$category.children('.categories__toggle').on('click', toggleCategory);

		// set masonry
		masonry();

		// set more articles event
		this.$more.children('a').on('click', function() {
			moreArticles(parseInt(this.getAttribute('nextPage'))).then();
			return false;
		});

		// set change page sensor
		// TODO
	}

}