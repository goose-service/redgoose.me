import $ from 'jQuery';
import AppHistory from './AppHistory';
import Header from './Header';
import Index from './Index';
import Article from './Article';
import * as etc from './etc';


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

	// init google analytics
	etc.initGoogleAnalytics(false);

}


export default Redgoose;