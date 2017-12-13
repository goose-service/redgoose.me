import $ from 'jQuery';
import AppHistory from './AppHistory';

import * as util from './util';


export default function Article(parent)
{
	const self = this;

	/**
	 * PUBLIC VARIABLES
	 */

	this.popup = 'popupArticle';
	this.$popup = $(`#${this.popup}`);


	/**
	 * FUNCTIONS
	 */

	/**
	 * open
	 *
	 * @param {Number} srl
	 * @param {String} url
	 * @return {Promise}
	 */
	async function open(srl, url)
	{
		console.log('open article', srl, url);
		let res = await getArticleData(srl);
		console.log('response', res);
		// TODO: ajax 콜해서 데이터 가져오기
		// TODO: 팝업 엘리먼트로 dom 집어넣기
		// TODO: 본문 article 표시하기 (애니메이션)
		// TODO: url 푸쉬
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
	 * get article data
	 *
	 * @param {Number} srl
	 * @return {Promise}
	 */
	async function getArticleData(srl)
	{
		try
		{
			// TODO: 여기서부터 작업
			return await $.ajax({
				url: `${parent.options.root}/ajax/article/`,
				type: 'post',
				data: {
					article: srl,
					field: '*',
				},
				dataType: 'json',
			});
		}
		catch(e)
		{
			alert('Server error');
			console.error(e);
			return false;
		}
	}


	/**
	 * METHODS
	 */

	/**
	 * open article
	 *
	 * @param {Number} srl
	 * @param {String} url
	 */
	this.open = function(srl, url)
	{
		open(srl, url).then();
	};

	/**
	 * close article
	 *
	 */
	this.close = function()
	{
		close().then();
	}

}