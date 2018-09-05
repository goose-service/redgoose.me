@extends('layout')
@include('article.body')

@section('script')
<script>
var redgoose = new Redgoose({
	root: '{{ __ROOT__ }}',
	gooseRoot: '{{ __GOOSE_ROOT__ }}',
	title: '{{ $title }}',
	dev: !!'{{ DEBUG }}',
});
redgoose.header.init();
redgoose.article.init({
	srl: '{{ $_article }}',
});
</script>
@endsection

@section('meta')
<meta property="og:description" content="{{ contentToShortText($repo->article->content) }}">
@if(isset($repo->article->json->thumbnail->path))
<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/{{ $repo->article->json->thumbnail->path }}">
@endif
@endsection