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

@include('work.body')

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
<script>
window.redgoose = new Redgoose('work', {
	srl: parseInt('{{$data->srl}}'),
	urlRoot: '{{__ROOT__}}',
	urlApi: '{{__API__}}',
	urlCookie: '{{getenv('PATH_COOKIE')}}',
	token: '{{getenv('TOKEN_PUBLIC')}}',
	app_srl: parseInt('{{getenv('DEFAULT_APP_SRL')}}'),
	debug: !!'{{getenv('USE_DEBUG')}}',
});
</script>
@endsection
