import $ from 'jQuery';


export default function AppHistory() {

	const $title = $('head > title');

	/**
	 * check support
	 *
	 * @Return {Boolean}
	 */
	function support()
	{
		return !!history.pushState;
	}

	/**
	 * Push state
	 *
	 * @Param {Object} env
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.push = function(env, title, url)
	{
		if (!support()) return;
		if (!url) return;

		// change title
		if (title)
		{
			$title.text(title);
		}

		history.pushState(
			env || null,
			title || url,
			url
		);
	};

	/**
	 * Replace state
	 *
	 * @Param {Object} env
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.replace = function(env, title, url)
	{
		if (!support()) return;
		if (!url) return;

		// change title
		if (title)
		{
			$title.text(title);
		}

		history.replaceState(
			env || null,
			title || url,
			url
		);
	};

	/**
	 * initial history pop event
	 */
	this.initPopEvent = function()
	{
		function onPopState(e)
		{
			console.log('on pop state');
		}

		window.addEventListener('popstate', onPopState);
	}
}