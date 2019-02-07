const $html = $('html');

/**
 * toggle category on mobile
 */
function toggleCategoryNavigation()
{
	const $button = $('.index__categories > button');

	if (!$button.length) return;
	$button.on('click', function() {
		$(this).parent().toggleClass('open');
	});
}

export default function()
{
	toggleCategoryNavigation();
}