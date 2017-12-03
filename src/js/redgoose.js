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

	// TODO: default options 만들어서 `options`와 합치기

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