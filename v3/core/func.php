<?php
if(!defined("__GOOSE__")){exit();}


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


/**
 * Cutting string
 * 글자를 특정자수만큼 잘라준다.
 *
 * @param string $str 자를문자
 * @param number $len 길이
 * @param string $tail 꼬리에 붙는 문자
 * @return string 잘려서 나온문자
 */
function bear3StrCut($str, $len, $tail="...")
{
	$rtn = array();
	return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str;
}


/**
 * content to short text
 *
 * @param string $con
 * @param int $len
 * @return string
 */
function contentToShortText($con, $len=120)
{
	if (!$con) return null;

	$con = trim( strip_tags($con) );
	$con = preg_replace('/\r\n|\r|\n|\t/', ' ', $con);
	$con = preg_replace('/"/', '\"', $con);
	$con = preg_replace("/'/", "\'", $con);
	$con = preg_replace("/&nbsp;/"," ", $con);
	$con = bear3StrCut($con, $len);

	return $con;
}