<?php
if(!defined("__GOOSE__")){exit();}

/**
 * URL Guide
 *
 * {APP}/ajax/ - 모든 article을 불러옵니다.
 * {APP}/ajax/nest/{nest_id}/ - {nest_id} 값을가진 둥지의 데이터를 가져옵니다.
 * {APP}/ajax/nest/{nest_id}/{category_srl}/ - {nest_id}값과 {category_srl} 값을 가진 데이터를 가져옵니다.
 * {APP}/ajax/article/{article_srl}/ - {article_srl}값을 가진 article 데이터 하나를 가져옵니다.
 * {APP}/ajax/upLike/{article_srl}/ - {article_srl}값을 가진 article의 like 값을 1 올립니다.
 *
 * {APP}/ajax/?page={page} - {page} 페이지 번호로 article 데이터를 가져옵니다.
 * {APP}/ajax/?get={get} - {get}에 입력된 데이터만 가져옵니다. (nest,print_paginate,print_moreitem)
 * {APP}/ajax/?render={render} - {render}에 입력된 형식의 데이터로 가져옵니다. (text,html)
 *
 */

$data = null;


switch($_target)
{
	case 'index':
	case 'nest':
		$_nest = $_params['nest'];
		$_category = (int)$_params['category'];

		$page = (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

		// get data
		$data = $api->index([
			'app_srl' => __APP_SRL__,
			'nest_id' => $_nest,
			'category_srl' => $_category,
			'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
			'print_data' => 'article,nav_more',
			'root' => __ROOT__,
			'count' => __DEFAULT_ITEM_COUNT__
		]);

		break;

	case 'article':
		$_nest = $_params['nest'];
		$_category = (int)$_params['category'];
		$_article = (int)$_params['article'];

		// get article
		$repo = $api->view([
			'app_srl' => __APP_SRL__,
			'article_srl' => $_article,
			'updateHit' => isCookieKey( 'redgoose-hit-' . $_article, 7 ),
			'print_data' => ($_GET['get']) ? $_GET['get'] : 'all',
		]);
		break;

	case 'upLike':
		break;
}


// check render type
switch($_GET['render'])
{
	case 'text':
		$header = 'Content-Type: text/plain; charset=utf-8';
		break;
	case 'html':
		$header = 'Content-Type: text/html; charset=utf-8';
		break;
	default:
		$header = 'Content-Type: text/plain; charset=utf-8';
		break;
}


// RENDER
header($header);
$render_data = json_encode($data, JSON_PRETTY_PRINT);
print_r($render_data);