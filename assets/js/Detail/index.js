export default class Detail {

	/**
	 * constructor
	 *
	 * @param {Redgoose} app
	 * @param {Boolean} init
	 */
	constructor(app, init)
	{
		this.name = 'detail';

		// play
		if (init)
		{
			console.log('play detail');
		}
	}

}