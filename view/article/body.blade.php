@section('contents')
<article class="article" id="article">
	<header class="article__header">
		<p>
			@if($repo->nest->name)<span>{{ $repo->nest->name }}</span>@endif
			@if($repo->category->name)<span>{{ $repo->category->name }}</span>@endif
		</p>
		<h1>{{ ($repo->article->title == '.') ? 'Untitled article' : $repo->article->title }}</h1>
	</header>

	@if($repo->article->json['mode'] === 'markdown')
	<div class="article__body article-body-markdown">{!! $repo->article->content !!}</div>
	@else
	<div class="article__body article-body-basic">{!! $repo->article->content !!}</div>
	@endif

	@if (!getParam('hud') || (getParam('hud') && getParam('hud') == 1))
	<nav class="article__control">
		<button type="button" title="On like" id="toggleLike" class="onLike{{!!$onLike ? ' onLike-on' : ''}}">
			<img src="{{ __ROOT__ }}/assets/img/ico-heart.svg" width="30" alt="">
			<em>{{ $repo->article->json['like'] or 0 }}</em>
		</button>
	</nav>
	<nav class="external-control">
		@if(getParam('mode') !== 'row')
			@if($repo->anotherArticle->prev)
			<span class="direction direction-prev">
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->prev['srl'] }}/" id="goToPrevArticle">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-left.svg" width="20" alt="Prev article"/>
				</a>
			</span>
			@endif
			@if($repo->anotherArticle->next)
			<span class="direction direction-next">
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->next['srl'] }}/" id="goToNextArticle">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-right.svg" width="20" alt="Next article"/>
				</a>
			</span>
			@endif
		@endif
		<button type="button" id="closeArticle" class="close">
			<img src="{{ __ROOT__ }}/assets/img/ico-close.svg" width="20" alt="close"/>
		</button>
	</nav>
	@endif

</article>
@endsection