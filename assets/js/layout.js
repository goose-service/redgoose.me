import $ from 'cash-dom';
import * as util from "./util";

const $html = $('html');
const $header = $('.layout-header');

/**
 * toggle navigation
 */
function toggleNavigation()
{
	const $button = $header.find('.layout-header__buttons > button');
	const $navigation = $header.find('.header-navigation');
	const $dropdownContents = $header.find('.header-navigation, .layout-header__buttons > button');
	$dropdownContents.on('click', (e) => e.stopPropagation());
	$button.on('click', function() {
		const $self = $(this);
		$html.off('click.headerButtons');
		if ($self.hasClass('navigation'))
		{
			if ($self.hasClass('on'))
			{
				$self.removeClass('on');
				$navigation.removeClass('on');
			}
			else
			{
				$self.addClass('on');
				$navigation.addClass('on');
			}
		}
		$html.on('click.headerButtons', () => {
			$navigation.removeClass('on');
			$self.removeClass('on');
		});
	});
}

/**
 * initial navigation event
 */
function initNavigation()
{
	let $buttons = $header.find('.header-navigation > ul > li > a');
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