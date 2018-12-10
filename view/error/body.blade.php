<?php
if(!defined("__GOOSE__")){exit();}

/** @var string $message */
?>

<article class="error">
	<figure class="error__image">
		<img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
	</figure>
	<h2 class="error__message">{{$message}}</h2>
</article>