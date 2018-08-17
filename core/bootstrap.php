<?php
if(!defined("__GOOSE__")){exit();}

@error_reporting(E_ALL ^ E_NOTICE);
@ini_set("display_errors", (is_bool(DEBUG) && DEBUG) ? 1 : 0);


// check localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] === "::1")) ? true : false);


// load program files
require_once(__PWD__.'/vendor/Router/AltoRouter.php');
require_once(__PWD__.'/vendor/BladeOne/BladeOne.php');
require_once(__PWD__.'/core/Util.class.php');
require_once(__PWD__.'/core/func.php');

Use eftec\bladeone;


// set preferences
$pref = externalApi('/json/'.__JSON_SRL_PREFERENCE__);
if (!$pref)
{
	echo 'not found pref data';
	exit;
}
else
{
	$pref = $pref->json;
}

// set app preference
$appPref = (object)[
	'isUserIcons' => is_dir(__PWD__ . 'assets/icons/')
];

// set blade
$blade = new bladeone\BladeOne(__PWD__.'view', __PWD__.'cache');

// router
$router = new AltoRouter();
$router->setBasePath(__ROOT__);
require_once('map.php');

if ($router->match())
{
	$match = $router->match();
	$_target = $match['target'];
	$_params = (object)$match['params'];
	$_method = $_SERVER['REQUEST_METHOD'];

	// init api
	require_once('API.class.php');
	$api = new API();

	if ($_method === 'POST')
	{
		require_once('ajax.php');
		exit;
	}
	else if ($_method === 'GET')
	{
		switch($_target)
		{
			case 'index':
				// get data
				$repo = $api->index((object)[
					'app_srl' => __APP_SRL__,
					'nest_id' => null,
					'category_srl' => null,
					'page' => $_GET['page'],
					'print_data' => 'article,nav_more',
					'root' => __ROOT__,
					'size' => __DEFAULT_ITEM_COUNT__
				]);

				// check error
				if ($repo->state == 'error')
				{
					echo 'error data';
					exit;
				}


				// render
				echo $blade->run('index', [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $pref->meta->title,
					'repo' => $repo
				]);
				break;

			case 'nest':
				$_nest = $_params->nest;
				$_category = (int)$_params->category;
				$_page = getGnbActive($pref->nav, $_nest);

				// get data
				$repo = $api->index((object)[
					'app_srl' => __APP_SRL__,
					'nest_id' => $_nest,
					'category_srl' => $_category,
					'page' => $_GET['page'],
					'print_data' => 'nest,article,category,nav_more',
					'root' => __ROOT__,
					'size' => __DEFAULT_ITEM_COUNT__
				]);

				// check error
				if ($repo->state == 'error')
				{
					echo '500 error';
					exit;
				}

				// set title
				$title = $pref->meta->title;
				$title .= ($_nest) ? ' / ' . $repo->nest->name : '';
				$title .= ($repo->category_name) ? ' / ' . $repo->category_name : '';

				// render
				echo $blade->run('index', [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $title,
					'_page' => $_page,
					'_nest' => $_nest,
					'_category' => $_category,
					'repo' => $repo
				]);
				break;

			case 'article':
				$_nest = $_params->nest;
				$_category = (int)$_params->category;
				$_article = (int)$_params->article;

				// set print data
				$printData = $_GET['get'] ? $_GET['get'] : ('' . ($_nest ? ',nest' : '') . ($_nest && $_category ? ',category' : ''));
				$printData = preg_replace("/^,/", '', $printData);

				// get article
				$repo = $api->article((object)[
					'app_srl' => __APP_SRL__,
					'article_srl' => $_article,
					'updateHit' => !isCookieKey( 'redgoose-hit-'.$_article ),
					'print_data' => $printData,
				]);

				// select render file
				switch ($_GET['mode'])
				{
					case 'popup':
						$renderFile = 'article.popup';
						break;
					default:
						$renderFile = 'article.view';
						break;
				}

				// set title
				$title = $pref->meta->title . (($repo->article->title) ? ' / ' . $repo->article->title : '');

				// render
				echo $blade->run($renderFile, [
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $title,
					'_nest' => $_nest,
					'_category' => $_category,
					'_article' => $_article,
					'onLike' => isCookieKey( 'redgoose-like-'.$_article ),
					'repo' => $repo
				]);
				break;

			case 'page':
				$_page = $_params->page;

				// check page file
				if (!file_exists(__PWD__.'view/pages/'.$_page.'.blade.php'))
				{
					echo '404 error';
					exit;
				}
				echo $blade->run('pages.'.$_page, [
					'_page' => $_page,
					'pref' => $pref,
					'appPref' => $appPref,
					'title' => $pref->title
				]);
				break;

			case 'ajax':
				require_once('ajax.php');
				break;

			case 'rss':
				require_once('rss.php');
				break;

			default:
				echo '404';
				break;
		}
	}
}
else
{
	echo '404';
	exit;
}