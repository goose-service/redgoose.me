<?php
if(!defined("GOOSE")){exit();}

$router->map(
	'/',
	array('controller' => 'index')
);
$router->map(
	'/rss/',
	array('controller' => 'rss')
);
$router->map(
	'/page/:page/',
	array('controller' => 'page')
);

$router->map(
	'/nest/:nest/',
	array('controller' => 'nest')
);
$router->map(
	'/nest/:nest/:category/',
	array('controller' => 'nest'),
	array('filters' => array('category' => '(\d+)'))
);

$router->map(
	'/article/:article/',
	array('controller' => 'article'),
	array('filters' => array('article' => '(\d+)'))
);
$router->map(
	'/article/:nest/:article/',
	array('controller' => 'article'),
	array('filters' => array('article' => '(\d+)'))
);
$router->map(
	'/article/:nest/:category/:article/',
	array('controller' => 'article'),
	array('filters' => array('category' => '(\d+)', 'article' => '(\d+)'))
);

$router->map(
	'/items/',
	array('controller' => 'items')
);
$router->map(
	'/items/:item/',
	array('controller' => 'items')
);
$router->map(
	'/items/:item/:category/',
	array('controller' => 'items'),
	array('filters' => array('category' => '(\d+)'))
);
?>