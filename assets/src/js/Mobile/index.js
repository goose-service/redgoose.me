function Mobile() {

	/**
	 * toggle navigation
	 *
	 * @param {Object} $selector
	 * @param {Object} $target
	 */
	this.toggleNavigation = ($selector, $target) => {
		$selector.on('click', () => {
			$target.toggleClass('active');
		});
	};

	/**
	 * toggle category list
	 *
	 * @param {Object} $selector
	 */
	this.toggleCategory = ($selector) => {
		$selector.on('click', (e) => {
			$(e.currentTarget).parent().toggleClass('active');
		});
	};

	this.init = () => {
		this.toggleNavigation($('#toggleNavigation'), $('#navigation'));
	}

}

export default Mobile;