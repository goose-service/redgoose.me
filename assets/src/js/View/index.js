function View() {

	this.$el = {
		popup : $('#popupView')
	};


	/**
	 * open view
	 *
	 * @Param {String} url
	 */
	this.open = (url) => {
		// TODO : save scroll position
		// TODO : loading on
		this.$el.popup.load(url, (e) => {
			$('html').addClass('popup-mode');
			this.$el.popup.addClass('show');
		});
	};

	/**
	 * view init
	 */
	this.viewInit = () => {

	}
}

export default View;