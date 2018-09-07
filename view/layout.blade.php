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
		<div class="header__wrap">
			<nav class="left">
				<ul>
					<li>
						<a href="/nest/visual"><span>Works</span></a>
						<div>
							<ol>
								<li><a href="/nest/visual">Visual</a></li>
								<li><a href="/nest/3d">3D</a></li>
								<li><a href="/nest/develop">Develop</a></li>
							</ol>
						</div>
					</li>
					<li>
						<a href="/nest/landscape"><span>Photos</span></a>
						<div>
							<ol>
								<li><a href="/nest/landscape">Landscape</a></li>
								<li><a href="/nest/portrait">Portrait</a></li>
								<li><a href="/nest/snap/">Snap</a></li>
								<li><a href="/nest/composition">Composition</a></li>
								<li><a href="/nest/foreign">Foreign countries</a></li>
								<li><a href="/nest/cosplay">Cosplay</a></li>
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
						<a href="/about">
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
@yield('popup')
@yield('script')
</body>
</html>