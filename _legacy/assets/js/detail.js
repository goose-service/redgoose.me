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
    if (!!this.closest('picture')) return;
    this.addEventListener('click', e => {
      if (!e.target.src) return;
      lightbox.open(e.target.src, e.target.name);
    });
  });
}

/**
 * initialize heading elements
 */
function initHeadingElements()
{
  const { origin, pathname } = location;
  const $elements = $detail.find('.detail__body').find('h1,h2,h3,h4,h5,h6');
  $elements.each((_, el) => {
    let text = el.innerText.replace(/\s+/g, '-').toLowerCase();
    const appendElement = document.createElement('a');
    appendElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    appendElement.href = `${origin}${pathname}#${text}`;
    appendElement.className = 'anchor';
    el.insertBefore(appendElement, el.firstChild);
  });
}

export default function()
{
  toggleLikeButtonEvent();
  initImagesInGridItem();
  initHeadingElements();
}
