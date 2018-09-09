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
	 */
	static public function error($error)
	{
		// debug
		if (getenv('USE_DEBUG') === '1')
		{
			self::console((object)[
				'message' => $error->getMessage(),
				'code' => $error->getCode(),
			]);
		}

		// TODO: print error page
		switch ($error->getCode())
		{
			case 404:
				var_dump('Not found page');
				break;
			case 500:
			default:
				var_dump('Service error');
				break;
		}
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
				$size = '';
				if ($item->json->thumbnail->sizeSet)
				{
					$size = explode('*', $item->json->thumbnail->sizeSet);
					$size[0] = $size[0] ? 'w'.$size[0] : '';
					$size[1] = $size[1] ? 'h'.$size[1] : '';
					$size = implode(' ', $size);
				}

				$result[] = (object)[
					'srl' => (int)$item->srl,
					'title' => $item->title,
					'image' => $item->json->thumbnail->path,
					'className' => $size,
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

}
