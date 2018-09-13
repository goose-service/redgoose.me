import Work from '../Work';

export default function IndexWork(app, index)
{
	if (!(app && index)) return;

	const self = this;
	this.$popup = null;
	this.indexHistory = null;

	/**
	 * make element for popup
	 *
	 * @return {Array}
	 */
	function popupElement()
	{
		let dom = (`<div class="popup">
			<div class="popup__body"></div>
			<div class="loading popup__loading">
				<div class="loading__loader">
					<div class="loading__shadow"></div>
					<div class="loading__box"></div>
				</div>
			</div>
			<nav class="popup__close">
				<button type="button" title="close">
					<div>
						<img src="${app.options.urlRoot}/assets/images/ico-close.svg" class="pc" alt="close"/>
						<img src="${app.options.urlRoot}/assets/images/ico-close2.svg" class="mobile" alt="close"/>
					</div>
				</button>
			</nav>
		</div>`);
		let $dom = $(dom);

		// init close event
		$dom.children('.popup__close').on('click', () => self.close(true));

		return $dom;
	}

	/**
	 * keyboard event
	 *
	 * @param {Boolean} sw
	 */
	function keyboard(sw)
	{
		const $window = $(window);
		const keymap = {
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
				case keymap.cmd:
				case keymap.ctrl:
					ready = true;
					break;
				case keymap.left:
					if (ready) self.prev();
					break;
				case keymap.right:
					if (ready) self.next();
					break;
				case keymap.esc:
					if (app.mode === 'work') self.close(true).then();
					break;
			}
		}

		function onKeyDown(e)
		{
			switch (e.keyCode)
			{
				case keymap.left:
				case keymap.right:
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
	 * open
	 *
	 * @param {int} srl
	 * @param {String} alt
	 * @param {Boolean} history
	 * @return {Promise}
	 */
	this.open = async function(srl, alt, history=false)
	{
		if (!(srl && alt))
		{
			alert('Not found work number or title');
			return;
		}

		try
		{
			// save scroll top
			index.scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			// push history
			self.indexHistory = {
				env: app.history.env,
				title: app.history.title,
				url: app.history.url
			};
			if (history)
			{
				// save index history
				let url = `${app.options.urlRoot}/article/${srl}`;
				let title = `${alt} - ${app.options.title}`;
				app.history.push(
					{ url, title, srl, action: 'open-work' },
					title,
					url
				);
			}

			// off events in index
			index.toggleEvents(false);

			// change popup mode for html tag
			$('html').addClass('mode-popup');

			// make element and append
			self.$popup = popupElement();
			$('body').append(self.$popup);

			// 빠르게 로딩심볼이 나오면 잔상이 남기 때문에 약간 늦춰서 보이도록 타임아웃을 검
			let timer = setTimeout(function() {
				if (self.$popup) self.$popup.children('.popup__loading').addClass('show');
			}, 200);

			// get work data
			let work = await $.get(`/article/${srl}?mode=popup`);

			// 로딩 타이머 끝나기전에 데이터를 불러왔으면 타임아웃을 클리어한다.
			clearTimeout(timer);

			// off loading
			self.$popup.children('.popup__loading').remove();

			// append work element
			self.$popup.children('.popup__body').append(work);

			// init work mode
			app.mode = 'work';
			app.work = new Work(app);

			// start keyboard event
			keyboard(true);
		}
		catch(e)
		{
			if (app.options.debug) console.error(e);

			// alert message
			alert('Failed open work.');

			// close window
			self.close(true).then();
		}
	};

	/**
	 * close
	 *
	 * @param {Boolean} history
	 * @return {Promise}
	 */
	this.close = async function(history=false)
	{
		try
		{
			if (!(self.$popup && self.$popup.length))
			{
				throw 'Failed to close window.';
			}

			// push history
			if (history)
			{
				app.history.push(
					self.indexHistory.env,
					self.indexHistory.title,
					self.indexHistory.url
				);
			}
			self.indexHistory = null;

			// stop keyboard event
			keyboard(false);

			// change mode and unset work
			app.mode = 'index';
			app.work = null;

			// remove popup element
			self.$popup.remove();
			self.$popup = null;

			// change popup mode for html tag
			$('html').removeClass('mode-popup');

			// on events in index
			index.toggleEvents(true);

			// restore scrollY
			window.scrollTo(0, index.scrollTop);
		}
		catch(e)
		{
			if (app.options.debug)
			{
				console.error(e);
			}
			if (e && typeof e === 'string')
			{
				alert(e);
			}
		}
	};

}