import Index from './Index';
import Work from './Work';
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
		this.work = null;
		this.header = new Header(this);
		this.history = new History(this);
		// set etc
		this.mode = null;
		this.options = {
			...defaultOptions,
			...options
		};

		// switching action
		switch(type)
		{
			case 'index':
				// change mode
				this.mode = 'index';
				// init api
				if (this.options.urlApi && this.options.token)
				{
					api.init(this);
				}
				// play
				this.index = new Index(this);
				break;

			case 'work':
				// change mode
				this.mode = 'view';
				// init api
				if (this.options.urlApi && this.options.token)
				{
					api.init(this);
				}
				// play
				this.work = new Work(this);
				break;

			case 'none':
				break;

			default:
				this.mode = 'error';
				console.error('Error initialize');
				break;
		}
	}

}

module.exports = Redgoose;
