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
		setcookie('hit-'.$article['srl'], 1, time()+3600*24);
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

// cut string
/**
 * Cutting string
 * 글자를 특정자수만큼 잘라준다.
 * 
 * @Param {String} $str : 자를문자
 * @Param {Number} $len : 길이
 * @Param {String} $tail : 꼬리에 붙는 문자
 * @Return {String} : 잘려서 나온문자
 */
function bear3StrCut($str, $len, $tail="...")
{ 
	$rtn = array(); 
	return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str; 
}
?>