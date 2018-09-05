<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>{{ $title }}</title>
<meta name="author" content="{{ $pref->meta->author }}"/>
<meta name="keywords" content="{{ $pref->meta->keywords }}"/>
<meta name="description" content="{{ $pref->meta->description }}"/>
<link rel="canonical" href="http://{{ $_SERVER['HTTP_HOST'] }}{{ $_SERVER['REQUEST_URI'] }}"/>
@yield('meta')
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:site_name" content="redgoose"/>
<meta property="og:url" content="http://{{ $_SERVER['HTTP_HOST'] }}{{ $_SERVER['REQUEST_URI'] }}"/>
<meta property="og:locale" content="ko_KR"/>
<meta property="fb:app_id" content="1619661748331088"/>
<meta name="google-site-verification" content="{{ $pref->googleVerify }}"/>
<meta name="p:domain_verify" content="{{ $pref->pinterestVerify }}"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="light"/>

<link rel="shortcut icon" href="{{ __GOOSE_ROOT__ }}/usr/icons/favicon.ico"/>
<link rel="icon" type="image/x-icon" href="{{ __GOOSE_ROOT__ }}/usr/icons/redgoose_256x256x32.png"/>
<link rel="apple-touch-icon" href="{{ __GOOSE_ROOT__ }}/usr/icons/redgoose_app_256x256x32.png"/>
<link rel="apple-touch-startup-image" href="{{ __GOOSE_ROOT__ }}/usr/icons/redgoose_app_256x256x32.png"/>

<link rel="stylesheet" href="{{ __ROOT__ }}/dist/redgoose.css" media="screen"/>
<link rel="manifest" href="/manifest.json"/>

<script async src="https://www.googletagmanager.com/gtag/js?id=UA-42563094-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-42563094-1');
</script>
