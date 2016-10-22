<?php


/**
 * Check cookie key
 *
 * @param string $keyName
 * @return bool
 */
function isCookieKey($keyName='')
{
	return isset($_COOKIE[$keyName]) ? true : false;
}


/**
 * set cookie key
 *
 * @param string $keyName
 * @param int $day
 */
function setCookieKey($keyName='', $day=1)
{
	setcookie(
		$keyName,
		1,
		time() + 3600 * 24 * $day,
		__COOKIE_ROOT__
	);
}