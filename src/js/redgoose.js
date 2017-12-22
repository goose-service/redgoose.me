import $ from 'jQuery';
import AppHistory from './AppHistory';
import Header from './Header';
import Index from './Index';
import Article from './Article';
import * as etc from './etc';
import * as util from './util';


/**
 * Redgoose
 *
 * @param {Object} options
 */
function Redgoose(options)
{
	this.$app = $('main');
	this.popup = 'popupArticle';
	this.$popup = $(`#${this.popup}`);
	this.mode = null;

	// assign options
	this.options = Object.assign({}, etc.defaultOptions, options);

	// init history
	this.history = new AppHistory(this);

	// init header
	this.header = new Header(this);

	// init index
	this.index = new Index(this);

	// init article
	this.article = new Article(this);

	// set touch device
	if (util.isTouchDevice())
	{
		$('html').addClass('touch');
	}

	// init google analytics
	etc.initGoogleAnalytics(!options.dev);
}


export default Redgoose;