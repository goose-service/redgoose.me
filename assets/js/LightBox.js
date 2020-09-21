/**
 * LightBox
 */
class LightBox {

  #id = 'lightbox';
  #htmlClass = 'popup-lightbox';
  $body = null;

  constructor()
  {}

  /**
   * template
   *
   * @param {String} src
   * @param {String} alt
   * @return ChildNode
   */
  #template(src, alt)
  {
    const template = document.createElement('template');
    let html = `<div id="${this.#id}" class="lightbox">`;
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
  open(src, alt)
  {
    if (!!this.$body)
    {
      this.$body.remove();
      this.$body = null;
    }
    this.$body = this.#template(src, alt);
    this.$body.addEventListener('click', () => this.close());
    document.body.appendChild(this.$body);
    document.querySelector('html').classList.add(this.#htmlClass);
  }

  /**
   * close
   */
  close()
  {
    if (!this.$body) return;
    this.$body.remove();
    this.$body = null;
    document.querySelector('html').classList.remove(this.#htmlClass);
  }

}

export default LightBox;