<?php
use core\Util;
if(!defined("__GOOSE__")){exit();}


/**
 * URL Guide
 *
 * // url
 * `{APP}/ajax/`: 모든 `article`들을 불러옵니다.
 * `{APP}/ajax/{action}/` : (index,article,upLike)
 *
 * // params `$_GET||$_POST` 가능함
 * $_GET['size'] : 목록에서의 글 출력 갯수
 * $_GET['page'] : 페이지 번호
 * $_GET['get'] : 입력된 데이터만 가져온다. (nest,print_paginate,print_more)
 * $_GET['render'] : 입력된 형식의 데이터로 가져옵니다. (text,html,json)
 */


$data = null;


/**
 * @var string $_target
 * @var object $_params
 * @var API $api
 */
switch($_params->action)
{
	/**
	 * Index
	 *
	 */
	case 'index':
	default:
		$_nest = $_params->nest;
		$_category = (int)$_params->category;
		$page = (getParam('page') && (int)getParam('page') > 1) ? (int)getParam('page') : 1;

		// get data
		$data = $api->index((object)[
			'field' => getParam('field'),
			'app_srl' => __APP_SRL__,
			'nest_id' => $_nest,
			'category_srl' => $_category,
			'page' => $page,
			'print_data' => getParam('get') ? getParam('get') : 'article,nav_more',
			'size' => getParam('size') ? (int)getParam('size') : __DEFAULT_ITEM_COUNT__,
			'pageSize' => null,
		]);
		break;

	/**
	 * Article
	 *
	 * `{APP}/ajax/article/{srl}/`
	 */
	case 'article':
		// get article
		$data = $api->article((object)[
			'app_srl' => __APP_SRL__,
			'article_srl' => getParam('srl'),
			//'updateHit' => !isCookieKey( 'redgoose-hit-' . $_article ),
			'print_data' => getParam('get') ? getParam('get') : 'nest,category',
		]);
		break;

	/**
	 * Up like
	 *
	 * `{APP}/ajax/upLike/{srl}/`
	 */
	case 'upLike':
		$_article = (int)$_params->article;

		$data = $api->upLike((object)[ 'article_srl' => $_article ]);
		break;
}


// check render type
switch(getParam('render'))
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