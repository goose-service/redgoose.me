<?php
if(!defined("__GOOSE__")){exit();}

/** @var int $_nest */
/** @var int $_category */
/** @var object $repo */
?>

@extends('layout')

@section('contents')
<article class="index">
	@if($repo->nest)
	<header class="index__header">
		<h1>{{ $repo->nest['name'] }}</h1>
		@if($repo->category)
		<nav class="categories">
			<button type="button" class="button-toggle-category" id="toggleCategory">
				<img src="{{ __ROOT__ }}/assets/img/ico-arrow-down.svg" alt="">
				<span>Category</span>
			</button>
			@if(count($repo->category))
			<ul id="categories">
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

	<ul class="articles index__articles" id="articles">
		<li class="articles__sizer"></li>
		@foreach($repo->articles as $item)
		<li class="articles__item{{ $item['size_className'] ? ' '.$item['size_className'] : '' }}">
			<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $item['srl'] }}/">
				<figure style="background-image: url('{{ __GOOSE_ROOT__ }}/{{ $item['json']['thumbnail']['url'] }}')">
					{{ $item['title'] }}
				</figure>
			</a>
		</li>
		@endforeach
	</ul>

	@if($repo->nextpage)
	<?php
	$address = (($_nest) ? 'nest/' . $_nest . '/' : '') . (($_nest && $_category) ? $_category . '/' : '');
	?>
	<nav class="loadMore index__loadMore" id="loadMore">
		<a href="{{ __ROOT__ }}/{{ $address }}?page={{ $repo->nextpage }}">
			<img src="{{ __ROOT__ }}/assets/img/ico-loadMore.svg" alt="More load items" width="40"/>
		</a>
	</nav>
	@endif
</article>
@endsection

@section('popup')
<div class="popupArticle" id="popupArticle"></div>
@endsection

@section('script')
<script>
var app = null;
</script>
@endsection

@section('meta')
<meta property="og:description" content="{{ $pref->meta['description'] }}">
@if ($appPref->isUserIcons)
<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/vendor/icons--user/redgoose_512x512x32.png">
@endif
@endsection