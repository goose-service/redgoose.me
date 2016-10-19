<!doctype html>
<html lang="ko">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0">
	<title>{{ $title }}</title>

	<meta name="google-site-verification" content="{{ $pref['googleVerify'] }}" />
	<meta name="p:domain_verify" content="{{ $pref['pinterestVerify'] }}">

	<meta name="author" content="{{ $pref['meta']['author'] }}">
	<meta name="keywords" content="{{ $pref['meta']['keywords'] }}">
	<meta name="description" content="{{ $pref['meta']['description'] }}">
	<link rel="canonical" href="{{ $pref['meta']['domain'] }}">

	<meta property="og:title" content="{{ $appPref->og->title or $title }}">
	<meta property="og:site_name" content="{{ $pref['meta']['title'] }}">
	<meta property="og:url" content="{{ $pref['meta']['domain'] }}" />
	<meta property="og:description" content="{{ $appPref->og->description or $pref['meta']['description'] }}">
	<meta property="og:locale" content="ko_KR" />
	@if($appPref->og->image)
	<meta property="og:image" content="{{ $appPref->og->image }}">
	@endif

	@if ($appPref->isUserIcons)
	<link rel="shortcut icon" href="{{ __GOOSE_ROOT__ }}/vendor/icons--user/favicon.ico">
	<link rel="icon" type="image/x-icon" href="{{ __GOOSE_ROOT__ }}/vendor/icons--user/redgoose_256x256x32.png">
	<link rel="apple-touch-icon" href="{{ __GOOSE_ROOT__ }}/vendor/icons--user/redgoose_app_256x256x32.png">
	@endif

	<link rel="stylesheet" href="{{ __GOOSE_ROOT__ }}/vendor/Parsedown/markdown.css">
	<link rel="stylesheet" href="{{ __ROOT__ }}/assets/dist/css/app.css" media="all">
</head>
<body>
<main>
	<header class="layout-header">
		<h1>
			<a href="{{ __ROOT__ }}/">
				<img src="{{ __ROOT__ }}/assets/img/logo.svg" alt="{{ $pref['meta']['title'] }}">
			</a>
		</h1>
		<nav class="navigation" id="navigation">
			<ul class="dep-1">
				@foreach($pref['nav'] as $item)
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
		@yield('header-user-action')
		<nav class="button-user-action">
			<button type="button">
				<img src="{{ __ROOT__ }}/assets/img/btn-arrow-left.svg" alt="back">
			</button>
		</nav>
		<nav class="button-toggle-navigation">
			<button type="button" id="toggleNavigation">
				<img src="{{ __ROOT__ }}/assets/img/toggle-navigation.svg" alt="toggle navigation">
			</button>
		</nav>
	</header>

	<div class="container">
		@yield('contents')
	</div>

	<footer class="layout-footer">
		<p class="copyright">{{ $pref['copyright'] }}</p>
	</footer>
</main>

@yield('popup')

<script src="{{ __ROOT__ }}/assets/dist/js/vendor.js"></script>
<script src="{{ __ROOT__ }}/assets/dist/js/app.js"></script>

@yield('script')
</body>
</html>