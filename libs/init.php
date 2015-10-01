<?php
if(!defined("__GOOSE__")){exit();}

@error_reporting(E_ALL ^ E_NOTICE);
if (is_bool(DEBUG) && DEBUG)
{
	@define(__StartTime__, array_sum(explode(' ', microtime())));
}

// load program files
require_once(__GOOSE_LIB__);
require_once('functions.php');

// init router
$router = Module::load('router');
$router->route->setBasePath(__ROOT__);
require_once('map.php');
$router->match = $router->route->match();

// set preferences
$pref = Spawn::item(array(
	'table' => Spawn::getTableName('json')
	,'where' => 'srl='.$pref_json_srl
));
$pref = Util::jsonToArray($pref['json'], true, true);


// action route
if ($router->match)
{
	$_target = $router->match['target'];
	$_params = $router->match['params'];
	$_method = $_SERVER['REQUEST_METHOD'];
	
	switch($_target)
	{
		case 'index':
			$containerDirectory = __PWD__.'/pages/index.php';
			break;
		case 'nest':
			$_nest = $_params['nest'];
			$_category = $_params['category'];
			$containerDirectory = __PWD__.'/pages/index.php';
			break;
		case 'items':
			$_nest = $_params['nest'];
			$_category = $_params['category'];
			require_once(__PWD__.'/pages/items.php');
			Goose::end(false);
			break;
		case 'article':
			$_nest = $_params['nest'];
			$_category = $_params['category'];
			$_article = $_params['article'];
			hitUpdate($_article);
			$containerDirectory = __PWD__.'/pages/article.php';
			break;
		case 'page':
			$_page = $_params['page'];
			$dir = __PWD__.'/pages/'.$_params['page'].'.html';
			if (is_file($dir))
			{
				$containerDirectory = $dir;
			}
			else
			{
				// 404 error
				Goose::error(404, null, __URL__);
				Goose::end();
			}
			break;
		case 'rss':
			require_once(__PWD__.'/pages/rss.php');
			Goose::end();
			break;
	}
}
else
{
	// 404 error
	Goose::error(404, null, __URL__);
	Goose::end();
}

// print layout
require_once(__PWD__.'/pages/layout.php');
