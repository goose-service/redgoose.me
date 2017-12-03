import $ from 'jQuery';
import * as util from './util';
import * as preference from './preference';


/**
 * Header
 */
export default function Header()
{
	const self = this;
	this.$header = $('.layout-header');
	this.$gnb = this.$header.find('.gnb');

	/**
	 * Toggle gnb from mobile
	 */
	function toggleGnbFromMobile()
	{
		self.$header.find('.toggle-gnb').on('click', function() {
			$(this).toggleClass('toggle-gnb-active');
			self.$gnb.toggleClass('gnb-active');
		});
	}

	/**
	 * gnb event for touch
	 * 터치 디바이스이며 모바일보다 큰 사이즈라면 터치 작동에 대한 대응
	 *
	 */
	function gnbEventForTouch()
	{
		if (util.isTouchDevice() && preference.SIZE_MOBILE < util.getWindowSize().width)
		{
			self.$gnb.find('.gnb__dep-1 > li > a').on('click', false);
		}
	}


	this.init = function()
	{
		gnbEventForTouch();
		toggleGnbFromMobile();
	}

}