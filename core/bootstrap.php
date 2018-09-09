<?php
namespace Core;
use Dotenv\Dotenv, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
	$dotenv = new Dotenv(__PATH__);
	$dotenv->load();
}
catch(Exception $e)
{
	throw new Exception('.env error');
}

// set values
define('__ROOT__', getenv('PATH_RELATIVE'));
define('__API__', getenv('PATH_API'));

// set default timezone
if (getenv('TIMEZONE'))
{
	date_default_timezone_set(getenv('TIMEZONE'));
}

// set router
try {
	$router = new Router();

	// set blade
	$blade = new Blade(__PATH__.'/view', __PATH__.'/cache');

	// play route
	if ($router->match)
	{
		$_target = $router->match['target'];
		$_params = (object)$router->match['params'];
		$_method = $_SERVER['REQUEST_METHOD'];

		switch($_target)
		{
			case 'index':
				// get articles
				$res = Util::api('/articles', (object)[
					'field' => 'srl,json,title',
					'order' => 'regdate',
					'sort' => 'desc',
					'app' => getenv('DEFAULT_APP_SRL'),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
					'page' => Util::getPage(),
					'ext_field' => 'next_page',
				]);
				if (!($res && $res->success)) throw new Exception($res->message);

				// render page
				$blade->render('index', (object)[
					'title' => 'redgoose',
					'pageTitle' => 'Newstest works',
					'index' => Util::getWorksData($res->data->index),
					'page' => Util::getPage(),
					'nextPage' => $res->data->nextPage,
				]);
				break;

			case 'index/nest':
				$res = Util::api('/external/redgoose-me-nest', (object)[
					'nest_id' => $_params->id,
					'category_srl' => $_params->srl,
					'ext_field' => 'item_all,count_article',
					'page' => Util::getPage(),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
				]);
				if (!($res && $res->success)) throw new Exception($res->message);

				$title = 'redgoose';
				if (isset($res->data->nest->name)) $title = $res->data->nest->name.' / '.$title;
				if ($res->data->category) $title = $res->data->category->name.' / '.$title;
				// render page
				$blade->render('index', (object)[
					'title' => $title,
					'pageTitle' => $res->data->nest->name,
					'nest_id' => $_params->id,
					'nest_srl' => $res->data->nest->srl,
					'category_srl' => $_params->srl,
					'category_name' => isset($res->data->category->name) ? $res->data->category->name : null,
					'index' => Util::getWorksData($res->data->works),
					'categories' => $res->data->categories,
					'page' => Util::getPage(),
					'nextPage' => $res->data->nextPage,
				]);
				break;

			case 'article':
				break;

			case 'page':
				break;

			case 'rss':
				break;

			default:
				throw new Exception('Not found page', 404);
				break;
		}
	}
	else
	{
		throw new Exception('Not found page', 404);
	}

}
catch (Exception $e)
{
	Util::error($e);
}
