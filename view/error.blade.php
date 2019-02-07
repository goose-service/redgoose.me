<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $index */
/** @var int $nextPage */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
@endsection

@section('contents')
<article class="error">
	<div>
		<figure class="error__image">
			<img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
		</figure>
		<h2 class="error__message">{{$message}}</h2>
	</div>
</article>
@endsection
