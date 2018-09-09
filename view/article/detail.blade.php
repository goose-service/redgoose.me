<?php
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $description */
/** @var object $data */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{$image}}">
@endsection

@include('article.body')

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
<script>
window.redgoose = new Redgoose('detail', {
	//
});
</script>
@endsection
