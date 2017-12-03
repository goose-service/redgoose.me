import $ from 'jQuery';
import Masonry from 'Masonry';


export default function Index(parent)
{
	const self = this;

	this.selector_index = '#articles';
	this.$index = $(this.selector_index);
	this.$more = $('#loadMoreArticles');
	this.masonry = null;


	// masonry
	function masonry()
	{
		self.$index.addClass('masonry');
		self.masonry = new Masonry(self.selector_index, {
			itemSelector: '.articles__item',
			columnWidth: '.articles__sizer',
			transitionDuration : '0s',
			hiddenStyle : {},
			visibleStyle : {}
		});
	}

	// more articles
	function moreArticles()
	{
		console.log($(this));
		return false;
	}

	this.init = function()
	{
		if (!this.$index.length) return false;

		// TODO: set masonry event
		console.log(Masonry);
		// set masonry
		masonry();

		// ser more articles event
		this.$more.on('click', moreArticles);

		console.log('init index');
	}

}