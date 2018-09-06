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
				if (!$res->success) throw new Exception($res->message);
				if (!$res) throw new Exception($res->message);

				$index = [];
				foreach ($res->data->index as $key=>$item)
				{
					if ($item->json && $item->json->thumbnail)
					{
						$size = '';
						if ($item->json->thumbnail->sizeSet)
						{
							$size = explode('*', $item->json->thumbnail->sizeSet);
							$size[0] = $size[0] ? 'w'.$size[0] : '';
							$size[1] = $size[1] ? 'h'.$size[1] : '';
							$size = implode(' ', $size);
						}

						// render page
						$index[] = (object)[
							'srl' => (int)$item->srl,
							'title' => $item->title,
							'image' => $item->json->thumbnail->path,
							'className' => $size,
						];
					}
				}
				Util::console($index);

				// render page
				$blade->render('index', (object)[
					'index' => $index,
					'nextPage' => $res->data->nextPage,
				]);
				break;

			case 'index/nest':
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
