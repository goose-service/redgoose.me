<?php
namespace Core;
use AltoRouter;
/**
 * Router
 *
 * @property array match
 * @property string target
 * @property object params
 * @property string method
 */
class Router {
	public function __construct()
	{
		$router = new AltoRouter();
		$router->setBasePath(getenv('PATH_RELATIVE'));
		$router->addMatchTypes([ 'char' => '[0-9A-Za-z_-]++' ]);
		$router->addRoutes($this->map());
		$this->match = $router->match();

		if ($this->match)
		{
			$this->target = $this->match['target'];
			$this->params = (object)$this->match['params'];
			$this->method = $_SERVER['REQUEST_METHOD'];
		}
	}
	private function map()
	{
		return require __PATH__.'/./core/route.php';
	}
}