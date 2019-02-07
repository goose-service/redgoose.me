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

/**
 * filtering elements in body
 * 우선 이미지 태그들을 찾아서 태그로 한번 씌우는 작업을 한다.
 */
function filteringElementsInBody()
{
	const $body = $detail.find('.detail__body');
	const $images = $body.find('img');
	$images.each(function() {
		$(this).wrap('<span class="image"></span>');
	});
}


export default function()
{
	toggleLikeButtonEvent();
	filteringElementsInBody();
}