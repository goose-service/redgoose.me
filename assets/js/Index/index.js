/**
 * Index class
 */
export default class Index {

	/**
	 * constructor
	 *
	 * @param {Redgoose} app
	 */
	constructor(app)
	{
		this.name = 'index';
		this.app = app;
		this.$index = $('#index');
		this.$more = $('#index_button_more');

		try
		{
			// init masonry
			if (this.$index && this.$index.length)
			{
				// TODO: init masonry
			}

			if (this.$more && this.$more.length)
			{
				// TODO: more 이벤트 만들기
			}

			// TODO: change category event
			// TODO: scroll event
			// TODO: set history event
		}
		catch(e)
		{
			console.error(e);
		}
	};

	more()
	{
		//
		console.log('more load works');
	}

	open()
	{
		//
		console.log('open work');
	};

	close()
	{
		//
		console.log('close work');
	};

}
