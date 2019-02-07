<?php
namespace Core;
use Exception;

/**
 * Util
 */

class Util {

	/**
	 * request api interface
	 *
	 * @param string $url
	 * @param string $params
	 * @param string $method
	 * @param boolean $useExternalApi
	 * @return object
	 * @throws Exception
	 */
	static public function api($url, $params=null, $method='get', $useExternalApi=false)
	{
		try
		{
			$params = $params ? '?'.http_build_query($params) : '';

			// set prefix url
			$prefix = ($useExternalApi) ? '' : getenv('PATH_API');

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $prefix.$url.$params);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POST, ($method === 'post'));
			curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: ' . getenv('TOKEN_PUBLIC')]);
			$response = curl_exec($ch);
			$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);

			if (!$response)
			{
				throw new Exception('no response');
			}

			return json_decode($response);
		}
		catch(Exception $e)
		{
			return null;
		}
	}

	/**
	 * print console.log in javascript
	 *
	 * @param string|object|array|boolean $src
	 */
	static public function console($src=null)
	{
		try
		{
			$source = json_encode($src);
		}
		catch(Exception $e)
		{
			$source = 'Parsing error';
		}
		echo "<script>console.log(".$source.");</script>";
	}

	/**
	 * error
	 *
	 * @param Exception $error
	 * @param Blade $blade
	 * @throws Exception
	 */
	static public function error($error, $blade)
	{
		// debug
		if (getenv('USE_DEBUG') === '1')
		{
			self::console((object)[
				'message' => $error->getMessage(),
				'code' => $error->getCode(),
			]);
		}

		switch ($error->getCode())
		{
			case 404:
				$message = 'Not found page';
				break;
			case 500:
			default:
				$message = 'Service error';
				break;
		}

		// render
		$blade->render('error', (object)[
			'title' => getenv('TITLE'),
			'message' => $message,
		]);
		exit;
	}

	/**
	 * get page number
	 *
	 * @return int
	 */
	static public function getPage()
	{
		return (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;
	}

	/**
	 * get works data
	 *
	 * @param array $index
	 * @return array
	 */
	static public function getWorksData($index)
	{
		$result = [];

		foreach ($index as $key=>$item)
		{
			if ($item->json && $item->json->thumbnail)
			{
				$result[] = (object)[
					'srl' => (int)$item->srl,
					'title' => $item->title === '.' ? 'untitled work' : $item->title,
					'image' => $item->json->thumbnail->path,
					'categoryName' => $item->category_name,
					'nestName' => $item->nest_name,
				];
			}
		}

		return $result;
	}

	/**
	 * convert date
	 *
	 * @param string $date
	 * @return string
	 */
	static public function convertDate($date="00000000000000")
	{
		$result = '';
		$o = substr($date, 0, 8);
		$result .= substr($o, 0, 4)."-";
		$result .= substr($o, 4, 2)."-";
		$result .= substr($o, 6, 8);
		return $result;
	}

	/**
	 * content to short text
	 *
	 * @param string $con
	 * @param int $len
	 * @return string
	 */
	static public function contentToShortText($con, $len=120)
	{
		/**
		 * Cutting string
		 * 글자를 특정자수만큼 잘라준다.
		 *
		 * @param string $str 자를문자
		 * @param number $len 길이
		 * @param string $tail 꼬리에 붙는 문자
		 * @return string 잘려서 나온문자
		 */
		function bear3StrCut($str, $len, $tail="...")
		{
			$rtn = [];
			return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str;
		}

		if (!$con) return null;

		$con = trim( strip_tags($con) );

		$con = preg_replace('/\r\n|\r|\n|\t/', ' ', $con);
		$con = preg_replace('/"/', '\"', $con);
		$con = preg_replace("/'/", "\'", $con);
		$con = preg_replace("/&nbsp;/"," ", $con);
		$con = preg_replace("/  /"," ", $con);
		$con = bear3StrCut($con, $len);

		return $con;
	}

	/**
	 * check cookie key
	 *
	 * @param string $key
	 * @return bool
	 */
	static public function checkCookie($key='')
	{
		return isset($_COOKIE[$key]) ? true : false;
	}

	/**
	 * set cookie
	 *
	 * @param string $key
	 * @param string $value
	 * @param int $day
	 */
	static public function setCookie($key='', $value='1', $day=1)
	{
		setcookie(
			$key,
			$value,
			time() + 3600 * 24 * $day,
			getenv('PATH_COOKIE')
		);
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
	static public function makePagination($total, $page, $size, $params=[])
	{
		$instance_mobile = new Paginate($total, $page, $params, $size, 3);
		$instance_desktop = new Paginate($total, $page, $params, $size, 10);
		$result = (object)[
			'total' => $total,
			'page' => $page,
			'mobile' => $instance_mobile->createNavigation('mobile'),
			'desktop' => $instance_desktop->createNavigation('desktop'),
		];
		return $result;
	}
}
