<?='<?xml version="1.0" encoding="utf-8"?>'?>

<rss version="2.0">
	<channel>
		<title>{{ $pref['meta']['title'] }}</title>
		<description>{{ $pref['meta']['description'] }}</description>
		<link>{{ $pref['meta']['domain'] }}</link>
		<language>ko-kr</language>
		<copyright>{{ $pref['copyright'] }}</copyright>
		@foreach($articles as $article)
		<item>
			<title>{{ $article['title'] }}</title>
			<link>{{ __URL__ }}/article/{{ $article['srl'] }}/</link>
			<description>
				<![CDATA[
					{!! $article['content'] !!}
				]]>
			</description>
			<pubDate>{{ $article['date'] }}</pubDate>
		</item>
		@endforeach
	</channel>
</rss>