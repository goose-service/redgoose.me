<?php
namespace Core;
use AltoRouter, Exception;

/**
 * AppRouter
 * @property AltoRouter route
 * @property array match
 */
class AppRouter {

  public AltoRouter $route;
  public array $match;

	/**
	 * @throws Exception
	 */
	public function __construct()
	{
		$this->route = new AltoRouter();
		$this->route->setBasePath($_ENV['APP_PATH_RELATIVE']);
		$this->route->addMatchTypes([ 'char' => '[0-9A-Za-z_-]++' ]);
		$this->route->addRoutes($this->map());
    $this->match = ($this->route->match() ?? false) ?: [];
	}

	/**
	 * route map
	 * @return array
	 */
	private function map(): array
	{
		return require __PATH__.'/./core/route.php';
	}

}
