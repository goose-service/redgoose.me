<?php
namespace Core;
use Exception, redgoose\Paginate, redgoose\Console;

/**
 * Util
 */

class Util {

  /**
   * error
   *
   * @param Exception $error
   * @param Blade $blade
   */
  static public function error($error, $blade)
  {
    // debug
    if (getenv('USE_DEBUG') === '1')
    {
      Console::log((object)[
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

    try
    {
      // render
      $blade->render('error', (object)[
        'title' => getenv('TITLE'),
        'message' => $message,
      ]);
    }
    catch(Exception $e)
    {}
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
    if (!(isset($index) && count($index))) return null;

    $result = [];
    foreach ($index as $key=>$item)
    {
      $obj = (object)[];
      if ($item->json)
      {
        $obj->srl = (int)$item->srl;
        $obj->title = $item->title === '.' ? 'untitled work' : $item->title;
        $obj->image = $item->json->thumbnail->path;
        if ($item->category_name) $obj->categoryName = $item->category_name;
        if ($item->nest_name) $obj->nestName = $item->nest_name;
        if ($item->styleType) $obj->styleType = $item->styleType;
        if ($item->order) $obj->regdate = $item->order;
        $result[] = $obj;
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

  /**
   * set header
   *
   * @param string $type
   */
  static public function setHeader($type=null)
  {
    switch($type)
    {
      case 'xml':
        header('Content-Type:application/rss+xml; charset=utf-8');
        break;
      case 'rss':
        header("Content-Type: application/rss+xml; charset=utf-8");
        header('Content-Type: text/xml; charset=utf-8');
        break;
      case 'json':
        header('Content-Type:application/json,text/plane; charset=utf-8');
        break;
      case 'text':
        header('Content-Type:text/plain; charset=utf-8');
        break;
      default:
        header('Content-Type:text/html; charset=utf-8');
        break;
    }
  }
}
