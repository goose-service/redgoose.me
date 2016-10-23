@extends('layout')


@section('contents')
<article class="content-index">
	<header>
		<h1>{{ $repo['nest']['name'] or 'Newstest' }}</h1>
		@if($repo['category'])
		<nav class="category-index">
			<button type="button" class="button-toggle-category" id="toggleCategory">
				<img src="{{ __ROOT__ }}/assets/img/ico-hamburger.svg" alt="">
				<span>Category</span>
			</button>
			@if(count($repo['category']))
			<ul id="categoryIndex">
				@foreach($repo['category'] as $item)
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

	<div class="article-index" id="articleIndex">
		<div class="grid-sizer"></div>
		@foreach($repo['articles'] as $item)
			<div class="grid-item{{ $item['size_className'] ? ' '.$item['size_className'] : '' }}">
				<a href="{{ __ROOT__ }}/article/{{ $_nest ? $_nest.'/' : '' }}{{ $item['srl'] }}/">
					<figure style="background-image: url('{{ __GOOSE_ROOT__ }}/{{ $item['json']['thumbnail']['url'] }}')">
						{{ $item['title'] }}
					</figure>
				</a>
			</div>
		@endforeach
	</div>

	@if($repo['nextpage'])
	<?php
	$loadAddr = (($_nest) ? 'nest/' . $_nest . '/' : '') . (($_nest && $_category) ? $_category . '/' : '');
	?>
	<nav class="load-more-item" id="moreItem">
		<a href="{{ __ROOT__ }}/{{ $loadAddr }}?page={{ $repo['nextpage'] }}">
			<img src="{{ __ROOT__ }}/assets/img/more-item.svg" alt="more load item">
		</a>
	</nav>
	@endif
</article>
@endsection

@section('popup')
<div class="popup-view" id="popupView"></div>
@endsection

@section('script')
<script>
var app = new window.APP({
	root : '{{ __ROOT__ }}',
	gooseRoot : '{{ __GOOSE_ROOT__ }}'
});

setTimeout(function(){
	app.index({
		_nest : '{{ $_nest }}',
		_category : parseInt('{{ $_category }}'),
		$articleIndex : $('#articleIndex'),
		$moreItemArea : $('#moreItem'),
	});
}, 10);
</script>
@endsection

@section('meta')
<meta property="og:description" content="{{ $pref['meta']['description'] }}">
<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/vendor/icons--user/redgoose_512x512x32.png">
@endsection