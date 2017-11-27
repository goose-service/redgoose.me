@extends('layout-popup')
@include('article.body')

@section('meta')
<meta property="og:description" content="{{ contentToShortText($repo->article->content) }}">
@if(isset($repo->article->json['thumbnail']['url']))
<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/{{ $repo->article->json['thumbnail']['url'] }}">
@endif
@endsection