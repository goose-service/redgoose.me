<?php
if(!defined("__GOOSE__")){exit();}


/**
 * Parameters guide
 *
 * nest : 둥지 번호
 * category : 분류 번호
 * article : 포스트 번호
 * page : 페이지 번호
 * action : 가져올 컨텐츠 타입 (index,article)
 * render : 데이터를 출력하는 형식 (text,html)
 */

$countPerPage = 5;


/**
 * @var array $_params
 * @var API $api
 * @var object $pref
 */
$data = $api->index([
	'app_srl' => __APP_SRL__,
	'nest_id' => $_GET['nest'],
	'category_srl' => $_GET['category'] ? (int)$_GET['category'] : null,
	'field' => '*',
	'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
	'print_data' => 'article',
	'root' => __ROOT__,
	'count' => $countPerPage ? $countPerPage : __DEFAULT_ITEM_COUNT__,
]);


// init parsedown
require_once(__GOOSE_PWD__ . 'vendor/Parsedown/Parsedown.class.php');
$Parsedown = new Parsedown();


// edit articles
foreach($data['articles'] as $k=>$o)
{
	if ($o['json']['mode'] === 'markdown')
	{
		$data['articles'][$k]['content'] = $Parsedown->text($o['content']);
	}
	$data['articles'][$k]['date'] = date("D, d M Y H:i:s O", strtotime($o['regdate_original']));
}


///////////////////////////////////////////////////////////////////////////////


// set header
//header('Content-Type: application/rss+xml; charset=utf-8');
header('Content-Type: application/xml; charset=utf-8');


// render page
$blade->render('rss', [
	'pref' => $pref,
	'articles' => $data['articles'],
]);