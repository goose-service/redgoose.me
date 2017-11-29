@section('contents')
<article class="article" id="article">
	<div class="article__wrap">
		<header>
			<p>
				@if($repo->nest->name)<span>{{ $repo->nest->name }}</span>@endif
				@if($repo->category->name)<span>{{ $repo->category->name }}</span>@endif
			</p>
			<h1>{{ ($repo->article->title == '.') ? 'Untitled article' : $repo->article->title }}</h1>
		</header>

		<div class="article__body">
			@if($repo->article->json['mode'] === 'markdown')
			<div class="article__body article__body-markdown">{!! $repo->article->content !!}</div>
			@else
			<div class="article__body article__body-basic">{!! $repo->article->content !!}</div>
			@endif
		</div>

		@if (!isset($_GET['hud']) || (isset($_GET['hud']) && $_GET['hud'] == 1))
		<nav class="article__control">
			<button type="button" title="On like" id="toggleLike" class="onLike{{!!$onLike ? ' onLike-on' : ''}}">
				<img src="{{ __ROOT__ }}/assets/img/ico-heart.svg" width="30" alt="">
				<em>{{ $repo->article->json['like'] or 0 }}</em>
			</button>
		</nav>
		<nav class="external-control">
			@if($_GET['mode'] !== 'row')
				@if($repo->anotherArticle->prev)
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->prev['srl'] }}/" id="goToPrevArticle" class="direction next">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-left.svg" width="20" alt="Prev article"/>
				</a>
				@endif
				@if($repo->anotherArticle->next)
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $repo->anotherArticle->next['srl'] }}/" id="goToNextArticle" class="direction prev">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-right.svg" width="20" alt="Next article"/>
				</a>
				@endif
			@endif
			@if($_GET['mode'] === 'popup')
			<button type="button" id="closeArticle" class="close">
				<img src="{{ __ROOT__ }}/assets/img/ico-close.svg" width="20" alt="close"/>
			</button>
			@endif
		</nav>
		@endif
	</div>

</article>
@endsection