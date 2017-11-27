<?php
if(!defined("__GOOSE__")){exit();}

/**
 * URL Guide
 *
 * // POST
 * {APP}/ : 모든 article을 불러옵니다.
 * {APP}/nest/{nest_id}/ : {nest_id} 값을가진 둥지의 데이터를 가져옵니다.
 * {APP}/nest/{nest_id}/{category_srl}/ : {nest_id}값과 {category_srl} 값을 가진 데이터를 가져옵니다.
 * {APP}/article/{article_srl}/ : {article_srl}값을 가진 article 데이터 하나를 가져옵니다.
 * {APP}/upLike/{article_srl}/ : {article_srl}값을 가진 article의 like 값을 1 올립니다.
 *
 * // GET
 * $_GET['action'] : (index,article,upLike)
 * $_GET['nest'] : 둥지 id
 * $_GET['category'] : 분류 번호
 * $_GET['article'] : 글 번호
 * $_GET['count'] : 목록에서의 글 출력 갯수
 *
 * {APP}/?page={page} : {page} 페이지 번호로 article 데이터를 가져옵니다.
 * {APP}/?get={get} : {get}에 입력된 데이터만 가져옵니다. (nest,print_paginate,print_moreitem)
 * {APP}/?render={render} : {render}에 입력된 형식의 데이터로 가져옵니다. (text,html)
 */


$data = null;

/**
 * @var string $_target
 * @var array $_params
 * @var API $api
 */
switch($_target)
{
	case 'index':
	case 'nest':
	default:
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
			'count' => $_GET['count'] ? (int)$_GET['count'] : __DEFAULT_ITEM_COUNT__,
		]);
		break;

	case 'article':
		$_nest = $_params['nest'];
		$_category = (int)$_params['category'];
		$_article = (int)$_params['article'];

		// get article
		$data = $api->view([
			'app_srl' => __APP_SRL__,
			'article_srl' => $_article,
			'updateHit' => !isCookieKey( 'redgoose-hit-' . $_article ),
			'print_data' => 'all',
		]);
		break;

	case 'upLike':
		$_article = (int)$_params['article'];

		$data = $api->upLike([ 'article_srl' => $_article ]);
		break;
}


// check render type
switch($_GET['render'])
{
	case 'html':
		$header = 'text/html';
		break;
	case 'json':
		$header = 'application/json';
		break;
	case 'text':
	default:
		$header = 'text/plain';
		break;
}


// RENDER
header('Content-Type: ' . $header . '; charset=utf-8');
print_r(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));