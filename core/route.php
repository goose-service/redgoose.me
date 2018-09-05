<?php
if (!defined('__GOOSE__')) exit();

return [

	[ 'GET', '', 'index' ],
	[ 'GET', '/', 'index' ],

	[ 'GET', '/nest/[char:id]', 'nest' ],
	[ 'GET', '/nest/[char:id]/', 'nest' ],
	[ 'GET', '/nest/[char:id]/[i:srl]', 'nest/category' ],
	[ 'GET', '/nest/[char:id]/[i:srl]/', 'nest/category' ],

	[ 'GET', '/article/[i:srl]', 'article' ],
	[ 'GET', '/article/[i:srl]/', 'article' ],

	[ 'GET', '/page/[char:name]', 'page' ],
	[ 'GET', '/page/[char:name]/', 'page' ],

	[ 'GET', '/rss', 'rss' ],

];