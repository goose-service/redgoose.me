import * as util from './util';

/** @property {Redgoose} app */
let app = null;

export const init = function(_app)
{
	app = _app;

	// TODO: 필요하다면 사용하기
	// $(document).ajaxStart(function() {
	// 	console.warn('ajax start');
	// });
	// $(document).ajaxComplete(function() {
	// 	console.warn('ajax complete');
	// });
};

export const get = async function(url, params)
{
	try
	{
		url = (/^http/.test(url)) ? url : app.options.urlApi + url;
		return await $.ajax({
			url: url + util.serialize(params, true),
			type: 'get',
			headers: { 'Authorization': app.options.token },
		});
	}
	catch(e)
	{
		return null;
	}
};