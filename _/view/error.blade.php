<?php
if(!defined("__GOOSE__")){exit();}
?>

@extends('layout')

@section('contents')
<article class="error">
	<div class="error__wrap">
		<figure>
			<img src="https://redgoose.me/assets/img/ico-warning.svg" alt="error symbol"/>
		</figure>
		<h1>{{$message ? $message : 'Service error'}}</h1>
		<nav>
			<a href="/">Go to home</a>
		</nav>
	</div>
</article>
@endsection