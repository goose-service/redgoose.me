import $ from 'cash-dom';

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

export default function()
{
	toggleCategoryNavigation();
}
