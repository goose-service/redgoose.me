<?php
namespace Core;
use Dotenv\Dotenv, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
	$dotenv = new Dotenv(__PATH__);
	$dotenv->load();
}
catch(Exception $e)
{
	throw new Exception('.env error');
}

// set default timezone
if (getenv('TIMEZONE'))
{
	date_default_timezone_set(getenv('TIMEZONE'));
}

// set router
$router = new Router();

// play route
if ($router->match)
{
	var_dump($router);
}
