<?php
if(!defined("__GOOSE__")){exit();}

$router->route->addMatchTypes([ 'aa' => '[0-9A-Za-z_-]++' ]);


$router->route->map('GET|POST', '/', 'index');

$router->route->map('GET', '/rss', 'rss');
$router->route->map('GET', '/rss/', 'rss');
$router->route->map('GET|POST', '/ajax', 'ajax');
$router->route->map('GET|POST', '/ajax/', 'ajax');

$router->route->map('GET', '/page/[aa:page]', 'page');
$router->route->map('GET', '/page/[aa:page]/', 'page');

$router->route->map('GET|POST', '/nest/[aa:nest]', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/[i:category]', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/[i:category]/', 'nest');

$router->route->map('GET|POST', '/article/[i:article]', 'article');
$router->route->map('GET|POST', '/article/[i:article]/', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:article]', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:article]/', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:category]/[i:article]', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:category]/[i:article]/', 'article');

$router->route->map('GET|POST', '/upLike/[i:article]/', 'upLike');
