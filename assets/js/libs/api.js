import * as util from './util';

/** @property {Redgoose} app */
let app = null;

export const init = function(_app)
{
	app = _app;

	$.ajaxSetup({
		beforeSend: function(xhr)
		{
			this.url = app.options.urlApi + this.url;
			xhr.setRequestHeader('Authorization', app.options.token);
		}
	});

	$(document).ajaxStart(function() {
		console.warn('ajax start');
	});

	$(document).ajaxComplete(function() {
		console.warn('ajax complete');
	});
};

export const get = async function(url, params)
{
	try
	{
		// merge params
		params = {
			...{
				size: parseInt(app.options.size) || 10
			},
			...params,
		};

		return await $.ajax({
			url: url + util.serialize(params, true),
			type: 'get',
		});
	}
	catch(e)
	{
		return null;
	}
};