import * as api from '../libs/api';
import * as util from '../libs/util';

export default function Work(app) {

	const self = this;

	this.name = 'work';
	this.app = app;
	this.$container = $('#work');
	this.$body = this.$container.find('.work__body');
	this.$like = this.$container.find('.work__like');
	this.loading = false;
	this.work = {};

	(function constructor(){
		try
		{
			// check container
			if (!(self.$container && self.$container.length))
			{
				throw 'Not found container';
			}

			// init filtering elements in body
			if (self.$body && self.$body.length)
			{
				filteringElementsInBody();
			}

			// init like event
			if (self.$like && self.$like.length)
			{
				self.$like.children('button').on('click', function() {
					const $self = $(this);
					if ($self.hasClass('on')) return false;
					self.onLike(parseInt(this.dataset.srl))
						.then(function(cnt) {
							$self.addClass('on');
							$self.children('em').text(cnt);
						})
						.catch(alert);
				});
			}

			// show page
			self.$container.removeClass('work--hide');
		}
		catch(e)
		{
			if (self.app.options.debug)
			{
				console.error(e);
			}
		}
	})();

	/**
	 * filtering elements in body
	 * 우선 이미지 태그들을 찾아서 태그로 한번 씌우는 작업을 한다.
	 */
	function filteringElementsInBody()
	{
		const $images = self.$body.find('img');
		$images.each(function() {
			$(this).wrap('<span class="image"></span>');
		});
	}

	/**
	 * on like
	 *
	 * @param {Number} srl
	 */
	this.onLike = function(srl)
	{
		return new Promise((resolve, reject) => {
			if (!srl) reject();
			api.get(`/articles/${srl}/update`, { type: 'star' })
				.then((res) => {
					if (!res.success) reject('Failed update like');
					util.setCookie(`redgoose-like-${srl}`, '1', 10, this.app.options.urlCookie);
					resolve(res.data.star);
				})
				.catch((e) => {
					reject(typeof e === 'string' ? e : 'Service error');
				});
		});
	}

}