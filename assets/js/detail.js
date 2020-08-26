import $ from 'cash-dom';
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

    // request like
    util.ajax(`/on-like/${app.srl}/`, 'post').then(function(res) {
      try
      {
        res = JSON.parse(res);
        if (!res.success) throw 'error';
        $self.find('em').text(res.data.star);
        util.setCookie(`redgoose-star-${app.srl}`, '1', 10, app.url);
      }
      catch(e)
      {
        $self.prop('disabled', false);
        alert('Error update like');
      }
    }).catch(function(error) {
      $self.prop('disabled', false);
      alert('Error update like');
    });
  });
}

export default function()
{
  toggleLikeButtonEvent();
}
