import $ from 'jQuery';
import AppHistory from './AppHistory';

import * as util from './util';


const transitionDelay = 300;


export default function Article(parent)
{
	const self = this;
	const $html = $('html');

	/**
	 * PUBLIC VARIABLES
	 */

	this.backupIndexScrollTop = 0;
	this.$close = null;
	this.$prev = null;
	this.$next = null;
	this.$like = null;
	this.$body = null;
	this.srl = null;


	/**
	 * FUNCTIONS
	 */

	/**
	 * open
	 *
	 * @param {Number} srl
	 * @param {Boolean} useHistory
	 * @return {Promise}
	 */
	async function open(srl, useHistory=false)
	{
		if (!srl)
		{
			alert('Not found srl');
			return null;
		}

		// check mode
		if (parent.mode !== 'index')
		{
			alert(`It is not currently in 'index' mode.`);
			return null;
		}

		// check popup element
		if (!(parent.$popup && parent.$popup.length))
		{
			if (parent.options.dev)
			{
				console.error('not found popup element');
			}
			return null;
		}

		// change mode
		parent.mode = 'article';

		// save scroll position
		self.backupIndexScrollTop = $(window).scrollTop();

		// interaction
		parent.$popup.addClass('popupArticle-show');
		parent.$app.addClass('disabled');
		window.scrollTo(0, 0);

		// go to article
		await go(srl, useHistory, 'push');

		// initial keyboard event
		keyboard(true);
	}

	/**
	 * close
	 *
	 * @param {Boolean} useHistory
	 * @return {Promise}
	 */
	async function close(useHistory=false)
	{
		// check mode
		if (parent.mode !== 'article')
		{
			alert(`It is not currently in 'article' mode.`);
			return;
		}

		// change mode
		parent.mode = 'index';

		if (useHistory)
		{
			window.history.back();
		}

		// set srl
		self.srl = null;

		// 팝업으로 띄어져 있는 상태라면..
		if (parent.$popup && parent.$popup.length)
		{
			parent.$app.removeClass('disabled').addClass('hidden');
			parent.$popup.removeClass('popupArticle-show').empty();
			parent.index.restoreIndexEvent();

			await util.sleep(10);

			// 팝업이 열려있는 상태에서 윈도우 사이즈를 변경하고 닫으면 레이아웃이 깨지기 때문에 `layout()`메서드를 실행하여 다시 잡아줘야함.
			if (parent.index)
			{
				parent.index.masonry.layout();
			}

			await util.sleep(10);

			$('html,body').scrollTop(self.backupIndexScrollTop);
			self.backupIndexScrollTop = 0;

			// 화면처리하느라 안보이게 했던 화면 보이게 하기
			parent.$app.removeClass('hidden');

			// destroy keyboard event
			keyboard(false);
		}

		// change title
		if (parent.index && parent.index.options)
		{
			document.title = parent.index.options.title;
		}
	}

	/**
	 * go to article
	 *
	 * @param {Number} srl
	 * @param {Boolean} useHistory
	 * @param {String} historyMethod `push|replace`
	 * @return {Promise}
	 */
	function go(srl, useHistory=false, historyMethod='push')
	{
		return new Promise(function(resolve) {
			const url = `${parent.options.root}/article/${srl}/`;

			if (!parent.$popup) return;

			// on loading
			loading(true);

			// set srl
			self.srl = srl;

			// clear contents
			parent.$popup.empty();

			// load article page
			parent.$popup.load(`${url}?mode=popup`, (el) => {
				let $el = $(el);
				console.log($el, $el.hasClass('.article'));
				let title = $el.find('.article__header > h1').text();
				title = !!title ? `${parent.options.title} / ${title}` : parent.options.title;

				// setting elements in article
				self.$body = $('#article');
				self.$close = $('#closeArticle');
				self.$prev = $('#goToPrevArticle');
				self.$next = $('#goToNextArticle');
				self.$like = $('#toggleLike');

				// initial event in article
				initCloseEvent();
				initLikeEvent();
				initMoveArticleEvent();

				// push history
				if (useHistory)
				{
					if (parent.options.dev) console.warn('change url:', url, historyMethod);
					parent.history[historyMethod || 'push']({ url, srl, type: 'article' }, title, url);
				}

				// off loading
				loading(false);

				// exit
				resolve();
			});
		});
	}

	/**
	 * initial close event
	 */
	function initCloseEvent(sw=true)
	{
		if (sw)
		{
			self.$close.on('click', () => close(true));
		}
		else
		{
			self.$close.off('click');
		}
	}

	/**
	 * initial move article event
	 */
	function initMoveArticleEvent(sw=true)
	{
		function action()
		{
			self.go(this.dataset.srl, true, 'replace');
			return false;
		}

		if (sw)
		{
			self.$prev.on('click', action);
			self.$next.on('click', action);
		}
		else
		{
			self.$prev.off('click');
			self.$next.off('click');
		}
	}

	/**
	 * initial like event
	 */
	function initLikeEvent()
	{
		async function send(srl)
		{
			if (!srl) return null;

			return await $.ajax({
				url: `${parent.options.root}/ajax/uplike/`,
				type: 'post',
				headers: { 'redgoose-action': 'uplike' },
				data: { srl },
				dataType: 'json',
			});
		}

		function onClickEvent()
		{
			const $em = self.$like.children('em');
			let srl = this.dataset.srl;
			let n = parseInt($em.text());

			// change button
			self.$like.addClass('onLike-on').off();
			$em.text(n + 1);

			// request
			send(srl).then(function(res) {
				switch(res.state)
				{
					case 'success':
						break;

					case 'error':
						$em.text(n);
						self.$like.removeClass('onLike-on').on('click', onClickEvent);
						console.error(res.message);
						break;
				}
			});
		}

		// set event
		if (!self.$like.hasClass('onLike-on'))
		{
			self.$like.off('click');
			self.$like.on('click', onClickEvent);
		}
	}

	/**
	 * loading
	 *
	 * @param {Boolean} sw
	 */
	function loading(sw=false)
	{
		if (sw)
		{
			let $el = $(`<div class="loading" id="loading"><div class="spinner"></div></div>`);
			$('body').append($el);
		}
		else
		{
			$('#loading').remove();
		}
	}

	/**
	 * keyboard event
	 *
	 * @param {Boolean} sw (`true`: initial event, `false`: destroy event)
	 */
	function keyboard(sw)
	{
		const $window = $(window);
		const keyMap = {
			left: 37,
			right: 39,
			esc: 27,
			cmd: 91,
			ctrl: 17,
		};
		let ready = true;


		function onKeyUp(e)
		{
			switch (e.keyCode)
			{
				case keyMap.cmd:
				case keyMap.ctrl:
					ready = true;
					break;
				case keyMap.left:
					if (ready) self.prev();
					break;
				case keyMap.right:
					if (ready) self.next();
					break;
				case keyMap.esc:
					if (parent.$popup)
					{
						self.close(true);
					}
					break;
			}
		}

		function onKeyDown(e)
		{
			switch (e.keyCode)
			{
				case keyMap.left:
				case keyMap.right:
					ready = true;
					break;
				default:
					ready = false;
					break;
			}
		}

		if (sw)
		{
			// initial event
			$window.off('keyup.redgoose keydown.redgoose');
			$window.on('keyup.redgoose', onKeyUp);
			$window.on('keydown.redgoose', onKeyDown);
		}
		else
		{
			$window.off('keyup.redgoose keydown.redgoose');
		}
	}


	/**
	 * METHODS
	 */

	/**
	 * open article
	 *
	 * @param {Number} srl
	 * @param {Boolean} useHistory
	 *
	 */
	this.open = async function(srl, useHistory=false)
	{
		await open(srl, useHistory);
	};

	/**
	 * close article
	 *
	 * @param {Boolean} useHistory
	 * @return {Promise}
	 */
	this.close = async function(useHistory)
	{
		await close(useHistory);
	};

	/**
	 * go to article
	 *
	 * @param {Number} srl
	 * @param {Boolean} useHistory
	 * @param {String} historyMethod
	 */
	this.go = function(srl, useHistory, historyMethod='push')
	{
		if (!srl)
		{
			alert(`not found 'srl'`);
			return;
		}

		// check srl and mode
		if (parent.mode === 'article' && parent.index && parent.$popup)
		{
			go(srl, useHistory, historyMethod).then();
		}
		else
		{
			window.location.href = `${parent.options.root}/article/${srl}/`;
		}
	};

	/**
	 * go to prev article
	 */
	this.prev = function()
	{
		try
		{
			if (!(self.$prev && self.$prev.length)) throw 'not found article';
			let srl = self.$prev.get(0).dataset.srl;
			if (!srl) throw 'not found article srl';
			this.go(srl, true, 'replace');
		}
		catch(e)
		{
			if (parent.options.dev) console.error(e);
			return false;
		}
	};

	/**
	 * go to next article
	 */
	this.next = function()
	{
		try
		{
			if (!(self.$next && self.$next.length)) throw 'not found article';
			let srl = self.$next.get(0).dataset.srl;
			if (!srl) throw 'not found article srl';
			this.go(srl, true, 'replace');
		}
		catch(e)
		{
			if (parent.options.dev) console.error(e);
			return false;
		}
	};

	/**
	 * init
	 * 단독 article페이지를 열었을때 사용되는 메서드
	 */
	this.init = function(options)
	{
		// check popup
		if (parent.$popup && parent.$popup.length)
		{
			if (parent.options.dev)
			{
				console.error('Not available in pop-up mode.');
			}
			return null;
		}

		// check srl
		if (!(options && options.srl))
		{
			console.error('Not found article srl');
			return null;
		}

		// remove index instance
		delete parent.index;
		delete parent.popup;
		delete parent.$popup;

		// set options
		this.srl = parseInt(options.srl);

		// set mode
		parent.mode = 'article';

		// setting elements in article
		this.$body = $('#article');
		this.$prev = $('#goToPrevArticle');
		this.$next = $('#goToNextArticle');
		this.$like = $('#toggleLike');

		// initial history pop state event
		parent.history.initPopEvent();

		// initial events;
		initLikeEvent();
		keyboard(true);
	};

}