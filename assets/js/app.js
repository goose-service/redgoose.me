import Index from './Index';
import Detail from './Detail';

import '../css/app.scss';

class Redgoose {

	constructor(type='index')
	{
		this.name = 'redgoose';
		this.index = null;
		this.detail = null;

		switch(type)
		{
			case 'index':
				this.index = new Index();
				console.log('play index');
				break;

			case 'detail':
				console.log('play detail');
				break;
		}
	}

	/**
	 * 외부에서 컨트롤이 가능한 메서드
	 */
	control()
	{
		//
	}

}

module.exports = Redgoose;
