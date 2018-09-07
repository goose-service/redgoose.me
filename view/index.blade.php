<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $index */
/** @var int $nextPage */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="붉은거위의 개인작업물 라이브러리. Redgoose personal work library"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="붉은거위의 개인작업물 라이브러리. Redgoose personal work library">
<meta property="og:image" content="{{ __API__ }}/usr/icons/redgoose_512x512x32.png">
@endsection

@section('contents')
<article class="index">
	<header class="indexHeader index__header">
		<h1>{{$pageTitle}}</h1>
	</header>

	<div class="indexWorks index__works">
		@if ($index && count($index))
			<ul>
				@foreach($index as $k=>$item)
				<li class="{{$item->className}}">
					<a href="/articles/{{$item->srl}}" data-srl="{{$item->srl}}}">
						<img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
					</a>
				</li>
				@endforeach
			</ul>
		@else
			<p>.empty</p>
		@endif

		<nav class="indexWorks__more indexWorks__more--processing">
			<button type="button">
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
window.redgoose = new Redgoose('index');
</script>
@endsection
