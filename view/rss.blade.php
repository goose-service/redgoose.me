<?='<?xml version="1.0" encoding="utf-8"?>'?>
<?php
/**
 * @var string $url
 * @var string $title
 * @var string $description
 * @var string $link
 * @var string $copyright
 * @var array $articles
 */
?>


<rss version="2.0" xmlns:atom=“http://www.w3.org/2005/Atom”>
  <channel>
    <title>{{ $title }}</title>
    <description>{{ $description }}</description>
    <link>{{ $url }}</link>
    <language>ko-kr</language>
    <copyright>Copyright 2013-{{date('Y')}} redgoose. All right reserved.</copyright>
    <webMaster>scripter@me.com (redgoose)</webMaster>
    @if(isset($articles) && count($articles))
    @foreach($articles as $item)
    <item>
      <title><![CDATA[{!! $item->title !!}]]></title>
      <link>{{ $url }}/article/{{ $item->srl }}/</link>
      <guid>{{ $url }}/article/{{ $item->srl }}/</guid>
      <description>
        <![CDATA[{!! $item->content !!}]]>
      </description>
      <pubDate>{{ $item->date }}</pubDate>
    </item>
    @endforeach
    @endif
    <atom:link href="{{ $url }}/rss" rel="self" type="application/rss+xml" />
  </channel>
</rss>