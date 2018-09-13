import * as util from '../libs/util';

/**
 * Header class
 */
export default function Header(app) {

	const self = this;

	this.name = 'header';
	this.app = app;
	this.$nav = $('#gnb');

	(function constructor(){
		// init navigation
		initNavigation();
	})();

	function initNavigation()
	{
		let $buttons = self.$nav.find('ul > li > a');
		$buttons.on('click', function() {
			// 하위메뉴가 있고 터치 디바이스라면 클릭진행을 막는다.
			return !(util.isTouchDevice() && $(this).next().length);
		});
	}

}