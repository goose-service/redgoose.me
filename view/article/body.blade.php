<?php
if(!defined("__GOOSE__")){exit();}

/** @var object $data */
Core\Util::console($data);
?>

@section('contents')
<article class="work" id="work">
	<header class="workHeader work__header">
		<p>
			@if($data->nest_name)<span>{{ $data->nest_name }}</span>@endif
			@if($data->category_name)<span>{{ $data->category_name }}</span>@endif
		</p>
		<h1>{{ ($data->title == '.') ? 'Untitled work' : $data->title }}</h1>
	</header>
</article>
@endsection