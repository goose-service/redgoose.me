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
		<button type="button" title="On like" id="toggleLike" data-srl="{{$_article}}" class="onLike{{!!$onLike ? ' onLike-on' : ''}}">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="129.184 102.606 25.632 23.517" class="onLike__icon">
				<path d="M13,24.123l-1.858-1.692C4.542,16.446.184,12.5.184,7.655A6.981,6.981,0,0,1,7.233.606,7.673,7.673,0,0,1,13,3.285,7.676,7.676,0,0,1,18.767.606a6.981,6.981,0,0,1,7.049,7.049c0,4.844-4.358,8.791-10.958,14.789Z" transform="translate(129 102)"/>
			</svg>
			<em>{{ $repo->article->json['like'] or 0 }}</em>
		</button>
	</nav>
	<nav class="external-control">
		@if(getParam('mode') !== 'row')
			@if($repo->anotherArticle->prev)
			<span class="direction direction-prev">
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->prev['srl'] }}/" data-srl="{{ $repo->anotherArticle->prev['srl'] }}" id="goToPrevArticle">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-left.svg" width="20" alt="Prev article"/>
				</a>
			</span>
			@endif
			@if($repo->anotherArticle->next)
			<span class="direction direction-next">
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->next['srl'] }}/" data-srl="{{ $repo->anotherArticle->next['srl'] }}" id="goToNextArticle">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-right.svg" width="20" alt="Next article"/>
				</a>
			</span>
			@endif
		@endif

		<button type="button" id="closeArticle" title="Close article" class="close">
			<img src="{{ __ROOT__ }}/assets/img/ico-close.svg" class="close__ico-pc" alt="close"/>
			<img src="{{ __ROOT__ }}/assets/img/ico-close2.svg" class="close__ico-mobile" alt="close"/>
		</button>
	</nav>
	@endif

</article>
@endsection