import Index from './Index';
import Detail from './Detail';
import Header from './Header';
import History from './History';
// resource
import defaultOptions from './defaultOptions';
import * as api from './libs/api';
// css
import '../css/app.scss';

class Redgoose {

	/**
	 * constructor
	 *
	 * @param {String} type
	 * @param {Object} options
	 */
	constructor(type='index', options={})
	{
		this.name = 'redgoose';
		// set instance
		this.index = null;
		this.detail = null;
		this.header = new Header(this);
		this.history = new History(this);
		// set etc
		this.mode = null;
		this.options = {
			...defaultOptions,
			...options
		};

		// init api
		if (this.options.urlApi && this.options.token)
		{
			api.init(this);
		}

		// switching action
		switch(type)
		{
			case 'index':
				this.mode = 'index';
				this.index = new Index(this);
				break;

			case 'detail':
				this.mode = 'view';
				this.detail = new Detail(this);
				break;

			default:
				this.mode = 'error';
				console.error('Error initialize');
				break;
		}
	}

}

module.exports = Redgoose;
