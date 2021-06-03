/**
 * LightBox
 */
function LightBox() {

  const id = 'lightbox';
  const htmlClass = 'popup-lightbox';
  this.$body = null;

  /**
   * template
   *
   * @param {String} src
   * @param {String} alt
   * @return ChildNode
   */
  function template(src, alt)
  {
    const template = document.createElement('template');
    let html = `<div id="${id}" class="lightbox">`;
    html += `<figure class="lightbox__body">`;
    html += `<img src="${src}" alt="${alt}"/>`;
    html += `</figure>`;
    html += `</div>`;
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  /**
   * open
   *
   * @param {String} src
   * @param {String} alt
   */
  this.open = function(src, alt)
  {
    if (!!this.$body)
    {
      this.$body.remove();
      this.$body = null;
    }
    this.$body = template(src, alt);
    this.$body.addEventListener('click', () => this.close());
    document.body.appendChild(this.$body);
    document.querySelector('html').classList.add(htmlClass);
  }

  /**
   * close
   */
  this.close = function()
  {
    if (!this.$body) return;
    this.$body.remove();
    this.$body = null;
    document.querySelector('html').classList.remove(htmlClass);
  }

}

export default LightBox;
