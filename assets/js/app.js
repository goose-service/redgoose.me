import Index from './Index';
import Detail from './Detail';
// resource
import defaultOptions from './defaultOptions';
// css
import '../css/app.scss';

class Redgoose {

	/**
	 * constructor
	 *
	 * @param {String} type
	 */
	constructor(type='index', options={})
	{
		this.name = 'redgoose';
		// set instance
		this.index = null;
		this.detail = null;
		// set etc
		this.mode = null;
		console.log(defaultOptions, options);
		this.options = {
			...defaultOptions,
			...options
		};

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
