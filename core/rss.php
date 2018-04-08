<?php
if(!defined("__GOOSE__")){exit();}


$countPerPage = 15;


/**
 * @var array $_params
 * @var API $api
 * @var object $pref
 */
$data = $api->index((object)[
	'app_srl' => __APP_SRL__,
	'page' => 1,
	'print_data' => 'article',
	'size' => $countPerPage ? $countPerPage : __DEFAULT_ITEM_COUNT__,
]);


// init parsedown
require_once(__GOOSE_PWD__ . 'vendor/parsedown/Parsedown.php');
$Parsedown = new Parsedown();


// edit articles
foreach($data->articles as $k=>$o)
{
	if ($o['json']['mode'] === 'markdown')
	{
		$data->articles[$k]['content'] = $Parsedown->text($o['content']);
	}

	if (isset($data->articles[$k]['json']['thumbnail']['srl']))
	{
		$file = core\Spawn::item([
			'table' => core\Spawn::getTableName('File'),
			'where' => 'srl=' . (int)$data->articles[$k]['json']['thumbnail']['srl']
		]);

		$data->articles[$k]['content'] = (
			'<img src="' . __GOOSE_URL__ . '/' . $file['loc'] . '" alt="' . $file['name'] . '" style="display:block;margin:0 auto;">'.
			'<p>'.
			mb_substr(strip_tags(preg_replace('~>\\s+<~m', '><', $data->articles[$k]['content'])), 0, 150, 'utf-8').
			'...</p>'
		);
	}
	else
	{
		$data->articles[$k]['content'] = (
			'<p>'.
			mb_substr(strip_tags(preg_replace('~>\\s+<~m', '><', $data->articles[$k]['content'])), 0, 150, 'utf-8').
			'...</p>'
		);
	}

	$data->articles[$k]['date'] = date("D, d M Y H:i:s O", strtotime($o['regdate_original']));
}


///////////////////////////////////////////////////////////////////////////////


// set header
header('Content-Type: application/rss+xml; charset=utf-8');
//header('Content-Type: application/xml; charset=utf-8');


// render page
$blade->render('rss', [
	'pref' => $pref,
	'articles' => $data->articles,
]);