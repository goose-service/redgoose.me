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