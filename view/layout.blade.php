<?php
if(!defined("__GOOSE__")){exit();}
?>
<!doctype html>
<html lang="ko">
<head>
@include('head')
</head>
<body>
<main>
	<header class="layout-header">
		<h1>
			<a href="{{ __ROOT__ }}/">
				<img src="{{ __ROOT__ }}/assets/img/img-logo.svg" alt="{{ $pref->meta['title'] }}" width="82"/>
			</a>
		</h1>
		<nav class="navigation layout-header__nav" id="layoutNavigation">
			<ul class="dep-1">
				@foreach($pref->nav as $item)
				<li{!! ($_page == $item['name']) ? ' class="active"' : '' !!}>
					<a href="{{ $item['ext'] ? $item['url'] : __ROOT__.$item['url'] }}" target="{{ $item['target'] }}">
						{{ $item['name'] }}
					</a>
					@if(count($item['child']))
					<div>
						<ul class="dep-2">
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

	<div class="container">
		@yield('contents')
	</div>

	<footer class="layout-footer">
		<p class="layout-footer__copyright">{{ $pref->copyright }}</p>
	</footer>
</main>

@yield('popup')

<script src="{{__ROOT__}}/dist/vendors/jquery.min.js"></script>
<script src="{{__ROOT__}}/dist/redgoose.js"></script>
@yield('script')
</body>
</html>