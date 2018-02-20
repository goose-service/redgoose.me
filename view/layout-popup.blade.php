<?php
if(!defined("__GOOSE__")){exit();}
?>
<!doctype html>
<html lang="ko">
<head>
@include('head')
</head>
<body>
<main class="mode-popup">
	<div class="container">
		@yield('contents')
	</div>
</main>
</body>
</html>