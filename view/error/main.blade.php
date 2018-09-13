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
	@include('error.body')
@endsection
