import $ from 'jQuery';
import AppHistory from './AppHistory';

import * as util from './util';


export default function Article(parent)
{
	const self = this;
	const $html = $('html');

	/**
	 * PUBLIC VARIABLES
	 */
	this.backupIndexScrollTop = 0;


	/**
	 * FUNCTIONS
	 */

	/**
	 * open
	 *
	 * @param {Number} srl
	 * @return {Promise}
	 */
	async function open(srl)
	{
		const url = `${parent.options.root}/article/${srl}/`;

		// load article page
		parent.$popup.load(`${url}?mode=popup`, (el) => {
			let $el = $(el);
			let title = $el.find('.article__header > h1').text();
			title = !!title ? `${parent.options.title} / ${title}` : parent.options.title;

			// push history
			console.log(url);
			parent.history.push({ url: url, type: 'article' }, title, url);
		});

		// save scroll position
		self.backupIndexScrollTop = $html.scrollTop();

		// interaction
		parent.$popup.addClass('popupArticle-ready');
		await util.sleep(10);
		parent.$popup.addClass('popupArticle-show');
		await util.sleep(300);
		parent.$popup.removeClass('popupArticle-ready');
		window.scrollTo(0, 0);
		parent.$app.addClass('disabled');
	}

	/**
	 * close
	 *
	 * @return {Promise}
	 */
	async function close()
	{
		console.log('close article')
	}


	/**
	 * METHODS
	 */

	/**
	 * open article
	 *
	 * @param {Number} srl
	 */
	this.open = async function(srl)
	{
		await open(srl);
	};

	/**
	 * close article
	 *
	 */
	this.close = async function()
	{
		close().then();
	};

	this.go = function(srl)
	{

	};

}