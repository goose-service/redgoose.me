import * as util from "./util";

const app = window.app;
const $detail = $('.detail');

/**
 * toggle like button event
 */
function toggleLikeButtonEvent()
{
	const $button = $detail.find('.detail__like > button');

	$button.on('click', function() {
		const $self = $(this);
		$self.prop('disabled', true);
		// update star
		$.post(`/on-like/${app.srl}`, function(res) {
			try
			{
				res = JSON.parse(res);
				if (!res.success) throw 'error';
				$self.find('em').text(res.data.star);
				util.setCookie(`redgoose-star-${app.srl}`, '1', 10, app.url);
			}
			catch(e)
			{
				alert('Error update like');
			}
		});
	});
}

export default function()
{
	toggleLikeButtonEvent();
}