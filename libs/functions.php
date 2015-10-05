<?php
if(!defined("__GOOSE__")){exit();}

// convert string list url
function convertUrl($args=null)
{
	if ($args)
	{
		$str = __ROOT__.'/';
		if ($args['mod'])
		{
			$str .= ($args['mod'] && !$args['doc']) ? 'nest/' : '';
			$str .= ($args['doc']) ? 'article/' : '';
			$str .= ($args['mod']) ? $args['mod'].'/' : '';
			$str .= ($args['cat']) ? $args['cat'].'/' : '';
			$str .= ($args['doc']) ? $args['doc'].'/' : '';
		}
		else if ($args['doc'])
		{
			$str .= 'article/'.$args['doc'].'/';
		}
		$str .= ($args['page'] > 1) ? '?page='.$args['page'] : '';
		return $str;
	}
	else
	{
		return '#';
	}
}


/**
 * hit update
 * 조회수 올리기
 * 
 * @Param {Number} $srl : article_srl
 * @Return void
 */
function hitUpdate($srl)
{
	// 내부 아이피라면 조회수를 올리지 않는다.
	if (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']))
	{
		return false;
	}

	// get article data
	$article = Spawn::item(array(
		'table' => Spawn::getTableName('article')
		,'field' => 'srl,hit'
		,'where' => 'srl='.$srl
	));

	// check article data
	if (!count($article))
	{
		return false;
	}

	if (!isset($_COOKIE['hit-'.$article['srl']]))
	{
		// set cookie
		setcookie('hit-'.$article['srl'], 1, time()+3600*24, __COOKIE_ROOT__);
		// update db
		$article['hit'] += 1;
		$result = Spawn::update(array(
			'table' => Spawn::getTableName('article')
			,'where' => 'srl='.$article['srl']
			,'data' => array(
				'hit='.$article['hit']
			)
		));
	}
}


/**
 * Update like
 * 좋아요 숫자를 갱신한다.
 *
 * @param number $srl article srl값
 * @return array 결과값
 */
function updateLike($srl)
{
	// 내부 아이피라면 숫자를 올리지 않는다.
	if (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']))
	{
		//echo Util::arrayToJson(['state' => 'error'], false);
		//Goose::end(false);
	}

	// check cookie
	if (isset($_COOKIE['like-'.$srl]))
	{
		echo Util::arrayToJson(['state' => 'error'], false);
		Goose::end(false);
	}

	// get article data
	$article = Spawn::item([
		'table' => Spawn::getTableName('article'),
		'field' => 'srl,json',
		'where' => 'srl='.$srl
	]);

	if (isset($article['json']))
	{
		$article['json'] = Util::jsonToArray($article['json'], null, true);
		if (isset($article['json']['like']))
		{
			$article['json']['like'] += 1;
		}
		else
		{
			$article['json']['like'] = 1;
		}
	}
	else
	{
		$article['json'] = [ 'like' => 1 ];
	}

	$stringJson = Util::arrayToJson($article['json'], true);
	$result = Spawn::update([
		'table' => Spawn::getTableName('article'),
		'where' => 'srl='.$article['srl'],
		'data' => [
			'json="'.$stringJson.'"'
		]
	]);

	if ($result == 'success')
	{
		// set cookie
		setcookie('like-'.$srl, 1, time()+3600*24*365, __COOKIE_ROOT__);

		echo Util::arrayToJson([
			'state' => 'success',
			'count' => $article['json']['like']
		], false);
		Goose::end(false);
	}
	else
	{
		echo Util::arrayToJson(['state' => 'error'], false);
		Goose::end(false);
	}
}


/**
 * Cutting string
 * 글자를 특정자수만큼 잘라준다.
 *
 * @param {string} $str 자를문자
 * @param {number} $len 길이
 * @param {string} $tail 꼬리에 붙는 문자
 * @return string 잘려서 나온문자
 */
function bear3StrCut($str, $len, $tail="...")
{
	$rtn = array(); 
	return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str; 
}
