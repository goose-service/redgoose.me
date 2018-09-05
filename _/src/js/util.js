
/**
 * Get window size
 *
 * @return {Object}
 */
export function getWindowSize()
{
	return {
		width: window.innerWidth,
		height: window.innerHeight
	};
}


/**
 * is touch device
 *
 * @return {Boolean}
 */
export function isTouchDevice()
{
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}


/**
 * sleep
 *
 * @param {Number} delay
 * @return {Promise}
 */
export function sleep(delay)
{
	return new Promise(function(resolve) {
		if (window.timer) clearTimeout(window.timer);
		window.timer = setTimeout(resolve, delay);
	});
}


/**
 * printf
 *
 * @param {String} str
 * @param {String} values
 */
export function printf(str, ...values)
{
	for (let i = 0; i < values.length; i++)
	{
		let pattern = `\\{${i}\\}`;
		let replace = new RegExp(pattern, 'g');
		str = str.replace(replace, values[i]);
	}
	return str;
}