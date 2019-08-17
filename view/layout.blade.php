<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}
?>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<h1 class="page-title">{{$pageTitle}}</h1>
</body>
<main>
	<header class="layout-header">{{--on-menu--}}
		<div class="layout-header__wrap">
			<div class="layout-header__logo">
				<a href="{{__ROOT__}}/">
					<img src="{{__ROOT__}}/assets/images/ico-logo@2x.png" alt="redgoose">
				</a>
			</div>
			<nav class="layout-header__buttons">
				<button type="button" title="toggle menu" class="button--menu">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path fill="currentColor" fill-rule="nonzero" d="M3 18h18v-2H3v2zm0-5h10v-2H3v2zm0-7v2h14V6H3z"/>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					</svg>
				</button>
			</nav>
			<nav class="layout-header__menus">
				<ul>
					<li>
						<a href="/nest/visual/"><span>Works</span></a>
						<div>
							<ol>
								<li{!!$nest_id === 'visual' ? ' class="on"' : ''!!}>
									<a href="/nest/visual/">Visual</a>
								</li>
								<li{!!$nest_id === 'tool' ? ' class="on"' : ''!!}>
									<a href="/nest/tool/">Tool & Service</a>
								</li>
							</ol>
						</div>
					</li>
					<li>
						<a href="/nest/landscape/"><span>Photos</span></a>
						<div>
							<ol>
								<li{!!$nest_id === 'landscape' ? ' class="on"' : ''!!}>
									<a href="/nest/landscape/">Landscape</a>
								</li>
								<li{!!$nest_id === 'portrait' ? ' class="on"' : ''!!}>
									<a href="/nest/portrait/">Portrait</a>
								</li>
								<li{!!$nest_id === 'snap' ? ' class="on"' : ''!!}>
									<a href="/nest/snap/">Snap</a>
								</li>
								<li{!!$nest_id === 'composition' ? ' class="on"' : ''!!}>
									<a href="/nest/composition/">Composition</a>
								</li>
								<li{!!$nest_id === 'foreign-countries' ? ' class="on"' : ''!!}>
									<a href="/nest/foreign-countries/">Foreign countries</a>
								</li>
							</ol>
						</div>
					</li>
					<li>
						<a href="/page/about/"><span>About</span></a>
					</li>
					<li>
						<a href="https://note.redgoose.me" target="_blank"><span>Note</span></a>
					</li>
				</ul>
			</nav>
		</div>
	</header>
	<div class="container">
		@yield('contents')
	</div>
	<footer class="layout-footer">
		<p class="layout-footer__copyright">Copyright 2013-{{date('Y')}} redgoose. All right reserved.</p>
	</footer>
</main>
@yield('script')
</body>
</html>
