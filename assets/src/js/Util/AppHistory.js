function AppHistory() {

	/**
	 * support
	 *
	 * @Return {Boolean}
	 */
	this.support = () => {
		return (history.pushState) ? true : false;
	};

	/**
	 * Push state
	 *
	 * @Param {Object} environment
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.push = (environment, title, url) => {
		if (!this.support()) return false;
		if (!url) return false;

		history.pushState(
			environment || null,
			title || url,
			url);
	};

	/**
	 * Replace state
	 *
	 * @Param {Object} environment
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.replace = (environment, title, url) => {
		if (!this.support()) return false;
		if (!url) return false;

		history.replaceState(
			environment || null,
			title || url,
			url);
	};

	/**
	 * Initial pop event
	 */
	this.initPopEvent = (view, index) => {

		window.addEventListener('popstate', (e) => {
			let state = e.state;

			if (state)
			{
				switch(state.type)
				{
					case 'article':
						if (window.redgooseState.isViewPopup)
						{
							view.go(state.url, true);
						}
						else
						{
							view.open(state.url, true);
						}
						break;

					case 'index':
						if (window.redgooseState.isViewPopup)
						{
							view.close(true);
						}
						else
						{
							// TODO : update article index
							index.update(state.url);
						}
						break;
				}
			}
			else
			{
				//view.close(true);
			}
		});
	}
}


export default AppHistory;