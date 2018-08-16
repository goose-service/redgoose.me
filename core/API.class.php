<?php
if(!defined("__GOOSE__")){exit();}


class API {

	public $ajax, $api;

	public function __construct()
	{
		global $api_context;
		$this->api = $api_context;
		$this->ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['REQUEST_METHOD'] == 'GET');
	}

	/**
	 * Search key in array
	 *
	 * @param array $get
	 * @param string $key
	 * @return bool
	 */
	private function searchKeyInArray($get, $key)
	{
		return in_array($key, $get);
	}

	/**
	 * Update hit
	 *
	 * @param int $hit
	 * @param int $article_srl
	 * @return bool
	 */
	private function updateHit($article_srl)
	{
		$result = self::callApi('/articles/'.$article_srl.'/update', (object)[ 'type' => 'hit' ]);
		if ($result->hit)
		{
			// writing cookie
			setCookieKey('redgoose-hit-'.(int)$article_srl, 7);
			return ($result == 'success');
		}
		else
		{
			return false;
		}
	}

	/**
	 * thumbnail size to class name
	 *
	 * @param array $size
	 * @return string
	 */
	private function thumbnailSizeToClassName($size)
	{
		// TODO: 작업예정
//		$largeSize = explode(',', __THUMBNAIL_LARGE_SIZE__);
//		$sizeName = (in_array($size['width'], $largeSize) ? ' wx2' : '') . (in_array($size['height'], $largeSize) ? ' hx2' : '');
		return trim('');
	}

	/**
	 * call api
	 *
	 * @param string $url
	 * @param object $params
	 * @return object|array
	 */
	private function callApi($url, $params=null)
	{
		try
		{
			$params = $params ? '?'.http_build_query($params) : '';
			$res = file_get_contents(__GOOSE_ROOT__.$url.$params, false, $this->api);
			$res = json_decode($res);
			if (!$res->success) throw new Exception($res->message);
			return $res->data;
		}
		catch(Exception $e)
		{
			return null;
		}
	}

	/**
	 * Index
	 *
	 * @param object $options
	 * @return object
	 */
	public function index($options=null)
	{
		try
		{
			// set result
			$result = (object)[
				'nest' => null,
				'categories' => null,
				'articles' => null,
				'pageNavigation' => null,
				'nextpage' => null,
			];

			// set print types
			$print = isset($options->print_data) ? explode(',', $options->print_data) : ['nest','category','article','nav_paginate','nav_more'];

			// get nest
			if ($options->nest_id)
			{
				$result->nest = self::callApi('/nests/id/'.$options->nest_id);

				if (!isset($result->nest->srl))
				{
					throw new Exception('not found nest data');
				}

				// get categories
				if (!!$result->nest->json->useCategory && $this->searchKeyInArray($print, 'category'))
				{
					$result->categories = self::callApi('/categories', (object)[
						'nest' => (int)$result->nest->srl,
						'field' => 'srl,name',
						'order' => 'turn',
						'sort' => 'asc',
						'ext_field' => 'count_article,item_all'
					]);
					$result->categories = $result->categories->index;
				}

				// correction categories
				if (count($result->categories))
				{
					$check_active = false;
					foreach($result->categories as $k=>$v)
					{
						if ($options->category_srl === (int)$v->srl)
						{
							$check_active = true;
							$result->categories[$k]->active = true;
							$result->category_name = $v->name;
							break;
						}
					}
					if (!$check_active)
					{
						$result->categories[0]->active = true;
					}
				}
			}

			// get articles
			$opts = (object)[];
			$opts->app = $options->app_srl;
			$nest_srl = ($options->nest_id) ? ((isset($result->nest->srl)) ? $result->nest->srl : -1) : null;
			if ($nest_srl) $opts->nest = $nest_srl;
			if ($options->category_srl) $opts->category = (int)$options->category_srl;
			$opts->field = 'srl,title,regdate,json';
			if ($options->keyword)
			{
				$opts->title = $options->keyword;
				$opts->content = $options->keyword;
			}
			$opts->size = $options->size;
			$opts->page = (isset($options->page) && $options->page > 1) ? $options->page : 1;
			$opts->order = 'srl';
			$opts->sort = 'desc';
			$start = ($opts->page - 1) * $options->size;
			$opts->limit = $start.','.($start + $options->size);

			// get articles
			$result->articles = self::callApi('/articles', $opts);

			// adjustment articles
			if ($result->articles && $result->articles->index && $this->searchKeyInArray($print, 'article'))
			{
				foreach ($result->articles->index as $k=>$v)
				{
					if (isset($v->regdate))
					{
						$result->articles->index[$k]->regdate_original = $v->regdate;
						$result->articles->index[$k]->regdate = Util::convertDate($v->regdate);
					}

					if (isset($v->json->thumbnail->sizeSet))
					{
						$result->articles->index[$k]->json->thumbnail->size = $this->thumbnailSizeToClassName($v->json->thumbnail->sizeSet);
					}
				}
			}

			// set more articles
			// 다음페이지에 글이 존재하는지 검사하고 있으면 다음 페이지 번호를 저장한다.
			// TODO: 작업예정
			if ($this->searchKeyInArray($print, 'nav_more'))
			{
//				$nextPaginate = new Paginate($total, $opts->page+1, $params, $options->size, $options->pageSize);
//				$limit = $nextPaginate->offset.','.$nextPaginate->size;
//				$nextArticles = Spawn::items([
//					'table' => Spawn::getTableName('article'),
//					'field' => 'srl',
//					'where' => $where,
//					'limit' => $limit,
//					'sort' => 'desc',
//					'order' => 'srl',
//				]);
//				$result->nextpage = (count($nextArticles)) ? $opts->page + 1 : null;
			}

			// set result data
			$result->currentPage = $opts->page;
			$result->nest = ($this->searchKeyInArray($print, 'nest')) ? $result->nest : null;
			$result->articles = $result->articles ? $result->articles->index : null;
			$result->state = 'success';

			return $result;
		}
		catch(Exception $e)
		{
			return (object)[
				'state' => 'error',
				'message' => $e->getMessage(),
			];
		}
	}

	/**
	 * Article
	 *
	 * @param object $options
	 * @return object
	 */
	public function article($options)
	{
		// check article_srl
		if (!$options->article_srl)
		{
			return (object)[
				'state' => 'error',
				'message' => 'not found article_srl'
			];
		}

		// get article data
		$article = self::callApi('/articles/'.$options->article_srl, (object)[
			'field' => $options->field ? $options->field : ''
		]);
		if (!$article)
		{
			return (object)[
				'state' => 'error',
				'message' => 'not found article data'
			];
		}

		// convert date
		$article->regdate = Util::convertDate($article->regdate);
		$article->modate = Util::convertDate($article->modate);

		// convert content
		require_once(__PWD__.'vendor/parsedown/Parsedown.php');
		$parseDown = new Parsedown();
		$article->content = $parseDown->text($article->content);

		// get nest data
		$nest = self::callApi('/nests/'.(int)$article->nest_srl, (object)[
			'field' => 'srl,name,id,json'
		]);

		// get category
		$category = !!$article->category_srl ? self::callApi('/categories/'.$article->category_srl, (object)[
			'field' => 'name',
		]) : null;

		return (object)[
			'state' => 'success',
			'article' => $article,
			'nest' => isset($nest) ? (object)$nest : null,
			'category' => isset($category) ? (object)$category : null,
			'anotherArticle' => (object)[
				'prev' => null,
				'next' => null,
			],
			'checkUpdateHit' => ($options->updateHit) ? ($this->updateHit((int)$options->article_srl)) : null,
		];
	}

	/**
	 * Up like
	 *
	 * @param object $options : [article_srl, header_key]
	 * @return object
	 */
	public function upLike($options)
	{
		// check `article_srl` value
		if (!$options->article_srl)
		{
			return (object)[
				'state' => 'error',
				'message' => 'not found article_srl'
			];
		}

		$result = self::callApi(
			'/articles/'.$options->article_srl.'/update',
			(object)[ 'type' => 'star' ]
		);

		// save cookie
		setCookieKey('redgoose-like-'.(int)$options->article_srl, 7);

		// return
		return ($result->star) ? (object)[
			'state' => 'success',
			'data' => [
				'srl' => $options->article_srl,
				'like' => (int)$result->star
			],
			'message' => 'update complete',
		] : (object)[
			'state' => 'error',
			'message' => 'fail update complete',
		];
	}

}