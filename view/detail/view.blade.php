@extends('layout')
@include('detail.contents')


@section('script')
<script>
var app = new window.APP({
	root : '{{ __ROOT__ }}',
	gooseRoot : '{{ __GOOSE_ROOT__ }}'
});
app.view();
</script>
@endsection

@section('meta')
<meta property="og:description" content="{{ contentToShortText($repo['article']['content']) }}">
@if($repo['article']['json']['thumbnail']['url'])
	<meta property="og:image" content="{{ __GOOSE_ROOT__ }}/{{ $repo['article']['json']['thumbnail']['url'] }}">
@endif
@endsection