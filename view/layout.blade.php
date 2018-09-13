<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}
?>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<main>
	<header class="header">
		<div class="header__wrap" id="gnb">
			<nav class="left">
				<ul>
					<li>
						<a href="/nest/visual"><span>Works</span></a>
						<div>
							<ol>
								<li{!!$nest_id === 'visual' ? ' class="on"' : ''!!}>
									<a href="/nest/visual">Visual</a>
								</li>
								<li{!!$nest_id === '3d' ? ' class="on"' : ''!!}>
									<a href="/nest/3d">3D</a>
								</li>
								<li{!!$nest_id === 'develop' ? ' class="on"' : ''!!}>
									<a href="/nest/develop">Develop</a>
								</li>
							</ol>
						</div>
					</li>
					<li>
						<a href="/nest/landscape"><span>Photos</span></a>
						<div>
							<ol>
								<li{!!$nest_id === 'landscape' ? ' class="on"' : ''!!}>
									<a href="/nest/landscape">Landscape</a>
								</li>
								<li{!!$nest_id === 'portrait' ? ' class="on"' : ''!!}>
									<a href="/nest/portrait">Portrait</a>
								</li>
								<li{!!$nest_id === 'snap' ? ' class="on"' : ''!!}>
									<a href="/nest/snap">Snap</a>
								</li>
								<li{!!$nest_id === 'composition' ? ' class="on"' : ''!!}>
									<a href="/nest/composition">Composition</a>
								</li>
								<li{!!$nest_id === 'foreign' ? ' class="on"' : ''!!}>
									<a href="/nest/foreign">Foreign countries</a>
								</li>
								<li{!!$nest_id === 'cosplay' ? ' class="on"' : ''!!}>
									<a href="/nest/cosplay">Cosplay</a>
								</li>
							</ol>
						</div>
					</li>
				</ul>
			</nav>
			<h1>
				<a href="/">
					<img src="{{__ROOT__}}/assets/images/ico-logo.svg" alt="redgoose">
				</a>
			</h1>
			<nav class="right">
				<ul>
					<li>
						<a href="/page/about">
							<span>About</span>
						</a>
					</li>
					<li>
						<a href="https://note.redgoose.me" target="_blank">
							<span>Note</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<div class="container">
		@yield('contents')
	</div>

	<footer class="footer">
		<div class="footer__wrap">
			<p class="footer__copyright">
				Copyright 2013-{{date('Y')}} redgoose. All right reserved.
			</p>
		</div>
	</footer>
</main>
@yield('script')
</body>
</html>