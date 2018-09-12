/**
 * History class
 */

export default function History(app) {

	const self = this;
	const $title = $('head > title');

	this.name = 'history';
	this.app = app;
	this.env = null;
	this.title = null;
	this.url = null;

	(function constructor(){
		if (!support()) return;

		window.removeEventListener('popstate', onHook);
		window.addEventListener('popstate', onHook);
	})();

	/**
	 * on hook history
	 *
	 * @param {String} e.state.url
	 * @param {String} e.state.title
	 * @param {String} e.state.action
	 */
	function onHook(e)
	{
		let state = e.state || {};

		try
		{
			switch(state.action)
			{
				case 'change-category':
					if (app.mode === 'work')
					{
						app.index.work.close(false).then();
						return;
					}
					else if (app.mode === 'index')
					{
						if (app.index && state.category_srl)
						{
							app.index.changeCategory(state.category_srl || null, false);
							return;
						}
					}
					throw 'no params';

				case 'open-work':
					if (app.mode === 'index')
					{
						app.index.work.open(e.state.srl, e.state.title, false).then();
						return;
					}
					return;

				case 'none':
					if (app.mode === 'work' && (app.index.work.$popup && app.index.work.$popup.length))
					{
						app.index.work.close(false).then();
						return;
					}
					throw 'no page';

				default:
					throw 'none';
			}
		}
		catch(e)
		{
			window.location.reload();
		}
	}

	/**
	 * check support history
	 *
	 * @Return {Boolean}
	 */
	function support()
	{
		return !!history.pushState;
	}

	/**
	 * PUBLIC AREA
	 */

	/**
	 * push state
	 *
	 * @param {Object} env
	 * @param {String} title
	 * @param {String} url
	 */
	this.push = function(env, title, url)
	{
		if (!(support() && url)) return;

		// save member values
		this.env = env;
		this.title = title;
		this.url = url;

		// change title
		if (title) $title.text(title);

		// update history
		history.pushState(env || null, title || url, url);
	};

	/**
	 * replace state
	 *
	 * @param {Object} env
	 * @param {String} title
	 * @param {String} url
	 */
	this.replace = function(env, title, url)
	{
		if (!(support() && url)) return;

		// save member values
		this.env = env;
		this.title = title;
		this.url = url;

		// change title
		if (title) $title.text(title);

		// update history
		history.replaceState(env || null, title || url, url);
	};

}