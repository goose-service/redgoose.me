import Loading from '../Util/Loading';
import CSS3 from '../Util/CSS3';
import AppHistory from '../Util/AppHistory';
import changeTitle from '../Util/ChangeTitle';

const loading = new Loading();
const appHistory = new AppHistory();

const KEYCODE_ESC = 27;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;

/**
 * keyboard event
 *
 * @Param {Boolean} evt
 * @Return {Object}
 */
const keyboardEvent = (evt) => {
	if (evt)
	{
		let defer = $.Deferred();

		$(window).on('keydown.redgoose', (e) => {
			defer.notify(e.keyCode);
		});

		return defer.promise();
	}
	else
	{
		$(window).off('keydown.redgoose');
		return null;
	}
};


/**
 * View
 */
function View(index) {

	this.$el = {
		popup : $('#popupView'),
		article : null
	};

	/**
	 * init page
	 *
	 * @Param {Object} $article
	 */
	this.initPage = ($article) => {
		this.$el.article = $article;

		this.keyEvent = keyboardEvent(true);

		this.initView();

		// keyboard event
		this.keyEvent.progress((code) => {
			if (code === KEYCODE_LEFT)
			{
				if (this.$el.article.find('.direction.prev').length)
				{
					location.href = this.$el.article.find('.direction.prev').attr('href');
				}
			}
			if (code === KEYCODE_RIGHT)
			{
				if (this.$el.article.find('.direction.next').length)
				{
					location.href = this.$el.article.find('.direction.next').attr('href');
				}
			}
		});
	};

	/**
	 * open view in popup
	 *
	 * @Param {String} url
	 * @Param {Boolean} isHistory
	 */
	this.open = (url, isHistory) => {

		// save is view popup
		window.redgooseState.isViewPopup = true;

		// save scroll top
		window.redgooseState.indexScrollTop = $(window).scrollTop();

		// save index url
		window.redgooseState.indexUrl = location.pathname + location.search;

		// save index title
		window.redgooseState.indexTitle = $('title').text();

		// on loading
		loading.on();

		// load page
		this.$el.popup.load(url + '?popup=1', () => {
			// update history
			if (!isHistory)
			{
				appHistory.push({ url: url, type: 'article' }, null, url);
			}

			this.$el.popup.addClass('ready');
			setTimeout(() => {
				this.$el.popup.addClass('show').scrollTop(0);
				CSS3.transitionEnd(this.$el.popup, () => {
					$('html').addClass('popup-mode');
					$(window).scrollTop(0);
					this.$el.popup.addClass('active');
					loading.off();
				});
			}, 20);

			this.keyEvent = keyboardEvent(true);
			this.initPopup();
			this.initView();

			// change title
			this.changeTitle();
		});
	};

	/**
	 * close view in popup
	 *
	 * @Param {Boolean} isHistory
	 */
	this.close = (isHistory) => {
		let scrollY = $(window).scrollTop();

		// save is view popup
		window.redgooseState.isViewPopup = false;

		CSS3.transitionEnd(this.$el.popup, () => {
			this.$el.popup.removeClass('ready').html('');
			$(window).scrollTop(window.redgooseState.indexScrollTop);
		});

		this.$el.popup.removeClass('show active').scrollTop(scrollY);
		$('html').removeClass('popup-mode');

		if (index) index.masonry.layout();

		// disable keyboard event
		this.keyEvent = keyboardEvent(false);

		// update history
		if (!isHistory)
		{
			appHistory.push(null, null, window.redgooseState.indexUrl);
			window.redgooseState.indexUrl = null;
		}

		// change title
		changeTitle(window.redgooseState.indexTitle);
	};

	/**
	 * view init
	 */
	this.initView = () => {
		// on like event
		this.$el.article.find('a.on-like').on('click', (e) => {
			let $el = $(e.currentTarget);
			$.post($el.attr('href'), (res) => {
				$el.replaceWith('<span class="on-like" title="on like">' +
				`<img src="${window.redgooseState.root}/assets/img/ico-heart-on.svg" alt="">` +
				`<em>${res.data.like}</em>` +
				'</span>');
			}, 'json');
			return false;
		});

	};

	/**
	 * init popup
	 */
	this.initPopup = () => {
		// set article element
		this.$el.article = this.$el.popup.children();

		// close popup
		this.$el.article.find('[data-action=close]').on('click', () => {
			this.close();
		});

		// keyboard event
		this.keyEvent.progress((code) => {
			if (code === KEYCODE_ESC)
			{
				this.close();
			}
			if (code === KEYCODE_LEFT)
			{
				if (this.$el.article.find('.direction.prev').length)
				{
					this.go(this.$el.article.find('.direction.prev').attr('href'));
				}
			}
			if (code === KEYCODE_RIGHT)
			{
				if (this.$el.article.find('.direction.next').length)
				{
					this.go(this.$el.article.find('.direction.next').attr('href'));
				}
			}
		});

		// direction button event
		this.$el.article.find('.direction').on('click', (e) => {
			this.go($(e.currentTarget).attr('href'));
			return false;
		});
	};

	/**
	 * go another article
	 *
	 * @Param {String} url
	 * @Param {Boolean} isHistory
	 */
	this.go = (url, isHistory) => {

		loading.on();

		this.keyEvent = keyboardEvent(false);
		this.$el.popup.html('');

		// load page
		this.$el.popup.load(url + '?popup=1', () => {
			// update history
			if (!isHistory)
			{
				appHistory.push({ url: url, type: 'article' }, null, url);
			}

			loading.off();

			this.keyEvent = keyboardEvent(true);
			this.initPopup();
			this.initView();

			// change title
			this.changeTitle();
		});

	};

	this.changeTitle = (title) => {
		if (this.$el.article.find('> header > h1').length)
		{
			changeTitle('Redgoose / ' + this.$el.article.find('> header > h1').text());
		}
		else
		{
			changeTitle('Redgoose');
		}
	}
}

export default View;