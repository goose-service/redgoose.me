@extends('layout')


@section('contents')
<article class="article-view" id="photoView">
	<header>
		<p>
			@if($repo['nest']['name'])<span>{{ $repo['nest']['name'] }}</span>@endif
			@if($repo['category']['name'])<span>{{ $repo['category']['name'] }}</span>@endif
		</p>
		<h1>{{ $repo['article']['title'] }}</h1>
	</header>

	<div class="body">
		@if($repo['article']['json']['mode'] == 'markdown')
		<div class="markdown-body">{!!  $repo['article']['content'] !!}</div>
		@else
		<div class="basic-body">{!!  $repo['article']['content'] !!}</div>
		@endif
	</div>

	<nav class="control">
		<a href="#" class="on-like" title="on like">
			<img src="{{ __ROOT__ }}/assets/img/{{ $onLike ? 'ico-heart-on' : 'ico-heart' }}.svg" alt="">
			<em>{{ $repo['article']['json']['like'] or 0 }}</em>
		</a>
	</nav>

	<nav class="direction">
		@if($repo['anotherArticle']['prev'])
		<a href="{{ __ROOT__ }}/article/{{ $repo['anotherArticle']['prev']['srl'] }}/" class="prev">
			<img src="{{ __ROOT__ }}/assets/img/btn-arrow-left2.svg" alt="prev article">
		</a>
		@endif
		@if($repo['anotherArticle']['next'])
		<a href="{{ __ROOT__ }}/article/{{ $repo['anotherArticle']['next']['srl'] }}/" class="next">
			<img src="{{ __ROOT__ }}/assets/img/btn-arrow-right2.svg" alt="next article">
		</a>
		@endif
	</nav>
</article>
@endsection

@section('script')
<script>
jQuery(function($){
	var view = new window.View();
	console.log(view);
});
</script>
@endsection