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


/**
 * get global navigation button active
 *
 * @param array $nav
 * @param string $name
 * @return string
 */
function getGnbActive($nav, $name)
{
	if (!($nav && count($nav))) return null;

	foreach($nav as $k=>$v)
	{
		if ($v->child)
		{
			if ($v->id === $name or $v->name === $name)
			{
				if ($v->id) return $v->id;
				else if ($v->name) return $v->name;
			}
			foreach($v->child as $kk=>$vv)
			{
				if ($vv->id === $name or $vv->name === $name)
				{
					if ($v->id) return $v->id;
					else if ($v->name) return $v->name;
				}
			}
		}
	}
}


/**
 * get param value
 *
 * @param string $key
 * @return string|int
 */
function getParam($key)
{
	if (isset($_POST[$key]))
	{
		return $_POST[$key];
	}
	else if (isset($_GET[$key]))
	{
		return $_GET[$key];
	}
	else
	{
		return null;
	}
}


function externalApi($url, $params=null, $method='get')
{
	try
	{
		$params = $params ? '?'.http_build_query($params) : '';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, __GOOSE_ROOT__.$url.$params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, ($method === 'post'));
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: ' . __TOKEN_PUBLIC__]);
		$response = curl_exec($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if (!$response)
		{
			throw new Exception('no response');
		}

		$response = json_decode($response);
		if (!$response->success) throw new Exception($response->message);
		return $response->data;
	}
	catch(Exception $e)
	{
		return null;
	}
}