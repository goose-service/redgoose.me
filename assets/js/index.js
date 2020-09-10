import $ from 'cash-dom';
import shuffle from 'auto-writer/src/shuffle';

/**
 * toggle category on mobile
 */
function toggleCategoryNavigation()
{
	const $button = $('.index-categories > button');

	if (!$button.length) return;
	$button.on('click', function() {
		$(this).parent().toggleClass('index-categories--on');
	});
}

function mouseOverItems()
{
	const $works = $('.index-works a');
	$works.each(function() {
		$(this).on('mouseenter', function() {
			if ($(window).width() < 768) return true;
			const $caption = $(this).find('.index-work__caption');
			const $elements = $caption.find('strong, em');
			$elements.each(function(n) {
				const self = this;
				setTimeout(() => shuffle(self, {
					text: self.innerText,
					pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
					randomTextType: n === 0 ? 'pattern' : 'unicode',
				}), 180 * n);
			});
		});
	});
}

export default function()
{
	toggleCategoryNavigation();
	mouseOverItems();
}
