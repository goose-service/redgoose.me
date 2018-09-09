/**
 * History class
 */

export default function History(app) {

	const self = this;
	const $title = $('head > title');

	this.name = 'history';
	this.app = app;

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

		switch(state.action)
		{
			case 'change-category':
				self.app.index.changeCategory(state.srl || null, false);
				return;

			default:
				window.location.reload();
				break;
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
		// change title
		if (title) $title.text(title);
		// update history
		history.replaceState(env || null, title || url, url);
	};

}