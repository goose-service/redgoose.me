<?php
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $pageTitle */
/** @var array $index */
/** @var object $paginate */
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
	<header class="index__header">
		<h2>{{$pageTitle}}</h2>
		@if (isset($categories) && count($categories))
		<nav class="index__categories">
			<button type="button">
				<span>
					<em>Categories</em>
					<img src="{{__ROOT__}}/assets/images/ico-arrow-down.svg" alt="arrow">
				</span>
			</button>
			<nav>
				<ul>
					@foreach($categories as $k=>$item)
						<li{!!($category_srl === $item->srl || (!$category_srl && !$item->srl)) ? ' class="on"' : ''!!}>
							<a href="/nest/{{$nest_id}}{{$item->srl ? '/'.$item->srl : ''}}/" data-srl="{{$item->srl}}">
								<span>{{$item->name}}</span>
								@if ($item->srl)
									<em>{{$item->count_article}}</em>
								@endif
							</a>
						</li>
					@endforeach
				</ul>
			</nav>
		</nav>
		@endif
	</header>
	<div class="index__works">
		@if ($index && count($index))
			<ul>
				@foreach($index as $k=>$item)
					<li>
						<a href="/article/{{$item->srl}}/">
							<figure>
								<img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
							</figure>
							<div>
								<strong>{{$item->title}}</strong>
								@if (isset($item->nestName) || isset($item->categoryName))
									<span>
										@if (isset($item->nestName))
											<em>{{$item->nestName}}</em>
										@endif
										@if (isset($item->categoryName))
											<em>{{$item->categoryName}}</em>
										@endif
									</span>
								@endif
							</div>
						</a>
					</li>
				@endforeach
			</ul>
		@else
			<div class="empty">
				<img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
				<p>Not found work.</p>
			</div>
		@endif
		@if ($paginate->total > 0)
			<div class="index__paginate">
				{!! $paginate->mobile !!}
				{!! $paginate->desktop !!}
			</div>
		@endif
	</div>
</article>
@endsection

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
@endsection