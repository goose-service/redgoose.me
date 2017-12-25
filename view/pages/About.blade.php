@extends('layout')


@section('contents')
<article class="about page page-about">
	<header class="about__header">
		<p>Introduce</p>
		<h1>About redgoose</h1>
	</header>

	<figure class="about__profile">
		<img src="{{ __ROOT__ }}/assets/img/img-about.png" alt="redgoose">
	</figure>

	<div class="about__description">
		<p>
			창작일을 좋아하고 재미있는 작업을 하는것에 모든것을 쏟아붇는것에 마다하지 않는 남자입니다. 처음에는 디자이너로써 일을 시작했지만 현재는 프론트엔드 개발자로 일을 하고 있습니다. 그래픽이나 디자인같은 비쥬얼 창작 작업은 취미활동으로 짬날때마다 하나씩 만들어서 이 사이트에 게시하고 있습니다. 사진찍는것을 좋아하여 한번씩 돌아다니며 세상의 모습을 기록합니다.<br/>
			개인적으로 만들었던 프로그램들은 대부분 오픈소스로
			<a href="https://github.com/RedgooseDev" target="_blank">github 저장소</a>에 등록을 하고 있습니다.
		</p>
	</div>

	<div class="about__metas">
		<div>
			<section>
				<h1>infomation</h1>
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
			<h1>skill</h1>
			<dl>
				<dt>use tools</dt>
				<dd>photoshop, cinema4d, flash, illustrator, aftereffect, coda2, atom, editplus, webstorm, phpstorm, sketch, github, sourcetree</dd>
				<dt>programing</dt>
				<dd>html, css(scss), php, javascript(jQuery, react-js, react-navtive), actionscript</dd>
			</dl>
		</section>
		</div>
		<div>
			<section>
				<h1>sns</h1>
				<dl>
					<dt>facebook</dt>
					<dd><a href="https://www.facebook.com/redgoose.me" target="_blank">scripter@me.com</a></dd>
					<dt>instagram</dt>
					<dd><a href="https://www.instagram.com/redgoose.me/" target="_blank">https://www.instagram.com/redgoose.me/</a></dd>
					<dt>pinterest</dt>
					<dd><a href="https://pinterest.com/redgooseme/" target="_blank">https://pinterest.com/redgooseme/</a></dd>
				</dl>
			</section>
			<section>
			<h1>source code</h1>
			<dl>
				<dt>github</dt>
				<dd><a href="https://github.com/RedgooseDev" target="_blank">https://github.com/RedgooseDev</a></dd>
				<dt>github gist</dt>
				<dd><a href="https://gist.github.com/RedgooseDev">https://gist.github.com/RedgooseDev</a></dd>
				<dt>codepen</dt>
				<dd><a href="http://codepen.io/redgoose/" target="_blank">http://codepen.io/redgoose/</a></dd>
			</dl>
		</section>
		</div>
	</div>
</article>
@endsection

@section('script')
<script>
var redgoose = new Redgoose({
	root: '{{ __ROOT__ }}',
	gooseRoot: '{{ __GOOSE_ROOT__ }}',
	title: '{{ $pref->meta['title'] }}',
	dev: !!'{{ DEBUG }}'
});
redgoose.header.init();
</script>
@endsection