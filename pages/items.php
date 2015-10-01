<?php
if(!defined("__GOOSE__")){exit();}

$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['REQUEST_METHOD'] == 'GET');

if ($ajax)
{
	header("Content-Type: application/json; charset=utf-8");
}
else
{
	header('Content-type: text/html; charset=utf-8');
}

// set variable
$_GET['page'] = ($_GET['page'] > 1) ? (int)$_GET['page'] : 1;
$nest = null;
$categoryCount = 0;
$result = array();


// load class file
require_once(__GOOSE_PWD__.'/core/classes/Paginate.class.php');


// get redgoose.user plugin vars 수정필요
$thumnailSizeArray = array('230*230', '470*230', '230*470', '470*470');


// nest check and get nest data
if ($_nest)
{
	$nest = Spawn::item(array(
		'table' => Spawn::getTableName('nest'),
		'where' => "id='$_nest'"
	));

	$categoryCount = Spawn::count(array(
		'table' => Spawn::getTableName('category'),
		'where' => 'nest_srl='.$nest['srl']
	));
}


// search parameter
$itemParameter = ($nest) ? 'nest_srl='.$nest['srl'] : 'app_srl='.$app_srl;
$itemParameter .= ($nest && $_category) ? ' and category_srl='.$_category : '';


// get item count
$itemCount = Spawn::count(array(
	'table' => Spawn::getTableName('article'),
	'where' => $itemParameter
));


// get item data
if ($itemCount > 0)
{
	$pagePerItemCount = ($nest && $nest['listCount']) ? $nest['listCount'] : $defaultItemCount;
	$paramArray = array();
	$paginate = new Paginate($itemCount, $_GET['page'], $paramArray, $pagePerItemCount, 10);
	$no = $paginate->no;
	$items = Spawn::items(array(
		'table' => Spawn::getTableName('article'),
		'where' => $itemParameter,
		'order' => 'srl',
		'sort' => 'desc',
		'limit' => array($paginate->offset, $paginate->size)
	));
}

// save item datas
if (count($items) > 0)
{
	$defaultThumnailSize = explode('*', $thumnailSizeArray[0]);

	foreach ($items as $k=>$v)
	{
		$w = $h = null;
		$v['json'] = ($v['json']) ? json_decode(urldecode($v['json']), true) : array();

		if ($v['json']['thumnail']['size'])
		{
			$v['json']['thumnail']['size'] = explode('*', $v['json']['thumnail']['size']);
			$w = $v['json']['thumnail']['size'][0];
			$h = $v['json']['thumnail']['size'][1];
		}

		$item = array(
			'url' => convertUrl(array('mod'=>$_nest, 'cat'=>$_category, 'doc'=>$v['srl'], 'page'=>$_GET['page']))
			,'date' => Util::convertDate($v['regdate'])
			,'img' => ($v['json']['thumnail']['url']) ? __GOOSE_ROOT__.'/'.$v['json']['thumnail']['url'] : null
			,'title' => $v['title']
			,'width' => ($w) ? $w : $defaultThumnailSize[0]
			,'height' => ($h) ? $h : $defaultThumnailSize[1]
		);

		array_push($result, $item);
	}

	if ($paginate->page < $paginate->page_max)
	{
		array_push($result, array(
			'more' => true
		));
	}
}


$result = json_encode($result);
echo $result;
?>