<?php
if(!defined("__GOOSE__")){exit();}
?>
<!doctype html>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<main>
	<!-- Header -->
	<header class="layout-header">
		<div class="layout-header__body">
			<h1 class="logo layout-header__logo">
				<a href="{{ __ROOT__ }}/" title="{{ $pref->meta['title'] }}">
					<img src="{{ __ROOT__ }}/assets/img/img-logo.svg" alt="{{ $pref->meta['title'] }}" width="100"/>
				</a>
			</h1>
			<nav class="layout-header__side layout-header__side-left">
				<button type="button" class="toggle-gnb" title="Toggle menu">
					<span><i></i></span>
				</button>
			</nav>
		</div>
		<nav class="gnb layout-header__gnb">
			<ul class="gnb__dep-1">
				@foreach($pref->nav as $item)
				<li{!! ($_page == $item['name']) ? ' class="active"' : '' !!}>
					<a href="{{ $item['ext'] ? $item['url'] : __ROOT__.$item['url'] }}" target="{{ $item['target'] }}">
						{{ $item['name'] }}
					</a>
					@if(count($item['child']))
					<div class="gnb__children">
						<ul class="gnb__dep-2">
							@foreach($item['child'] as $item2)
							<li{!! ($_nest && ($_nest == $item2['name'] || $_nest == $item2['id'])) ? ' class="active"' : '' !!}>
								<a href="{{ $item2['ext'] ? $item2['url'] : __ROOT__.$item2['url'] }}">{{ $item2['name'] }}</a>
							</li>
							@endforeach
						</ul>
					</div>
					@endif
				</li>
				@endforeach
			</ul>
		</nav>
	</header>
	<!-- // Header -->

	<!-- Container -->
	<div class="container">
		@yield('contents')
	</div>
	<!-- // Container -->

	<!-- Footer -->
	<footer class="layout-footer">
		<p class="layout-footer__copyright">{{ $pref->copyright }}</p>
	</footer>
	<!-- // Footer -->
</main>

@yield('popup')

<script src="{{__ROOT__}}/dist/vendors/jquery.min.js"></script>
<script src="{{__ROOT__}}/dist/vendors/masonry.pkgd.min.js"></script>
<script src="{{__ROOT__}}/dist/redgoose.js"></script>
@yield('script')
</body>
</html>