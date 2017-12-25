<?php
if(!defined("__GOOSE__")){exit();}


// allow type `number alphabet _ -`
$router->route->addMatchTypes([ 'aa' => '[0-9A-Za-z_-]++' ]);


// route map
$router->route->map('GET|POST', '/', 'index');

$router->route->map('GET', '/rss', 'rss');
$router->route->map('GET', '/rss/', 'rss');
$router->route->map('GET|POST', '/ajax', 'ajax');
$router->route->map('GET|POST', '/ajax/', 'ajax');
$router->route->map('GET|POST', '/ajax/[aa:action]', 'ajax');
$router->route->map('GET|POST', '/ajax/[aa:action]/', 'ajax');

$router->route->map('GET', '/page/[aa:page]', 'page');
$router->route->map('GET', '/page/[aa:page]/', 'page');

$router->route->map('GET|POST', '/nest/[aa:nest]', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/[i:category]', 'nest');
$router->route->map('GET|POST', '/nest/[aa:nest]/[i:category]/', 'nest');

$router->route->map('GET|POST', '/article/[aa:article]', 'article');
$router->route->map('GET|POST', '/article/[aa:article]/', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[aa:article]', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[aa:article]/', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:category]/[aa:article]', 'article');
$router->route->map('GET|POST', '/article/[aa:nest]/[i:category]/[aa:article]/', 'article');

$router->route->map('POST', '/upLike/[i:article]/', 'upLike');
