redgoose.me Version.1
=====

### HTML Preference data
`Goose - json`에서 html 설정값을 가지고 있는 json 데이터를 추가해야한다.
```
{
	"meta": {
		"title": "Redgoose",
		"author": "RedGoose",
		"keywords": "Redgoose 2D 3D Photography Graphic Design CaseStudy Programing Web 붉은거위 거위 Portfolio",
		"description": "붉은거위의 개인작업물 라이브러리. Redgoose persnal work library"
	},
	"pinterestVerify": "3e05cc5b868de908660cf4004dbdc8fe",
	"copyright": "Copyright 2013 Redgoose. All right reserved."
}
```


### Navigation data
`Goose - json`에서 메뉴트리값을 가지고 있는 json 데이터를 추가해야한다.
```
[
	{
		"name": "Works",
		"child": [
			{
				"name": "3D",
				"url": "/nest/3d/",
				"id": "3d"
			},
			{
				"name": "Visual",
				"url": "/nest/Visual/"
			},
			{
				"name": "Web",
				"url": "/nest/Web/"
			}
		]
	},
	{
		"name": "Photography",
		"child": [
			{
				"name": "Landscape",
				"url": "/nest/Landscape/"
			},
			{
				"name": "Portrait",
				"url": "/nest/Portrait/"
			}
		]
	}
]
```


### index.user.php
경로설정을 가지고 있는 `index.user.php` 파일이 꼭 필요하다.

```
<?php
define('__GOOSE__', true);
define('__GOOSE_ROOT__', '/git/goose');
define('__URL__', '/git/redgoose');
define('__PWD__', dirname(__FILE__));
define('__GOOSE_LIB__', '../goose/core/lib.php');
define('__ROOT__', '/git/redgoose');
define('DEBUG', true);

$app_srl = 1;
$defaultItemCount = 50;
$navigation_json_srl = 2; // json - navigation srl값
$pref_json_srl = 3; // json - preference srl값
```
