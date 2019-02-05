<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $index */
/** @var int $nextPage */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ getenv('DESCRIPTION') }}">
<meta property="og:image" content="{{ __API__ }}/usr/icons/og-redgoose.jpg">
@endsection

@section('contents')
<article class="index">
	<header class="indexHeader index__header">
		<h2>{{$pageTitle}}</h2>
		@if (isset($categories) && count($categories))
			<nav class="indexCategories" id="categories">
				<button type="button" class="indexCategories__toggle">
					<img src="{{__ROOT__}}/assets/images/ico-arrow-down.svg" alt="icon">
					<span>Category</span>
				</button>
				<ul class="indexCategories__index">
					@foreach($categories as $k=>$item)
						<li{!!($category_srl === $item->srl || (!$category_srl && !$item->srl)) ? ' class="on"' : ''!!}>
							<a href="/nest/{{$nest_id}}{{$item->srl ? '/'.$item->srl : ''}}" data-srl="{{$item->srl}}">
								<span>{{$item->name}}</span><em>{{$item->count_article}}</em>
							</a>
						</li>
					@endforeach
				</ul>
			</nav>
		@endif
	</header>

	<div class="indexWorks index__works">
		<div class="loading indexWorks__loading" id="index_loading">
			<div class="loading__loader">
				<div class="loading__shadow"></div>
				<div class="loading__box"></div>
			</div>
		</div>
		<div id="index" class="indexWorks__index">
			<div class="indexWorks__sizer"></div>
			@if ($index && count($index))
				@foreach($index as $k=>$item)
					<div class="indexWorks__item{{$item->className ? ' '.$item->className : ''}}">
						<a href="/article/{{$item->srl}}" data-srl="{{$item->srl}}">
							<img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
						</a>
					</div>
				@endforeach
			@else
				<div class="indexEmpty indexWorks__empty">
					<img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
					<p>Not found work.</p>
				</div>
			@endif
		</div>

		<nav class="indexMore indexWorks__more {{!$nextPage ? 'indexMore--hide' : ''}}" id="index_button_more">
			<button type="button" data-page="{{$nextPage}}">
				<img src="{{__ROOT__}}/assets/images/ico-load-more.svg" alt="load more">
			</button>
		</nav>
	</div>
</article>
@endsection

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script src="{{__ROOT__}}/assets/vendor/masonry.pkgd.min.js"></script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
<script>
window.redgoose = new Redgoose('index', {
	title: '{{getenv('TITLE')}}',
	urlRoot: '{{__ROOT__}}',
	urlApi: '{{__API__}}',
	urlCookie: '{{getenv('PATH_COOKIE')}}',
	token: '{{getenv('TOKEN_PUBLIC')}}',
	size: parseInt('{{getenv('DEFAULT_INDEX_SIZE')}}'),
	app_srl: parseInt('{{getenv('DEFAULT_APP_SRL')}}'),
	nest_srl: parseInt('{{$nest_srl}}'),
	nest_id: '{{$nest_id}}',
	nest_name: '{{$pageTitle}}',
	category_srl: '{{$category_srl}}',
	category_name: '{{$category_name}}',
	page: '{{$page}}',
	debug: !!'{{getenv('USE_DEBUG')}}',
});
</script>
@endsection
