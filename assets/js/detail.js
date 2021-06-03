import $ from 'cash-dom';
import LightBox from './LightBox';
import * as util from './util';

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
        if (!res.success) throw new Error();
        $self.find('em').text(res.star);
      }
      catch(e)
      {
        throw new Error();
      }
    }).catch(function(error) {
      $self.prop('disabled', false);
      alert('Error update like');
    });
  });
}

/**
 * initial images in grid item
 */
function initImagesInGridItem()
{
  const lightbox = new LightBox();
  const $images = $detail.find('img');
  $images.each(function() {
    this.addEventListener('click', (e) => {
      if (!e.target.src) return;
      lightbox.open(e.target.src, e.target.name);
    });
  });
}

export default function()
{
  toggleLikeButtonEvent();
  initImagesInGridItem();
}
