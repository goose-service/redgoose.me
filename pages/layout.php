<!doctype html>
<?php
use core\Util, core\Spawn;
if(!defined("__GOOSE__")){exit();}

$pageid = ($_page) ? $_page : (($_nest) ? $_nest : null);

$title = $pref['meta']['title'];
$title .= (isset($_nest)) ? ' / '.$_nest : '';

// get facebook metadata and title
if ($_article)
{
	$article = Spawn::item(array(
		'table' => Spawn::getTableName('article'),
		'where' => 'srl='.(int)$_article
	));
	$article['json'] = Util::jsonToArray($article['json'], true, true);

	$article['content'] = trim(strip_tags($article['content']));
	$article['content'] = preg_replace('/\r\n|\r|\n|\t/','',$article['content']);
	$article['content'] = preg_replace('/"/','\"',$article['content']);
	$article['content'] = preg_replace("/'/","\'",$article['content']);
	$article['content'] = preg_replace("/&nbsp;/"," ",$article['content']);
	$article['content'] = bear3StrCut($article['content'], 120);
	$og = array(
		'title' => ($article['title']) ? $article['title'] : '',
		'description' => ($article['content']) ? $article['content'] : '',
		'image' => ($article['json']['thumbnail']['url']) ? __GOOSE_ROOT__.'/'.$article['json']['thumbnail']['url'] : __GOOSE_ROOT__.'/vendor/icons--user/redgoose_512x512x32.png'
	);

	if ($article['category_srl'])
	{
		$category = Spawn::item(array(
			'table' => Spawn::getTableName('category')
			,'where' => 'srl='.$article['category_srl']
		));
		$title .= ' / ['.$category['name'].'] '.$article['title'];
	}
	else
	{
		$title .= ' / '.$article['title'];
	}

	$article = $category = null;
}
else
{
	$og['title'] = $pref['meta']['title'];
	$og['description'] = $pref['meta']['description'];
	$og['image'] = __GOOSE_ROOT__.'/vendor/icons--user/redgoose_512x512x32.png';
}
$pref['meta']['description'] = ($og['description']) ? $og['description'] : $pref['meta']['description'];
?>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="google-site-verification" content="bF0pYg2C9_CT16xoUenLKPFbGDG-LNYJoV2vAOpf-74" />
<title><?=$title?></title>
<link rel="shortcut icon" href="<?=__GOOSE_ROOT__?>/vendor/icons--user/favicon.ico">
<link rel="icon" type="image/x-icon" href="<?=__GOOSE_ROOT__?>/vendor/icons--user/redgoose_256x256x32.png">
<link rel="apple-touch-icon" href="<?=__GOOSE_ROOT__?>/vendor/icons--user/redgoose_app_256x256x32.png">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="author" content="<?=$pref['meta']['author']?>">
<meta name="keywords" content="<?=$pref['meta']['keywords']?>">
<meta name="description" content="<?=$pref['meta']['description']?>">
<meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0">
<link rel="canonical" href="http://redgoose.me">

<meta property="og:title" content="<?=$og['title']?>">
<meta property="og:site_name" content="<?=__URL__?>">
<meta property="og:url" content="<?=__URL__.$_SERVER['REQUEST_URI']?>" />
<meta property="og:description" content="<?=$og['description']?>">
<meta property="og:locale" content="ko_KR" />
<?=($og['image']) ? "<meta property=\"og:image\" content=\"$og[image]\">" : '';?>
<meta name="p:domain_verify" content="<?=$pref['pinterestVerify']?>">

<link rel="stylesheet" href="<?=__ROOT__?>/assets/icon/style.css" media="all">
<link rel="stylesheet" href="<?=__ROOT__?>/assets/css/style.pkgd.css" media="all">
<script>function log(o){console.log(o);}</script>
</head>
<body>
<main>
	<!-- Header -->
	<header id="header">
		<h1><a href="<?=__ROOT__?>/" class="icon-goose" title="<?=$pref['meta']['title']?>"></a></h1>
		<nav class="lnb">
			<?php
			$nav = Spawn::item(array(
				'table' => Spawn::getTableName('json'),
				'where' => 'srl='.$navigation_json_srl
			));
			$nav = Util::jsonToArray($nav['json'], true, true);
			$id = null;
			?>
			<ul class="dep1">
				<?php
				foreach($nav as $k=>$v)
				{
					$url = (!$v['child'][0]['ext']) ? $v['child'][0]['url'] : $v['child'][0]['url'];
					echo "<li>";
					echo "<a href=\"".$url."\" class=\"title\">$v[name]</a>";
					echo (count($v['child'])) ? "<div><ul class=\"dep2\">" : "";
					foreach($v['child'] as $k2=>$v2)
					{
						$id = (isset($v2['id'])) ? $v2['id'] : $v2['name'];
						$target = ($v2['target']) ? " target=\"$v2[target]\"" : "";
						$on = ($pageid == $id) ? " class=\"active\"" : "";
						$v2['url'] = (!$v2['ext']) ? $v2['url'] : $v2['url'];
						echo "<li$on><a href=\"$v2[url]\"$target>$v2[name]</a></li>";
					}
					echo (count($v['child'])) ? "</ul></div>" : "";
					echo "</li>";
				}
				?>
			</ul>
		</nav>
		<nav class="btns">
			<button type="button" class="toggle" id="toggleNavigation" title="Toggle navigation"><i class="icon-hamburger"></i></button>
		</nav>
	</header>
	<!-- // Header -->

	<!-- Container -->
	<div id="container">
		<?php
		require_once($containerDirectory);
		?>
	</div>
	<!-- // Container -->

	<!-- Footer -->
	<footer id="footer">
		<p><?=$pref['copyright']?></p>
	</footer>
	<!-- // Footer -->
</main>

<!-- top navigation -->
<nav id="topNav">
	<button type="button" class="prevView disabled" title="Prev"><i class="icon-prev"></i></button>
	<button type="button" class="nextView disabled" title="Next"><i class="icon-next"></i></button>
	<button type="button" class="closeView" title="Close"><i class="icon-close"></i></button>
</nav>
<!-- // top navigation -->

<script src="<?=__ROOT__?>/assets/js/vendor.min.js"></script>
<script src="<?=__ROOT__?>/assets/js/app.pkgd.js"></script>
</body>
</html>