<?php
namespace Core;
use Dotenv\Dotenv, redgoose\Console, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::createImmutable(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  echo 'ERROR: .env error';
  exit;
}

// ini_set
if ($_ENV['APP_USE_DEBUG'] === '1')
{
  error_reporting(E_ALL & ~E_NOTICE);
}

// set values
define('__ROOT__', $_ENV['APP_PATH_RELATIVE']);
define('__URL__', $_ENV['APP_PATH_URL']);
define('__APP_DEBUG__', $_ENV['APP_USE_DEBUG'] === '1');

// set default timezone
if ($_ENV['APP_TIMEZONE'])
{
  date_default_timezone_set($_ENV['APP_TIMEZONE']);
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache');

// set router
try {
  $router = new AppRouter();

  // not found page
  if (!$router->match)
  {
    throw new Exception('Not found page', 404);
  }

  // set route property
  $_target = $router->match['target'];
  $_params = (object)$router->match['params'];

  switch($_target)
  {
    case 'index':
      // get items
      $connect = new AppModel();
      $res = $connect->index();

      // render page
      $blade->render('index', (object)[
        'title' => $_ENV['APP_TITLE'],
        'pageTitle' => 'Newest works',
        'indexHead' => $res->head,
        'indexBody' => $res->body,
        'indexSpot' => $res->spot,
        'paginate' => $res->paginate,
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'index/nest':
      if (!($_params->id ?? false))
      {
        throw new Exception('Not found nest id.');
      }

      // get items
      $connect = new AppModel();
      $res = $connect->indexNest((object)[
        'nest_id' => $_params->id,
        'category_srl' => $_params->srl ?? null,
      ]);

      // set title
      $title = isset($res->nest->name) ? $res->nest->name.' / redgoose' : 'redgoose';

      // render page
      $blade->render('index-nest', (object)[
        'title' => $title,
        'pageTitle' => $res->nest->name,
        'nest_id' => $_params->id,
        'nest_srl' => $res->nest->srl,
        'category_srl' => $_params->srl ?? null,
        'categories' => $res->categories,
        'categoryName' => $res->category->name ?? null,
        'articles' => $res->articles,
        'paginate' => $res->paginate,
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'article':
      // get item
      $connect = new AppModel();
      $res = $connect->item((int)$_params->srl);

      // set title
      $title = ($res->article->title === '.' ? 'Untitled work' : $res->article->title).' on '.$_ENV['APP_TITLE'];
      $pageTitle = $res->article->title === '.' ? 'Untitled work' : $res->article->title;

      // render page
      $blade->render('article', (object)[
        'title' => $title,
        'pageTitle' => $pageTitle,
        'description' => AppUtil::contentToShortText($res->article->content),
        'image' => ($res->article->json->thumbnail->path ?? false) ? $_ENV['APP_PATH_API_URL'].'/'.$res->article->json->thumbnail->path : '',
        'data' => $res->article,
        'onLike' => AppUtil::checkCookie('redgoose-star-'.$_params->srl),
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'page':
      $_page = $_params->name;
      // check page file
      if (!file_exists(__PATH__.'/view/pages/'.$_page.'.blade.php'))
      {
        throw new Exception('Not found page', 404);
      }
      $blade->render('pages.'.$_page, (object)[
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'rss':
      $connect = new AppModel();
      $res = $connect->rss();
      AppUtil::setHeader('rss');
      $blade->render('rss', $res);
      break;

    case 'on-like':
      $connect = new AppModel();
      echo json_encode($connect->like((int)$_params->srl));
      break;

    case 'lab':
      if ($_ENV['APP_DEV'] === '1' && file_exists(__PATH__.'/./core/lab.php'))
      {
        require __PATH__.'/./core/lab.php';
      }
      else
      {
        throw new Exception('Not found page', 404);
      }
      break;

    default:
      throw new Exception('Not found page', 404);
  }
}
catch (Exception $e)
{
  try
  {
    AppUtil::error($e, $blade);
  }
  catch(Exception $e)
  {
    echo "Failed Error page";
  }
}
