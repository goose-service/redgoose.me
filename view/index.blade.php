<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $index */
/** @var int $nextPage */
?>

@extends('layout')

@section('contents')
<article class="index">
	<header class="indexHeader index__header">
		<h1>Newstest works</h1>
	</header>

	<div class="indexWorks index__works">
		@if (true)
			<ul>
				@foreach($index as $k=>$item)
					<li>
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
	<ul>
		<li>// TODO: load jquery</li>
		<li>// TODO: load masonry</li>
		<li>// TODO: load control index script</li>
	</ul>
@endsection