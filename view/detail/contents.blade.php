@section('contents')
	<article class="article-view" id="articleView">
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
			@if($onLike)
			<span class="on-like" title="on like">
				<img src="{{ __ROOT__ }}/assets/img/ico-heart-on.svg" alt="">
				<em>{{ $repo['article']['json']['like'] or 0 }}</em>
			</span>
			@else
			<a href="{{ __ROOT__ }}/upLike/{{ $repo['article']['srl'] }}/" class="on-like" title="on like">
				<img src="{{ __ROOT__ }}/assets/img/ico-heart.svg" alt="">
				<em>{{ $repo['article']['json']['like'] or 0 }}</em>
			</a>
			@endif
		</nav>

		<nav class="external-control">
			@if($repo['anotherArticle']['prev'])
			<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo['anotherArticle']['prev']['srl'] }}/" class="direction prev">
				<img src="{{ __ROOT__ }}/assets/img/btn-arrow-left2.svg" alt="prev article">
			</a>
			@endif
			@if($repo['anotherArticle']['next'])
			<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo['anotherArticle']['next']['srl'] }}/" class="direction next">
				<img src="{{ __ROOT__ }}/assets/img/btn-arrow-right2.svg" alt="next article">
			</a>
			@endif
			@if($_GET['popup'])
			<button type="button" data-action="close" class="close">
				<img src="{{ __ROOT__ }}/assets/img/btn-close2.svg" alt="close">
			</button>
			@endif
		</nav>
	</article>
@endsection