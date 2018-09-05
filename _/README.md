# redgoose-v3

redgoose.me ver.3


## index--user.php

루트에 `index--user.php`파일을 만들어 다음과 같은 내용으로 설정값을 넣어준다.

```php
<?php
define('__GOOSE__', true);
define('__GOOSE_ROOT__', '/goose');
define('__URL__', 'http://localhost/redgoose.me');
define('__PWD__', dirname(__FILE__) . '/');
define('__GOOSE_LIB__', '../goose/bootstrap/lib.php');
define('__ROOT__', '/redgoose.me');
define('__COOKIE_ROOT__', '/redgoose.me');
define('DEBUG', true);

define('__APP_SRL__', 1);
define('__DEFAULT_ITEM_COUNT__', 40);
define('__JSON_SRL_PREFERENCE__', 2);
define('__THUMBNAIL_LARGE_SIZE__', '470,510,610');
```