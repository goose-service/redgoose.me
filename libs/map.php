<?php
if(!defined("__GOOSE__")){exit();}

$router->route->map('GET', '/', 'index');

$router->route->map('GET', '/rss/', 'rss');

$router->route->map('GET', '/page/[a:page]', 'page');
$router->route->map('GET', '/page/[a:page]/', 'page');

$router->route->map('GET', '/nest/[a:nest]', 'nest');
$router->route->map('GET', '/nest/[a:nest]/', 'nest');
$router->route->map('GET', '/nest/[a:nest]/[i:category]', 'nest');
$router->route->map('GET', '/nest/[a:nest]/[i:category]/', 'nest');

$router->route->map('GET', '/article/[i:article]', 'article');
$router->route->map('GET', '/article/[i:article]/', 'article');
$router->route->map('GET', '/article/[a:nest]/[i:article]', 'article');
$router->route->map('GET', '/article/[a:nest]/[i:article]/', 'article');
$router->route->map('GET', '/article/[a:nest]/[i:category]/[i:article]', 'article');
$router->route->map('GET', '/article/[a:nest]/[i:category]/[i:article]/', 'article');

$router->route->map('GET', '/items', 'items');
$router->route->map('GET', '/items/', 'items');
$router->route->map('GET', '/items/[a:nest]', 'items');
$router->route->map('GET', '/items/[a:nest]/', 'items');
$router->route->map('GET', '/items/[a:nest]/[i:category]', 'items');
$router->route->map('GET', '/items/[a:nest]/[i:category]/', 'items');