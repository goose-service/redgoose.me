<!doctype html>
<html lang="ko">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
	<title>{{ $title }}</title>

	<meta name="google-site-verification" content="{{ $pref['googleVerify'] }}" />
	<meta name="p:domain_verify" content="{{ $pref['pinterestVerify'] }}">

	<meta name="author" content="{{ $pref['meta']['author'] }}">
	<meta name="keywords" content="{{ $pref['meta']['keywords'] }}">
	<meta name="description" content="{{ $pref['meta']['description'] }}">
	<link rel="canonical" href="http://{{ $_SERVER['HTTP_HOST'] }}{{ $_SERVER['REQUEST_URI'] }}">

	@yield('meta')

	<meta property="og:title" content="{{ $title }}">
	<meta property="og:site_name" content="{{ $pref['meta']['title'] }}">
	<meta property="og:url" content="http://{{ $_SERVER['HTTP_HOST'] }}{{ $_SERVER['REQUEST_URI'] }}" />
	<meta property="og:locale" content="ko_KR" />
	<meta property="fb:app_id" content="1619661748331088" />

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
	<div class="container">
		@yield('contents')
	</div>
</main>

<script>
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-42563094-1', 'redgoose.me');
ga('send', 'pageview');
</script>
</body>
</html>
