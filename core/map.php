<?php
if(!defined("__GOOSE__")){exit();}


// allow type `number alphabet _ -`
$router->addMatchTypes([ 'aa' => '[0-9A-Za-z_-]++' ]);


// route map
$router->map('GET|POST', '/', 'index');

$router->map('GET', '/rss', 'rss');
$router->map('GET', '/rss/', 'rss');
$router->map('GET|POST', '/ajax', 'ajax');
$router->map('GET|POST', '/ajax/', 'ajax');
$router->map('GET|POST', '/ajax/[aa:action]', 'ajax');
$router->map('GET|POST', '/ajax/[aa:action]/', 'ajax');

$router->map('GET', '/page/[aa:page]', 'page');
$router->map('GET', '/page/[aa:page]/', 'page');

$router->map('GET|POST', '/nest/[aa:nest]', 'nest');
$router->map('GET|POST', '/nest/[aa:nest]/', 'nest');
$router->map('GET|POST', '/nest/[aa:nest]/[i:category]', 'nest');
$router->map('GET|POST', '/nest/[aa:nest]/[i:category]/', 'nest');

$router->map('GET|POST', '/article/[aa:article]', 'article');
$router->map('GET|POST', '/article/[aa:article]/', 'article');
$router->map('GET|POST', '/article/[aa:nest]/[aa:article]', 'article');
$router->map('GET|POST', '/article/[aa:nest]/[aa:article]/', 'article');
$router->map('GET|POST', '/article/[aa:nest]/[i:category]/[aa:article]', 'article');
$router->map('GET|POST', '/article/[aa:nest]/[i:category]/[aa:article]/', 'article');

$router->map('POST', '/upLike/[i:article]/', 'upLike');
