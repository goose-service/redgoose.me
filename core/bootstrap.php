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

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache');

// set router
try {
	$router = new Router();

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
					'title' => getenv('TITLE'),
					'pageTitle' => 'Newstest works',
					'index' => Util::getWorksData($res->data->index),
					'page' => Util::getPage(),
					'nextPage' => $res->data->nextPage,
				]);
				break;

			case 'index/nest':
				$res = Util::api('/external/redgoose-me-nest', (object)[
					'app_srl' => getenv('DEFAULT_APP_SRL'),
					'nest_id' => $_params->id,
					'category_srl' => $_params->srl,
					'ext_field' => 'item_all,count_article',
					'page' => Util::getPage(),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
				]);

				$title = 'redgoose';
				if (isset($res->data->nest->name)) $title = $res->data->nest->name.' - '.$title;
				if ($res->data->category) $title = $res->data->category->name.' - '.$title;
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
				$res = Util::api('/articles/'.(int)$_params->srl, (object)[
					'hit' => Util::checkCookie('redgoose-hit-'.$_params->srl) ? 0 : 1,
					'ext_field' => 'category_name,nest_name'
				]);
				if (!($res && $res->success)) throw new Exception($res->message, $res->code);
				$res->data->regdate = Util::convertDate($res->data->regdate);

				// add key in cookie
				if (!Util::checkCookie('redgoose-hit-'.$_params->srl))
				{
					Util::setCookie('redgoose-hit-'.$_params->srl, '1', 7);
				}

				// parse markdown
				$parsedown = new \Parsedown();
				$res->data->content = $parsedown->text($res->data->content);

				// render page
				switch ($_GET['mode'])
				{
					case 'popup':
						$blade->render('work.popup', (object)[
							'data' => $res->data,
							'onLike' => Util::checkCookie('redgoose-like-'.$_params->srl),
							'mode' => 'popup'
						]);
						break;

					default:
						$blade->render('work.detail', (object)[
							'title' => ($res->data->title === '.' ? 'Untitled work' : $res->data->title).' on '.getenv('TITLE'),
							'description' => Util::contentToShortText($res->data->content),
							'image' => __API__.'/'.$res->data->json->thumbnail->path,
							'data' => $res->data,
							'onLike' => Util::checkCookie('redgoose-like-'.$_params->srl),
							'mode' => 'default'
						]);
						break;
				}
				break;

			case 'page':
				$_page = $_params->name;
				// check page file
				if (!file_exists(__PATH__.'/view/pages/'.$_page.'.blade.php'))
				{
					throw new Exception('Not found page', 404);
				}
				$blade->render('pages.'.$_page);
				break;

			case 'rss':
				// TODO: 작업 필요함
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
	Util::error($e, $blade);
}
