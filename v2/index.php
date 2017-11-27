<?php
header("content-type:text/html; charset=utf-8");
session_cache_expire(30);
session_start();

if (is_file('index--user.php'))
{
	require_once('index--user.php');
}
else
{
	echo "not exist 'index--user.php' file";
	exit;
}

require_once(__PWD__ . '/core/init.php');