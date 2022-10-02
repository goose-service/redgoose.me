<?php
namespace Core;
use Parsedown;

/**
 * ParsedownExtension
 * 본문용 마크다운 파서 확장
 */
class ParsedownExtension extends Parsedown
{

  protected function inlineImage($excerpt): ?array
  {
    $image = parent::inlineImage($excerpt);
    if (!($image ?? false)) return null;
    $image['element']['attributes']['loading'] = 'lazy';
    return $image;
  }

  protected function blockHeader($line): ?array
  {
    $element = parent::blockHeader($line);
    if (!($element ?? false)) return null;
    $element['element']['attributes']['id'] = str_replace(' ', '-', strtolower($element['element']['text']));
    return $element;
  }

  protected function inlineUrl($Excerpt): ?array
  {
    $url = parent::inlineUrl($Excerpt);
    if (preg_match('/^http/', $url['element']['attributes']['href']) > 0)
    {
      $url['element']['attributes']['target'] = '_blank';
    }
    return $url;
  }

  protected function inlineLink($Excerpt): ?array
  {
    $type = (preg_match('/^!\[/', $Excerpt['context']) > 0) ? 'image': 'a';
    $link = parent::inlineLink($Excerpt);
    if ($type === 'a')
    {
      if (preg_match('/^http/', $link['element']['attributes']['href']) > 0)
      {
        $link['element']['attributes']['target'] = '_blank';
      }
    }
    return $link;
  }

}
