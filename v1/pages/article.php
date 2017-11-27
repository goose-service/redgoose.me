<?php
use core\Spawn, core\Goose, core\Util;
if(!defined("__GOOSE__")){exit();}

$mode = 'article';

$print = [];

$articleCount = Spawn::count(array(
	'table' => Spawn::getTableName('article'),
	'where' => 'srl='.$_article
));


if ($articleCount == 0)
{
	echo "<div id=\"Article\"></section>";
	Goose::end();
}


// get article item
$item = Spawn::item([
	'table' => Spawn::getTableName('article'),
	'where' => 'srl=' . (int)$_article,
	'jsonField' => ['json']
]);

// set article mode
$itemMode = $item['json']['mode'];

if ($itemMode == 'markdown')
{
	// load parsedown
	require_once(__GOOSE_PWD__.'vendor/Parsedown/Parsedown.class.php');
	// get instance parsedown
	$Parsedown = new Parsedown();
	// convert markdown
	$item['content'] = '<div class="markdown-body">' . $Parsedown->text($item['content']) . '</div>';
}
else
{
	$item['content'] = '<div class="body">' . $item['content'] . '</div>';
}


// get prev,next item srl
$str = '';
$str = ($_nest) ? 'nest_srl='.$item['nest_srl'] : '';
$str .= ($_nest && $_category) ? ' and category_srl='.$_category : '';
$str .= ($str) ? ' and ' : 'app_srl='.$app_srl.' and ';
$prevItem = Spawn::item(array(
	'table' => Spawn::getTableName('article')
	,'field' => 'srl'
	,'where' => $str.'srl<'.$_article
	,'order' => 'srl'
	,'sort' => 'desc'
	,'limit' => 1
));
$nextItem = Spawn::item(array(
	'table' => Spawn::getTableName('article')
	,'field' => 'srl'
	,'where' => $str.'srl>'.$_article
	,'order' => 'srl'
	,'limit' => 1
));


// get nest data
if ($item['nest_srl'])
{
	$nest = Spawn::item(array(
		'act' => 'select',
		'field' => 'name,id,json',
		'table' => Spawn::getTableName('nest'),
		'where' => 'srl='.$item['nest_srl']
	));
	$nest['json'] = Util::jsonToArray($nest['json'], true, true);
	$print['nest'] = ($nest['name']) ? "<span>$nest[name]</span>" : "";
}

// get category data
if ($item['category_srl'])
{
	$category = Spawn::item(array(
		'act' => 'select',
		'field' => 'name',
		'table' => Spawn::getTableName('category'),
		'where' => 'srl='.$item['category_srl']
	));
	$print['category'] = ($category['name']) ? "<span>$category[name]</span>" : "";
}

$print['date'] = Util::convertDate($item['regdate'])." ".Util::convertTime($item['regdate']);

// set url
$closeUrl = ($nest['id']) ? __ROOT__.'/nest/'.$nest['id'].'/' : '';
$dirUrl = __ROOT__.'/article/';
$dirUrl .= ($_nest) ? $_nest.'/' : '';
$dirUrl .= ($_nest && $_category) ? $_category.'/' : '';
$prevUrl = ($prevItem['srl']) ? $dirUrl.$prevItem['srl'].'/' : '';
$nextUrl = ($nextItem['srl']) ? $dirUrl.$nextItem['srl'].'/' : '';

// set like count
$item['json']['like'] = (isset($item['json']['like'])) ? $item['json']['like'] : 0;
?>

<div class="articlePage">
	<div id="View_bg"></div>
	<div id="View">
		<section id="Article" data-title="<?=$title?>" data-prev="<?=$nextUrl?>" data-next="<?=$prevUrl?>">
			<?
			if (isset($item['json']['headline']['location']))
			{
				$headline = $item['json']['headline'];
				$style = '';
				$style .= ($nest['json']['headlineHeight']) ? "height:".$nest['json']['headlineHeight']."px;" : "";
				$style .= ($item['json']['headline']['location']) ? "background-image:url('".__GOOSE_ROOT__.'/'.$item['json']['headline']['location']."');" : "";
			?>
				<div class="headline" style="<?=$style?>"></div>
			<?
			}

			if ($item['title'] !== ".")
			{
			?>
				<div class="hgroup">
					<p class="loc"><?=$print['nest'].$print['category']?></p>
					<h1><?=$item['title']?></h1>
				</div>
			<?
			}
			?>
			<?=$item['content']?>
			<nav class="nav-bottom">
				<button class="prevView disabled" title="Prev"><i class="icon-prev"></i></button>
				<button class="likeArticle<?=(isset($_COOKIE['like-'.$item['srl']]) || __IS_LOCAL__) ? ' disabled' : ''?>" title="Like" data-srl="<?=$item['srl']?>">
					<i class="icon-heart"></i>
					<em><?=($item['json']['like'] > 0) ? $item['json']['like'] : 0?></em>
				</button>
				<button class="closeView" title="Close"><i class="icon-close"></i></button>
				<button class="nextView disabled" title="Next"><i class="icon-next"></i></button>
			</nav>
		</section>
	</div>
</div>

<script>
window.onload = function()
{
	window.article = new Article();
	article.root = '<?=__ROOT__?>';
	article.init({
		urls : {
			close : '<?=$closeUrl?>',
			prev : '<?=$prevUrl?>',
			next : '<?=$nextUrl?>'
		}
		,title : '<?=$title?>'
	});
};
</script>
