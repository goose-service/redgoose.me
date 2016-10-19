<?php


/**
 * Check cookie key
 *
 * @param string $keyName
 * @param int $day
 * @return bool
 */
function isCookieKey($keyName='', $day=1)
{
	if (!isset($_COOKIE[$keyName]))
	{
		// set cookie
		setcookie(
			$keyName,
			1,
			time() + 3600 * 24 * $day,
			(defined("__COOKIE_ROOT__")) ? __COOKIE_ROOT__ : '/'
		);
		return true;
	}
	else
	{
		return false;
	}
}