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
	// assign options
	this.options = Object.assign({}, etc.defaultOptions, options);

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