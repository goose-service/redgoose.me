<?php
if(!defined("__GOOSE__")){exit();}

class API {

	public $goose, $ajax;
	//public $thumbnailSize = [ [230,230], [470,230], [230,470], [470,470] ];

	public function __construct()
	{
		global $goose;

		$this->goose = $goose;
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
	private function updateHit($hit, $article_srl)
	{
		$hit += 1;
		$result = core\Spawn::update([
			'table' => core\Spawn::getTableName('article'),
			'where' => 'srl=' . $article_srl,
			'data' => [
				'hit=' . $hit
			],
		]);

		setCookieKey('redgoose-hit-' . (int)$article_srl);

		return ($result == 'success');
	}

	/**
	 * thumbnail size to class name
	 *
	 * @params array $size
	 * @return string
	 */
	private function thumbnailSizeToClassName($size)
	{
		$largeSize = 470;
		$sizeName = (($size['width'] == $largeSize) ? ' wx2' : '') . (($size['height'] == $largeSize) ? ' hx2' : '');
		return trim($sizeName);
	}

	/**
	 * Index
	 *
	 * @param array $options
	 * @return array
	 */
	public function index($options)
	{
		$result = [
			'nest' => null,
			'category' => null,
			'articles' => null,
			'pageNavigation' => null,
			'nextpage' => null,
		];
		$print = explode(',', $options['print_data']);

		// get nests
		if ($options['nest_id'])
		{
			$result['nest'] = core\Spawn::item([
				'table' => core\Spawn::getTableName('nest'),
				'where' => 'id=\''.$options['nest_id'].'\'',
				'jsonField' => ['json'],
			]);
			if (!isset($result['nest']['srl']))
			{
				return [
					'state' => 'error',
					'message' => 'not found nest data',
				];
			}

			// get categories list
			if ($result['nest']['json']['useCategory'] && $this->searchKeyInArray($print, 'category'))
			{
				$result['category'] = core\Spawn::items([
					'table' => core\Spawn::getTableName('category'),
					'where' => 'nest_srl='.(int)$result['nest']['srl'],
					'field' => 'srl,name',
					'order' => 'turn',
					'sort' => 'asc',
				]);

				$cnt_all = core\Spawn::count([
					'table' => core\Spawn::getTableName('article'),
					'where' => 'app_srl='.$options['app_srl'].' and nest_srl='.(int)$result['nest']['srl'],
				]);

				if (count($result['category']))
				{
					$check_active = false;
					$index = [
						[ 'srl' => 0, 'name' => 'All', 'count' => $cnt_all, 'active' => false ]
					];
					foreach($result['category'] as $k=>$v)
					{
						$cnt = ($cnt_all > 0) ? core\Spawn::count([
							'table' => core\Spawn::getTableName('article'),
							'where' => 'category_srl='.(int)$v['srl']
						]) : 0;
						if ($options['category_srl'] == (int)$v['srl']) $check_active = true;
						$index[] = [
							'srl' => (int)$v['srl'],
							'name' => $v['name'],
							'count' => $cnt,
							'active' => ($options['category_srl'] == (int)$v['srl'])
						];
					}
					if (!$check_active)
					{
						$index[0]['active'] = true;
					}
					$result['category'] = $index;
				}
			}
		}

		// get articles
		// init paginate
		$options['page'] = ($options['page'] > 1) ? $options['page'] : 1;
		$count = $options['count'];
		$scale = $options['pageScale'];
		$params = [
			'keyword' => ($_GET['keyword']) ? $_GET['keyword'] : ''
		];

		$nest_srl = ($options['nest_id']) ? ((isset($result['nest']['srl'])) ? $result['nest']['srl'] : -1) : null;
		$where = 'app_srl='.$options['app_srl'];
		$where .= ($nest_srl) ? ' and nest_srl='.$nest_srl : '';
		$where .= ($options['category_srl']) ? ' and category_srl='.(int)$options['category_srl'] : '';
		$where .= ($_GET['keyword']) ? ' and (title LIKE "%'.$_GET['keyword'].'%" or content LIKE "%'.$_GET['keyword'].'%")' : '';

		// get total article
		$total = core\Spawn::count([
			'table' => core\Spawn::getTableName('article'),
			'where' => $where,
		]);

		// set paginate instance
		$paginate = new core\Paginate($total, $_GET['page'], $params, $count, $scale);

		// set limit
		$limit = $paginate->offset.','.$paginate->size;

		// get articles
		$result['articles'] = core\Spawn::items([
			'table' => core\Spawn::getTableName('article'),
			'field' => 'srl,nest_srl,category_srl,hit,json,regdate,title',
			'where' => $where,
			'limit' => $limit,
			'sort' => 'desc',
			'order' => 'srl',
			'jsonField' => ['json'],
		]);

		// adjustment articles
		if ($this->searchKeyInArray($print, 'article'))
		{
			//core\Util::console($this->thumbnailSize);
			foreach ($result['articles'] as $k=>$v)
			{
				if (isset($v['regdate'])) $result['articles'][$k]['regdate'] = core\Util::convertDate($v['regdate']);
				if (isset($v['modate'])) $result['articles'][$k]['modate'] = core\Util::convertDate($v['modate']);
				$result['articles'][$k]['size_className'] = $this->thumbnailSizeToClassName($v['json']['thumbnail']['size']);
			}
		}

		// set paginate
		if ($this->searchKeyInArray($print, 'nav_paginate'))
		{
			$result['pageNavigation'] = $paginate->createNavigationToObject();
		}

		// set nextpage
		if ($this->searchKeyInArray($print, 'nav_more'))
		{
			$nextPaginate = new core\Paginate($total, $options['page']+1, $params, $count, $scale);
			$limit = $nextPaginate->offset.','.$nextPaginate->size;
			$nextArticles = core\Spawn::items([
				'table' => core\Spawn::getTableName('article'),
				'field' => 'srl',
				'where' => $where,
				'limit' => $limit,
				'sort' => 'desc',
				'order' => 'srl',
			]);
			$result['nextpage'] = (count($nextArticles)) ? $options['page'] + 1 : null;
		}

		$result['currentpage'] = $options['page'];
		$result['nest'] = ($this->searchKeyInArray($print, 'nest')) ? $result['nest'] : null;
		$result['articles'] = ($this->searchKeyInArray($print, 'article')) ? $result['articles'] : null;
		$result['state'] = 'success';

		return $result;
	}

	/**
	 * View
	 *
	 * @param array $options
	 * @return array
	 */
	public function view($options)
	{
		if (!$options['article_srl']) return [ 'state' => 'error', 'message' => 'not found article_srl' ];

		// get article data
		$article = core\Spawn::item([
			'table' => core\Spawn::getTableName('article'),
			'where' => 'srl='.$options['article_srl'],
			'jsonField' => ['json']
		]);

		if (!$article) return [ 'state' => 'error', 'message' => 'not found article data' ];

		$article['regdate'] = core\Util::convertDate($article['regdate']);
		$article['modate'] = core\Util::convertDate($article['modate']);

		// set content type
		switch($article['json']['mode'])
		{
			case 'markdown':
				// load parsedown
				require_once(__GOOSE_PWD__ . 'vendor/Parsedown/Parsedown.class.php');

				// get instance parsedown
				$Parsedown = new Parsedown();

				// convert markdown
				$article['content'] = $Parsedown->text($article['content']);
				break;

			case 'text':
				$article['content'] = nl2br(htmlspecialchars($article['content']));
				break;
		}

		// set prev,next item
		$print_data = explode(',', $options['print_data']);
		$str = '';
		$str .= ($this->searchKeyInArray($print_data, 'nest')) ? 'nest_srl='.(int)$article['nest_srl'] : '';
		$str .= ($this->searchKeyInArray($print_data, 'category') && $article['category_srl']) ? ' and category_srl='.(int)$article['category_srl'] : '';
		$str .= ($str) ? ' and ' : ' app_srl='.$options['app_srl'].' and ';

		$prevItem = core\Spawn::item([
			'table' => core\Spawn::getTableName('article'),
			'field' => 'srl',
			'where' => $str.'srl<'.(int)$article['srl'],
			'order' => 'srl',
			'sort' => 'desc',
			'limit' => 1,
		]);
		$nextItem = core\Spawn::item([
			'table' => core\Spawn::getTableName('article'),
			'field' => 'srl',
			'where' => $str.'srl>'.(int)$article['srl'],
			'order' => 'srl',
			'limit' => 1,
		]);

		// get nest data
		$nest = core\Spawn::item([
			'table' => core\Spawn::getTableName('nest'),
			'field' => 'srl,name,id,json',
			'where' => 'srl='.(int)$article['nest_srl'],
			'jsonField' => ['json']
		]);

		// get category
		$category = ($article['category_srl']) ? core\Spawn::item([
			'table' => core\Spawn::getTablename('category'),
			'field' => 'name',
			'where' => 'srl='.(int)$article['category_srl'],
		]) : null;

		return [
			'state' => 'success',
			'article' => $article,
			'nest' => $nest,
			'category' => $category,
			'anotherArticle' => [
				'prev' => (isset($prevItem['srl'])) ? [ 'srl' => (int)$prevItem['srl'] ] : null,
				'next' => (isset($nextItem['srl'])) ? [ 'srl' => (int)$nextItem['srl'] ] : null,
			],
			'checkUpdateHit' => ($options['updateHit']) ? ($this->updateHit((int)$article['hit'], (int)$article['srl'])) : null,
		];
	}

	/**
	 * Up like
	 *
	 * @param array $options : [
	 *   article_srl
	 *   header_key
	 * ]
	 * @return array
	 */
	public function upLike($options)
	{
		if (!$options['article_srl']) return [ 'state' => 'error', 'message' => 'not found article_srl' ];
		$article = core\Spawn::item([
			'table' => core\Spawn::getTableName('article'),
			'where' => 'srl=' . (int)$options['article_srl'],
			'field' => 'srl,json',
			'jsonField' => ['json']
		]);
		if (!isset($article['json'])) return [ 'state' => 'error', 'message' => 'not found article data' ];

		$like = (isset($article['json']['like'])) ? ((int)$article['json']['like']) : 0;
		$article['json']['like'] = $like + 1;
		$json = core\Util::arrayToJson($article['json'], true);

		$result = core\Spawn::update([
			'table' => core\Spawn::getTableName('article'),
			'data' => [ 'json=\''.$json.'\'' ],
			'where' => 'srl=' . (int)$options['article_srl'],
		]);

		setCookieKey('redgoose-like-' . (int)$options['article_srl']);

		return ($result == 'success') ? [
			'state' => 'success',
			'data' => [
				'like' => (int)$article['json']['like']
			],
			'message' => 'update complete',
		] : [
			'state' => 'error',
			'message' => 'fail update complete',
		];
	}
}