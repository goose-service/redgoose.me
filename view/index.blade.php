<?php
if(!defined("__GOOSE__")){exit();}

/** @var int $_nest */
/** @var int $_category */
/** @var object $repo */
?>

@extends('layout')

@section('contents')
<article class="index">
	<div class="index__wrap">
		@if($repo->nest)
		<header class="index__header">
			<h1>{{ $repo->nest['name'] }}</h1>
			@if($repo->category)
			<nav class="categories index__categories">
				<button type="button" title="toggle category index" class="categories__toggle">
					<img src="{{ __ROOT__ }}/assets/img/ico-arrow-down.svg" alt="">
					<span>Category</span>
				</button>
				@if(count($repo->category))
				<ul class="categories__index">
					@foreach($repo->category as $item)
					<li>
						<a href="{{ __ROOT__ }}/nest/{{ $_nest ? $_nest.'/' : '' }}{{ $item['srl'] ? $item['srl'].'/' : '' }}"{!! $item['active'] ? ' class="active"' : '' !!}>
							{{ $item['name'] }}({{ $item['count'] }})
						</a>
					</li>
					@endforeach
				</ul>
				@endif
			</nav>
			@endif
		</header>
		@endif

		<div class="index__articlesWrap">
			<div class="articles index__articles" id="articles">
				<div class="grid-sizer"></div>
				@foreach($repo->articles as $item)
				<div class="grid-item{{ $item['size_className'] ? ' '.$item['size_className'] : '' }}">
					<a href="{{__ROOT__}}/article/{{$_nest ? $_nest.'/' : ''}}{{$item['srl']}}/" data-srl="{{$item['srl']}}" title="{{$item['title']}}">
						<figure style="background-image: url('{{ __GOOSE_ROOT__ }}/{{ $item['json']['thumbnail']['url'] }}')">
							{{ $item['title'] }}
						</figure>
					</a>
				</div>
				@endforeach
			</div>
		</div>

		@if($repo->nextpage)
		<?php
		$address = (($_nest) ? 'nest/' . $_nest . '/' : '') . (($_nest && $_category) ? $_category . '/' : '');
		?>
		<nav class="loadMore index__loadMore">
			<a href="{{ __ROOT__ }}/{{ $address }}?page={{ $repo->nextpage }}" data-next="{{ $repo->nextpage }}" title="load more articles">
				<img src="{{ __ROOT__ }}/assets/img/ico-loadMore.svg" width="24" alt="plus"/>
			</a>
		</nav>
		@endif
	</div>
</article>
@endsection

@section('popup')
<div class="popupArticle" id="popupArticle"></div>
@endsection

@section('script')
<script>
var redgoose = new Redgoose({
	root: '{{ __ROOT__ }}',
	gooseRoot: '{{ __GOOSE_ROOT__ }}',
	title: '{{ $pref->meta['title'] }}',
	dev: !!'{{ DEBUG }}',
});
redgoose.header.init();
redgoose.index.init({
	nest_srl: '{{ $_nest }}',
	category_srl: '{{ $_category }}',
	size: parseInt('{{ __DEFAULT_ITEM_COUNT__ }}'),
});
</script>
@endsection

@section('meta')
<meta property="og:description" content="{{ $pref->meta['description'] }}">
@if ($appPref->isUserIcons)
<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/vendor/icons--user/redgoose_512x512x32.png">
@endif
@endsection