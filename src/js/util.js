
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