/**
 * check touch device
 *
 * @return {Boolean}
 */
export const isTouchDevice = function()
{
	try
	{
		document.createEvent('TouchEvent');
		return true;
	}
	catch (e)
	{
		return false;
	}
};

/**
 * sleep
 *
 * @param {Number} delay
 * @param params
 * @param {Number} timer
 * @return {Promise}
 */
export function sleep(delay=1000, params=null, timer=null)
{
	return new Promise(function(resolve){
		if (timer)
		{
			clearTimeout(timer);
			timer = setTimeout(() => { resolve(params, timer); }, delay);
		}
		else
		{
			setTimeout(() => { resolve(params, this); }, delay);
		}
	});
}

/**
 * serialize
 * object to parameter
 *
 * @param {Object} obj
 * @param {Boolean} usePrefix
 * @return {String}
 */
export function serialize(obj, usePrefix=false)
{
	let str = [];
	let res = '';
	for (let p in obj)
	{
		if (obj.hasOwnProperty(p))
		{
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	}
	res = str.join('&');
	return (res && usePrefix) ? `?${res}` : res;
}