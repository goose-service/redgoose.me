<?php
if(!defined("__GOOSE__")){exit();}

/** @var object $data */
/** @var string $mode */
?>

@section('contents')
<article class="work work--hide" id="work">
	<div class="work__wrap">
		@if ($data)
			<header class="workHeader work__header">
				<p>
					@if($data->nest_name)<span>{{ $data->nest_name }}</span>@endif
					@if($data->category_name)<span>{{ $data->category_name }}</span>@endif
				</p>
				<h1>{{ ($data->title == '.') ? 'Untitled work' : $data->title }}</h1>
			</header>

			<div class="workBody work__body">
				{!! $data->content !!}
			</div>

			<nav class="workLike work__like">
				<button type="button" title="on like" data-srl="{{$data->srl}}"{!! $onLike ? ' class="on" disabled' : '' !!}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="129.184 102.606 25.632 23.517" class="onLike__icon">
						<path d="M13,24.123l-1.858-1.692C4.542,16.446.184,12.5.184,7.655A6.981,6.981,0,0,1,7.233.606,7.673,7.673,0,0,1,13,3.285,7.676,7.676,0,0,1,18.767.606a6.981,6.981,0,0,1,7.049,7.049c0,4.844-4.358,8.791-10.958,14.789Z" transform="translate(129 102)"></path>
					</svg>
					<em>{{ $data->star or 0 }}</em>
				</button>
			</nav>
		@else
			<div class="work__error">
				<img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
			</div>
		@endif
	</div>
</article>
@endsection