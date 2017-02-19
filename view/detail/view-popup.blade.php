@extends('layout-popup')
@include('detail.contents')

@section('meta')
<meta property="og:description" content="{{ contentToShortText($repo['article']['content']) }}">
@if($repo['article']['json']['thumbnail']['url'])
	<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/{{ $repo['article']['json']['thumbnail']['url'] }}">
@endif
@endsection