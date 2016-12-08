<?php
use core\Spawn, core\Goose, core\Util, core\Module;
if(!defined("__GOOSE__")){exit();}


@error_reporting(E_ALL ^ E_NOTICE);
if (is_bool(DEBUG) && DEBUG)
{
	@define(__StartTime__, array_sum(explode(' ', microtime())));
}


// is localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] == "::1")) ? true : false);


// load program files
require_once(__GOOSE_LIB__);
require_once('func.php');


// init router
$router = Module::load('Router');
$router->route->setBasePath(__ROOT__);
require_once('map.php');
$router->match = $router->route->match();


// set preferences
$pref = Spawn::item([
	'table' => Spawn::getTableName('JSON'),
	'field' => 'json',
	'where' => 'srl=' . __JSON_SRL_PREFERENCE__,
	'jsonField' => ['json']
]);
$pref = $pref['json'];


// set blade
$blade = new core\Blade(__PWD__ . 'view', __PWD__ . 'cache');


// set app preference
$appPref = new stdClass();
$appPref->isUserIcons = is_dir(__GOOSE_PWD__ . 'vendor/icons--user/');
$appPref->og = new stdClass();


// action route
if ($router->match)
{
	$_target = $router->match['target'];
	$_params = $router->match['params'];
	$_method = $_SERVER['REQUEST_METHOD'];

	// init api
	require_once('API.class.php');
	$api = new API();

	if ($_method == 'POST')
	{
		require_once('ajax.php');
		Goose::end();
	}
	else
	{
		switch($_target)
		{
			case 'index':
				// get data
				$repo = $api->index([
					'app_srl' => __APP_SRL__,
					'nest_id' => null,
					'category_srl' => null,
					'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
					'print_data' => 'article,nav_more',
					'root' => __ROOT__,
					'count' => __DEFAULT_ITEM_COUNT__
				]);

				if ($repo['state'] == 'error')
				{
					core\Goose::error(101, $repo['message'], __URL__);
				}

				$blade->render('index', [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $pref['meta']['title'],
					'repo' => $repo
				]);
				break;

			case 'nest':
				$_nest = $_params['nest'];
				$_category = (int)$_params['category'];

				// get data
				$repo = $api->index([
					'app_srl' => __APP_SRL__,
					'nest_id' => $_nest,
					'category_srl' => $_category,
					'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
					'print_data' => 'nest,article,category,nav_more',
					'root' => __ROOT__,
					'count' => __DEFAULT_ITEM_COUNT__
				]);

				if ($repo['state'] == 'error')
				{
					core\Goose::error(101, $repo['message'], __URL__);
				}

				$title = $pref['meta']['title'];
				$title .= ($_nest) ? ' / ' . $repo['nest']['name'] : '';
				$title .= ($repo['category_name']) ? ' / ' . $repo['category_name'] : '';

				$blade->render('index', [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $title,
					'_nest' => $_nest,
					'_category' => $_category,
					'repo' => $repo
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
					'updateHit' => !isCookieKey( 'redgoose-hit-' . $_article ),
					'print_data' => ($_GET['get']) ? $_GET['get'] : 'all' . ($_nest ? ',nest' : '') . ($_nest && $_category ? ',category' : ''),
				]);

				$blade->render((($_GET['popup']) ? 'detail.view-popup' : 'detail.view'), [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $pref['meta']['title'] . ($repo['article']['title'] && ($repo['article']['title'] !== '.') ? ' / ' . $repo['article']['title'] : ''),
					'_nest' => $_nest,
					'_category' => $_category,
					'_article' => $_article,
					'onLike' => isCookieKey( 'redgoose-like-'.$_article ),
					'popup' => $_GET['popup'],
					'repo' => $repo
				]);
				break;

			case 'page':
				$_page = $_params['page'];

				$blade->render('page.' . $_page, [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $pref['meta']['title'],
					'_page' => $_page
				]);
				break;

			case 'upLike':
				$_article = (int)$_params['article'];

				$data = $api->upLike([ 'article_srl' => $_article ]);
				header('Location: ' . $_SERVER['HTTP_REFERER']);
				break;

			case 'ajax':
				require_once('ajax.php');
				Goose::end();
				break;

			case 'rss':
				require_once('rss.php');
				Goose::end();
				break;

			default:
				Goose::error(404, null, __URL__);
				break;
		}
	}
}
else
{
	Goose::error(404, null, __URL__);
}
