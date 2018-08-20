<?php
if(!defined("__GOOSE__")){exit();}


class API {

	public $ajax;

	public function __construct()
	{
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
	 * @param int $article_srl
	 * @return bool
	 */
	private function updateHit($article_srl)
	{
		$result = externalApi('/articles/'.$article_srl.'/update', (object)[ 'type' => 'hit' ]);
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
	 * @param string $size
	 * @return string
	 */
	private function thumbnailSizeToClassName($size)
	{
		if (!(isset($size) && $size)) return '';
		$sizeName = '';
		$arr = explode('*', $size);
		if ((int)$arr[0] === 2) $sizeName .= ' wx2';
		if ((int)$arr[1] === 2) $sizeName .= ' hx2';
		return trim($sizeName);
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
				$result->nest = externalApi('/nests/id/'.$options->nest_id);
				if (!isset($result->nest->srl))
				{
					throw new Exception('not found nest data', 500);
				}

				// get categories
				if (!!$result->nest->json->useCategory && $this->searchKeyInArray($print, 'category'))
				{
					$result->categories = externalApi('/categories', (object)[
						'nest' => (int)$result->nest->srl,
						'field' => 'srl,name',
						'order' => 'turn',
						'sort' => 'asc',
						'ext_field' => 'count_article,item_all'
					]);
				}

				// correction categories
				if ($result->categories && $result->categories->index && count($result->categories->index))
				{
					$result->categories = $result->categories->index;

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

			// set params for get articles
			$opts = (object)[];
			$opts->app = $options->app_srl;
			$nest_srl = ($options->nest_id) ? ((isset($result->nest->srl)) ? $result->nest->srl : -1) : null;
			if ($nest_srl) $opts->nest = $nest_srl;
			if ($options->category_srl) $opts->category = (int)$options->category_srl;
			$opts->field = $options->field ? $options->field : 'srl,title,regdate,json';
			if ($options->keyword)
			{
				$opts->title = $options->keyword;
				$opts->content = $options->keyword;
			}
			$opts->size = $options->size;
			$opts->page = (isset($options->page) && $options->page > 1) ? $options->page : 1;
			$opts->order = 'srl';
			$opts->sort = 'desc';
			$opts->ext_field = 'next_page';

			// call api for get articles
			$result->articles = externalApi('/articles', $opts);

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

					$result->articles->index[$k]->size_className = $this->thumbnailSizeToClassName($v->json->thumbnail ? $v->json->thumbnail->sizeSet : null);
				}
			}

			// set more articles
			// 다음페이지에 글이 존재하는지 검사하고 있으면 다음 페이지 번호를 저장한다.
			if ($this->searchKeyInArray($print, 'nav_more'))
			{
				$result->nextpage = $result->articles ? $result->articles->nextPage : null;
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
				'code' => $e->getCode(),
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
		$article = externalApi('/articles/'.$options->article_srl, (object)[
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
		$nest = externalApi('/nests/'.(int)$article->nest_srl, (object)[
			'field' => 'srl,name,id,json'
		]);

		// get category
		$category = !!$article->category_srl ? externalApi('/categories/'.$article->category_srl, (object)[
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

		$result = externalApi(
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