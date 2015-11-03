<?php
if(!defined("__GOOSE__")){exit();}

$router->route->addMatchTypes(array('aa' => '[0-9A-Za-z_-]++'));

$router->route->map('GET', '/', 'index');

$router->route->map('GET', '/rss/', 'rss');

$router->route->map('GET', '/page/[aa:page]', 'page');
$router->route->map('GET', '/page/[aa:page]/', 'page');

$router->route->map('GET', '/nest/[aa:nest]', 'nest');
$router->route->map('GET', '/nest/[aa:nest]/', 'nest');
$router->route->map('GET', '/nest/[aa:nest]/[i:category]', 'nest');
$router->route->map('GET', '/nest/[aa:nest]/[i:category]/', 'nest');

$router->route->map('GET', '/article/[i:article]', 'article');
$router->route->map('GET', '/article/[i:article]/', 'article');
$router->route->map('GET', '/article/[aa:nest]/[i:article]', 'article');
$router->route->map('GET', '/article/[aa:nest]/[i:article]/', 'article');
$router->route->map('GET', '/article/[aa:nest]/[i:category]/[i:article]', 'article');
$router->route->map('GET', '/article/[aa:nest]/[i:category]/[i:article]/', 'article');

$router->route->map('GET', '/items', 'items');
$router->route->map('GET', '/items/', 'items');
$router->route->map('GET', '/items/[aa:nest]', 'items');
$router->route->map('GET', '/items/[aa:nest]/', 'items');
$router->route->map('GET', '/items/[aa:nest]/[i:category]', 'items');
$router->route->map('GET', '/items/[aa:nest]/[i:category]/', 'items');

$router->route->map('GET', '/updateLike/[i:article]', 'updateLike');
