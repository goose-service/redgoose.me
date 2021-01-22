<?php
namespace Core;
use Exception, Parsedown, redgoose\Paginate, redgoose\Console;

/**
 * App model
 */

class AppModel {

  private $connect;

  /**
   * construct
   *
   * @throws Exception
   */
  public function __construct()
  {
    try
    {
      // check path
      if (!($_ENV['APP_PATH_GOOSE'] && $_ENV['APP_TOKEN_PUBLIC'])) throw new Exception();
      if (!file_exists(__PATH__.'/'.$_ENV['APP_PATH_GOOSE'].'connect.php'))
      {
        throw new Exception('Not found connect file');
      }
      // require goose connect
      $this->connect = require __PATH__.'/'.$_ENV['APP_PATH_GOOSE'].'connect.php';
      // initial goose connect
      $this->connect->init((object)[
        'token' => $_ENV['APP_TOKEN_PUBLIC'],
      ]);
      // connect database
      $this->connect->model->connect();
    }
    catch(Exception $e)
    {
      throw new Exception('Failed create unit.');
    }
  }

  /**
   * index
   *
   * @return object
   * @throws Exception
   */
  public function index(): object
  {
    try
    {
      // set variables
      $result = (object)[];
      $result->page = AppUtil::getPage();
      $result->size = (int)$_ENV['APP_DEFAULT_INDEX_SIZE'];
      $field = 'srl,type,nest_srl,category_srl,json,title,order';
      $randomCount = $result->page === 1 ? 8 : 0;

      // set where
      $where = ($app = $_ENV['APP_DEFAULT_APP_SRL']) ? ' and app_srl='.$app : '';
      $where .= ' and type LIKE \'public\'';

      // get total articles
      $result->total = $this->connect->model->getCount((object)[
        'table' => 'articles',
        'where' => $where,
        'debug' => __APP_DEBUG__,
      ])->data;

      // get articles
      $articles = $this->connect->model->getItems((object)[
        'table' => 'articles',
        'field' => $field,
        'where' => $where,
        'order' => '`order` desc, `srl` desc',
        'size' => $result->size,
        'limit' => [ ($result->page - 1) * $result->size, $result->size ],
        'json_field' => ['json'],
        'debug' => __APP_DEBUG__,
      ]);
      $articles = isset($articles->data) ? $articles->data : [];
      $articles = $this->extendCategoryNameInItems($articles);
      $articles = $this->extendNestNameInItems($articles);
      $articles = $this->convertArticles($articles);

      // get random articles
      $result->spot = [];
      if ($randomCount > 0 && count($articles) > 4)
      {
        $relativeField = 'order';
        $relativeDate = '1 year';
        $randomRange = 'YmdH';
        $randomArticles = $this->connect->model->getItems((object)[
          'table' => 'articles',
          'field' => $field,
          'where' => $where.' and `'.$relativeField.'` >= unix_timestamp(date_sub(now(), interval '.$relativeDate.'))',
          'json_field' => ['json'],
          'order' => 'rand('.date($randomRange).')',
          'limit' => $randomCount,
          'debug' => __APP_DEBUG__,
        ]);
        $result->spot = isset($randomArticles->data) ? $randomArticles->data : [];
        $result->spot = $this->extendCategoryNameInItems($result->spot);
        $result->spot = $this->extendNestNameInItems($result->spot);
        $result->spot = $this->convertArticles($result->spot);
      }

      // split head and body
      $result->head = ($articles && count($articles) > 0) ? array_slice($articles, 0,4) : [];
      $result->body = ($articles && count($articles) > 0) ? array_slice($articles, 4) : [];

      // make pagination
      $result->paginate = ($result->total > 0) ? $this->makePagination($result->total, $result->page, $result->size) : null;

      return $result;
    }
    catch(Exception $e)
    {
      throw new Exception($e->getMessage(), $e->getCode());
    }
  }

  /**
   * index/nest
   *
   * @param object $options
   * @return object
   * @throws Exception
   */
  public function indexNest(object $options): object
  {
    try
    {
      // set variables
      $result = (object)[];
      $result->page = AppUtil::getPage();
      $result->size = (int)$_ENV['APP_DEFAULT_INDEX_SIZE'];
      $nest_id = $options->nest_id;
      $category_srl = $options->category_srl;

      // get nest
      $nest = $this->connect->model->getItem((object)[
        'table' => 'nests',
        'field' => 'srl,name,json',
        'where' => 'id LIKE \''.$nest_id.'\'',
        'json_field' => ['json'],
        'debug' => __APP_DEBUG__,
      ]);
      if ($nest->data) $nest = $nest->data;
      else throw new Exception('There is no `nest` data.');

      // get categories
      $result->categories = [];
      if ((int)$nest->json->useCategory === 1)
      {
        $result->categories = $this->connect->model->getItems((object)[
          'table' => 'categories',
          'field' => 'srl,name',
          'where' => 'nest_srl='.(int)$nest->srl,
          'order' => 'turn',
          'sort' => 'asc',
        ]);
        if (isset($result->categories->data) && count($result->categories->data) > 0)
        {
          $result->categories = $result->categories->data;
          // extend articles count
          foreach ($result->categories as $k=>$v)
          {
            $cnt = $this->connect->model->getCount((object)[
              'table' => 'articles',
              'where' => "type LIKE 'public' and category_srl={$v->srl}",
            ]);
            $result->categories[$k]->count_article = $cnt->data;
          }
          // extend all item
          $cnt = $this->connect->model->getCount((object)[
            'table' => 'articles',
            'where' => "type LIKE 'public' and nest_srl={$nest->srl}",
          ]);
          array_unshift($result->categories, (object)[
            'srl' => '',
            'nest_srl' => $nest->srl,
            'name' => 'All',
            'count_article' => $cnt->data,
          ]);
        }
        else
        {
          $result->categories = [];
        }
      }

      // get category
      $result->category = null;
      if ($category_srl)
      {
        $result->category = $this->connect->model->getItem((object)[
          'table' => 'categories',
          'field' => 'srl,name',
          'where' => 'srl='.$category_srl,
        ]);
        if (isset($result->category->data) && $result->category->data->srl)
        {
          $result->category = $result->category->data;
        }
      }

      // set articles params
      $where = ($app = $_ENV['APP_DEFAULT_APP_SRL']) ? " and app_srl={$app}" : '';
      $where .= " and nest_srl={$nest->srl}";
      $where .= " and type LIKE 'public'";
      if ($category_srl) $where .= ' and category_srl='.$category_srl;

      // get articles count
      $result->total = $this->connect->model->getCount((object)[
        'table' => 'articles',
        'where' => $where,
        'debug' => __APP_DEBUG__,
      ])->data;

      // get articles
      $result->articles = $this->connect->model->getItems((object)[
        'table' => 'articles',
        'field' => 'srl,title,json,`order`',
        'where' => $where,
        'order' => '`order` desc, `srl` desc',
        'limit' => [ ($result->page - 1) * $result->size, $result->size ],
        'json_field' => ['json'],
        'debug' => __APP_DEBUG__,
      ]);
      $result->articles = (isset($result->articles->data) && count($result->articles->data)) ? $result->articles->data : [];
      // extend articles
      if ($result->articles && count($result->articles) > 0)
      {
        $result->articles = $this->convertArticles($result->articles);
      }

      // set result
      $result->nest = (object)[
        'srl' => $nest->srl,
        'name' => $nest->name,
      ];

      // make pagination
      $result->paginate = ($result->total > 0) ? $this->makePagination($result->total, $result->page, $result->size) : null;

      return $result;
    }
    catch(Exception $e)
    {
      throw new Exception($e->getMessage(), $e->getCode());
    }
  }

  /**
   * item
   *
   * @param int $article_srl
   * @return object
   * @throws Exception
   */
  public function item(int $article_srl): object
  {
    try
    {
      if (!(isset($article_srl) && $article_srl))
      {
        throw new Exception('Not found article srl.');
      }

      // set variables
      $result = (object)[];

      // set article params
      $where = ($app = $_ENV['APP_DEFAULT_APP_SRL']) ? " and app_srl={$app}" : '';
      $where .= " and type LIKE 'public'";
      $where .= " and srl={$article_srl}";

      // get article
      $result->article = $this->connect->model->getItem((object)[
        'table' => 'articles',
        'json_field' => ['json'],
        'where' => $where,
        'debug' => __APP_DEBUG__,
      ]);
      if (!isset($result->article->data->srl))
      {
        throw new Exception('no data.');
      }
      $result->article = $result->article->data;

      // extend article
      $category = $this->connect->model->getItem((object)[
        'table' => 'categories',
        'field' => 'name',
        'where' => 'srl='.(int)$result->article->category_srl,
        'debug' => __APP_DEBUG__,
      ]);
      if (isset($category->data->name))
      {
        $result->article->category_name = $category->data->name;
      }
      $nest = $this->connect->model->getItem((object)[
        'table' => 'nests',
        'where' => 'srl='.(int)$result->article->nest_srl,
      ]);
      if (isset($nest->data->name))
      {
        $result->article->nest_name = $nest->data->name;
      }

      // update hit
      if (!AppUtil::checkCookie('redgoose-hit-'.$article_srl))
      {
        if (isset($result->article->hit))
        {
          $result->article->hit = (int)$result->article->hit + 1;
          $this->connect->model->edit((object)[
            'table' => 'articles',
            'where' => 'srl='.$article_srl,
            'data' => [ "hit='{$result->article->hit}'" ],
          ]);
        }
        // add key in cookie
        AppUtil::setCookie('redgoose-hit-'.$article_srl, '1', 7);
      }

      // parse markdown
      $parsedown = new Parsedown();
      $result->article->content = $parsedown->text($result->article->content);

      return $result;
    }
    catch(Exception $e)
    {
      throw new Exception($e->getMessage(), $e->getCode());
    }
  }

  /**
   * rss
   *
   * @return object
   */
  public function rss(): object
  {
    $result = (object)[
      'url' => __URL__,
      'title' => $_ENV['APP_TITLE'],
      'description' => $_ENV['APP_DESCRIPTION'],
      'link' => __URL__,
    ];
    try
    {
      // get articles
      $articles = $this->connect->model->getItems((object)[
        'table' => 'articles',
        'field' => 'srl,type,nest_srl,category_srl,json,title,content,order',
        'where' => 'app_srl='.$_ENV['APP_DEFAULT_APP_SRL'],
        'size' => $_ENV['APP_DEFAULT_RSS_SIZE'],
        'order' => '`order` desc, `srl` desc',
        'json_field' => ['json'],
        'debug' => __APP_DEBUG__,
      ]);
      if (!(isset($articles->data) && count($articles->data)))
      {
        throw new Exception('no articles');
      }
      $articles = $articles->data;

      // parse markdown
      $parsedown = new Parsedown();

      // convert article items
      $result->articles = [];
      foreach($articles as $k=>$item)
      {
        $result->articles[] = (object)[
          'srl' => $item->srl,
          'title' => htmlspecialchars($item->title),
          'date' => date_format(date_create($item->order), 'D, d M Y H:i:s +0900'),
          'content' => $parsedown->text($item->content),
          'thumbnail' => isset($item->json->thumbnail->path) ? $_ENV['APP_PATH_API_URL'].'/'.$item->json->thumbnail->path : null,
        ];
      }
    }
    catch(Exception $e)
    {
      $result->articles = [];
    }
    return $result;
  }

  /**
   * like
   *
   * @param int $article_srl
   * @return object
   */
  public function like(int $article_srl): object
  {
    $result = (object)[];
    try
    {
      // request
      $res = $this->connect->request('post', "/articles/{$article_srl}/update/", (object)[
        'get' => (object)[ 'type' => 'star' ],
      ]);
      if (!($res->success && isset($res->data)))
      {
        throw new Exception();
      }
      $result->success = true;
      $result->star = $res->data->star;
      AppUtil::setCookie('redgoose-like-'.$article_srl, '1', 30);
    }
    catch(Exception $e)
    {
      $result->success = false;
    }
    return $result;
  }

  /**
   * extend category name in items
   *
   * @param array $items
   * @return array
   */
  private function extendCategoryNameInItems(array $items): array
  {
    if (!(isset($items) && count($items))) return [];
    foreach ($items as $k=>$v)
    {
      if (!$v->category_srl)
      {
        $items[$k]->category_name = null;
        continue;
      }
      $category = $this->connect->model->getItem((object)[
        'table' => 'categories',
        'field' => 'name',
        'where' => 'srl='.(int)$v->category_srl,
      ]);
      $items[$k]->category_name = isset($category->data->name) ? $category->data->name : null;
    }
    return $items;
  }

  /**
   * extend nest name in items
   *
   * @param array $items
   * @return array
   */
  private function extendNestNameInItems(array $items): array
  {
    if (!(isset($items) && count($items))) return [];
    foreach ($items as $k=>$v)
    {
      if (!$v->nest_srl)
      {
        $items[$k]->nest_name = null;
        continue;
      }
      $nest = $this->connect->model->getItem((object)[
        'table' => 'nests',
        'field' => 'name',
        'where' => 'srl='.(int)$v->nest_srl,
      ]);
      $items[$k]->nest_name = isset($nest->data->name) ? $nest->data->name : null;
    }
    return $items;
  }

  /**
   * convert articles
   *
   * @param array $items
   * @return array
   */
  private function convertArticles(array $items): array
  {
    if (!(isset($items) && count($items))) return [];
    $result = [];
    foreach ($items as $key=>$item)
    {
      $obj = (object)[];
      if ($item->json)
      {
        $obj->srl = (int)$item->srl;
        $obj->title = (isset($item->title) && $item->title === '.') ? 'untitled work' : $item->title;
        $obj->image = isset($item->json->thumbnail->path) ? $_ENV['APP_PATH_API_URL'].'/'.$item->json->thumbnail->path : null;
        if (isset($item->category_name)) $obj->categoryName = $item->category_name;
        if (isset($item->nest_name)) $obj->nestName = $item->nest_name;
        if (isset($item->order)) $obj->regdate = $item->order;
        $result[] = $obj;
      }
    }
    return $result;
  }

  /**
   * make pagination
   * 모바일과 데스크탑 네비게이션 객체를 만들어준다.
   *
   * @param int $total
   * @param int $page
   * @param int $size
   * @param array $params
   * @return object
   */
  private function makePagination(int $total=0, int $page=1, int $size=10, $params=[]): object
  {
    $result = (object)[
      'total' => $total,
      'page' => $page,
    ];
    $paginate = new Paginate((object)[
      'total' => $total,
      'page' => $page,
      'size' => $size,
      'params' => $params,
      'scale' => 3,
    ]);
    $result->mobile = $paginate->createElements(['paginate', 'paginate--mobile']);
    $paginate->update((object)[ 'scale' => 10 ]);
    $result->desktop = $paginate->createElements(['paginate', 'paginate--desktop']);
    return $result;
  }

}
