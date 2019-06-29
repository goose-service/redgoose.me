<?php
if(!defined("__GOOSE__")){exit();}
?>

@extends('layout')

@section('meta')
<title>{{ getenv('TITLE') }}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ getenv('TITLE') }}"/>
<meta property="og:description" content="{{ getenv('DESCRIPTION') }}">
<meta property="og:image" content="{{ __API__ }}/usr/icons/og-redgoose.jpg">
@endsection

@section('contents')
<article class="about">
	<div class="about__wrap">
		<header class="about__header">
			<p>Introduce</p>
			<h2>About redgoose</h2>
		</header>

		<figure class="about__profile">
			<img
				srcset="{{ __ROOT__ }}/assets/images/img-about@2x.png 2x, {{ __ROOT__ }}/assets/images/img-about.png 1x"
				src="{{ __ROOT__ }}/assets/images/img-about.png"
				alt="redgoose">
		</figure>

		<div class="about__description">
			<p>
				창작일을 좋아하고 재미있는 작업을 하는것에 모든것을 쏟아붇는것에 마다하지 않고 있습니다. 처음에는 디자이너로써 일을 시작했지만 현재는 프론트엔드 개발자로 일을 하고 있습니다. 그래픽이나 디자인같은 비쥬얼 창작 작업은 취미활동으로 짬날때마다 하나씩 만들어서 이 사이트에 게시하고 있습니다. 사진찍는것을 좋아하여 한번씩 돌아다니며 세상의 모습을 기록합니다.<br/>
				개인적으로 만들었던 프로그램들은 대부분 오픈소스로
				<a href="https://github.com/redgoose-dev" target="_blank">github 저장소</a>에 등록을 하고 있습니다.
			</p>
		</div>

		<div class="about__metas">
			<div>
				<section>
					<h3>information</h3>
					<dl>
						<dt>position</dt>
						<dd>frond-end engineer, visual creator</dd>
						<dt>from</dt>
						<dd>korea republic of</dd>
						<dt>e-mail</dt>
						<dd>
							scripter@me.com<br/>
							redgooseme@gmail.com
						</dd>
					</dl>
				</section>
				<section>
					<h3>skill</h3>
					<dl>
						<dt>use tools</dt>
						<dd>photoshop, cinema4d, illustrator, webstorm, phpstorm, sketch, github, github client, zeplin, paw, trello</dd>
						<dt>programing</dt>
						<dd>html, css(scss), php, javascript(jQuery, react-js, react-native, vue.js, nuxt.js), markdown</dd>
					</dl>
				</section>
				<section>
					<h3>sns</h3>
					<dl>
						<dt>facebook</dt>
						<dd>
							<a href="https://www.facebook.com/redgoose.me" target="_blank">scripter@me.com</a>
						</dd>
						<dt>instagram</dt>
						<dd>
							<a href="https://www.instagram.com/redgoose.me" target="_blank">https://www.instagram.com/redgoose.me</a>
						</dd>
						<dt>pinterest</dt>
						<dd>
							<a href="https://pinterest.com/redgooseme" target="_blank">https://pinterest.com/redgooseme</a>
						</dd>
					</dl>
				</section>
				<section>
					<h3>source code</h3>
					<dl>
						<dt>github</dt>
						<dd>
							<a href="https://github.com/redgoose-dev" target="_blank">https://github.com/redgoose-dev</a>
						</dd>
						<dt>github gist</dt>
						<dd>
							<a href="https://gist.github.com/redgoose-dev" target="_blank">https://gist.github.com/redgoose-dev</a>
						</dd>
						<dt>codepen</dt>
						<dd>
							<a href="https://codepen.io/redgoose" target="_blank">https://codepen.io/redgoose</a>
						</dd>
					</dl>
				</section>
			</div>
		</div>
	</div>
</article>
@endsection

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script>
window.app = {
	mode: 'about',
	url: '{{__URL__}}',
};
</script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
@endsection
