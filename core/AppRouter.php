<?php
namespace Core;
use AltoRouter, Exception;

/**
 * AppRouter
 *
 * @property AltoRouter route
 * @property array match
 */
class AppRouter {

	/**
	 * @throws Exception
	 */
	public function __construct()
	{
		$this->route = new AltoRouter();
		$this->route->setBasePath($_ENV['APP_PATH_RELATIVE']);
		$this->route->addMatchTypes([ 'char' => '[0-9A-Za-z_-]++' ]);
		$this->route->addRoutes($this->map());
		$this->match = $this->route->match();
	}

	/**
	 * route map
	 *
	 * @return array
	 */
	private function map()
	{
		return require __PATH__.'/./core/route.php';
	}

}