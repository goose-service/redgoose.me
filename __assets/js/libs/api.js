import * as util from './util';

/** @property {Redgoose} app */
let app = null;

export const init = function(_app)
{
	app = _app;

	// $(document).ajaxStart(function() {
	// 	console.warn('ajax start');
	// });
	// $(document).ajaxComplete(function() {
	// 	console.warn('ajax complete');
	// });
};

export const get = function(url, params)
{
	return new Promise((resolve, reject) => {
		url = (/^http/.test(url)) ? url : app.options.urlApi + url;
		$.ajax({
			url: url + util.serialize(params, true),
			type: 'get',
			headers: {
				'Authorization': app.options.token
			},
		})
			.then(resolve)
			.catch(() => resolve(null));
	});
};