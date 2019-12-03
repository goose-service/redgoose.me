<?php
namespace Core;
use Dotenv\Dotenv, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::create(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  throw new Exception('.env error');
}

// ini_set
if (getenv('USE_DEBUG') === '1')
{
  error_reporting(E_ALL & ~E_NOTICE);
}

// set values
define('__ROOT__', getenv('PATH_RELATIVE'));
define('__API__', getenv('PATH_API'));
define('__URL__', getenv('PATH_URL'));

// set default timezone
if (getenv('TIMEZONE'))
{
  date_default_timezone_set(getenv('TIMEZONE'));
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache/view');

// set router
try {
  $router = new Router();

  // not found page
  if (!$router->match)
  {
    throw new Exception('Not found page', 404);
  }

  // play route
  $_target = $router->match['target'];
  $_params = (object)$router->match['params'];
  $_method = $_SERVER['REQUEST_METHOD'];

  switch($_target)
  {
    case 'index':
      $page = Util::getPage();
      $size = (int)getenv('DEFAULT_INDEX_SIZE');
      $randomSize = 8;

      // get articles
      $res = Util::api('/external/redgoose-me', (object)[
        'field' => 'srl,type,nest_srl,category_srl,json,title,order',
        'order' => '`order` desc, `srl` desc',
        'app' => getenv('DEFAULT_APP_SRL'),
        'size' => $size,
        'page' => $page,
        'ext_field' => 'category_name,nest_name',
        'random_date' => '1 year',
        'random_field' => 'order',
        'random_count' => $page === 1 ? $randomSize : 0,
        'random_merge' => false,
        'random_range' => 'YmdH',
        'shuffle' => false,
      ]);
      if (!($res && $res->success)) throw new Exception($res->message);

      $tmpArticles = Util::getWorksData($res->data->index);
      $articles = (object)[
        'head' => array_slice($tmpArticles, 0,4),
        'body' => array_slice($tmpArticles, 4)
      ];

      // make pagination
      $paginate = Util::makePagination($res->data->total, $page, $size);

      // render page
      $blade->render('index', (object)[
        'title' => getenv('TITLE'),
        'pageTitle' => 'Newest works',
        'count' => count($tmpArticles),
        'index' => $articles,
        'randomIndex' => Util::getWorksData($res->data->random),
        'paginate' => $paginate,
      ]);
      break;
    case 'index/nest':
      $page = Util::getPage();
      $size = (int)getenv('DEFAULT_INDEX_SIZE');

      $res = Util::api('/external/redgoose-me-nest', (object)[
        'app_srl' => getenv('DEFAULT_APP_SRL'),
        'nest_id' => $_params->id,
        'category_srl' => $_params->srl,
        'page' => Util::getPage(),
        'size' => getenv('DEFAULT_INDEX_SIZE'),
        'order' => '`order` desc, `srl` desc',
      ]);

      // make pagination
      $paginate = Util::makePagination($res->data->works->total, $page, $size);

      $title = 'redgoose';
      if (isset($res->data->nest->name)) $title = $res->data->nest->name.' / '.$title;
      // render page
      $blade->render('index-nest', (object)[
        'title' => $title,
        'pageTitle' => $res->data->nest->name,
        'nest_id' => $_params->id,
        'nest_srl' => $res->data->nest->srl,
        'category_srl' => $_params->srl,
        'categories' => $res->data->categories,
        'index' => Util::getWorksData($res->data->works->index),
        'paginate' => $paginate,
      ]);
      break;
    case 'article':
      $res = Util::api('/articles/'.(int)$_params->srl, (object)[
        'app' => getenv('DEFAULT_APP_SRL'),
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
      $blade->render('detail', (object)[
        'title' => ($res->data->title === '.' ? 'Untitled work' : $res->data->title).' on '.getenv('TITLE'),
        'pageTitle' => $res->data->title === '.' ? 'Untitled work' : $res->data->title,
        'description' => Util::contentToShortText($res->data->content),
        'image' => __API__.'/'.$res->data->json->thumbnail->path,
        'data' => $res->data,
        'onLike' => Util::checkCookie('redgoose-star-'.$_params->srl),
      ]);
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
      $data = (object)[
        'url' => __URL__,
        'title' => getenv('TITLE'),
        'description' => getenv('DESCRIPTION'),
        'link' => __URL__,
      ];
      // get data
      $res = Util::api('/articles', (object)[
        'app' => getenv('DEFAULT_APP_SRL'),
        'field' => 'srl,type,nest_srl,category_srl,json,title,content,order',
        'size' => getenv('DEFAULT_RSS_SIZE'),
        'order' => '`order` desc, `srl` desc',
      ]);
      // make articles
      if ($res->success && isset($res->data->index) && count($res->data->index))
      {
        // parse markdown
        $parsedown = new \Parsedown();
        $data->articles = [];
        foreach($res->data->index as $k=>$item)
        {
          $data->articles[] = (object)[
            'srl' => $item->srl,
            'title' => htmlspecialchars($item->title),
            'date' => date_format(date_create($item->order), 'D, d M Y H:i:s +0900'),
            'content' => $parsedown->text($item->content),
            'thumbnail' => isset($item->json->thumbnail->path) ? __API__.'/'.$item->json->thumbnail->path : null,
          ];
        }
      }
      // set header
      Util::setHeader('rss');
      // render
      $blade->render('rss', $data);
      break;
    case 'on-like':
      $res = Util::api(
        '/articles/'.(int)$_params->srl.'/update',
        (object)[ 'type' => 'star' ]
      );
      echo json_encode($res);
      break;
    default:
      throw new Exception('Not found page', 404);
      break;
  }
}
catch (Exception $e)
{
  Util::error($e, $blade);
}
