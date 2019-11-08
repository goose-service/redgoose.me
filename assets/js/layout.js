import * as util from "./util";

const $html = $('html');
const $body = $('body');
const $header = $('.layout-header');
let saveScrollPosition = 0;

/**
 * toggle navigation
 */
function toggleNavigation()
{
	const $button = $('.button--menu');
	$button.on('click', function() {
		if ($header.hasClass('on-menu'))
		{
			$header.removeClass('on-menu');
			$html.removeClass('not-scroll');
			$body.scrollTop(saveScrollPosition);
		}
		else
		{
			saveScrollPosition = $html.scrollTop() || $body.scrollTop();
			$header.addClass('on-menu');
			$html.addClass('not-scroll');
		}
	});
}

/**
 * initial navigation event
 */
function initNavigation()
{
	let $buttons = $header.find('.layout-header__menus > ul > li > a');
	$buttons.on('click', function() {
		// 하위메뉴가 있고 터치 디바이스라면 클릭진행을 막는다.
		if ($(window).width() < 768) return true;
		return !(util.isTouchDevice() && $(this).next().length);
	});
}

export default function()
{
	// toggle navigation
	toggleNavigation();

	// initial navigation
	initNavigation();
}