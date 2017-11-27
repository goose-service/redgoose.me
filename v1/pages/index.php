<?php
use core\Spawn;
if(!defined("__GOOSE__")){exit();}

// init mode
$mode = 'index';

// init variable
$categoryCount = 0;
$nest = null;

// nest check and get nest data
if ($_nest)
{
	$nest = Spawn::item(array(
		'table' => Spawn::getTableName('nest'),
		'where' => "id='$_nest'"
	));

	$categoryCount = Spawn::count(array(
		'table' => Spawn::getTableName('category')
		,'where' => 'nest_srl='.$nest['srl']
	));
}
?>

<section id="Index">
	<h1 class="headding">
		<?
		$url = convertUrl(array('mod'=>$_nest));
		?>
		<a href="<?=$url?>"><?=($nest['name']) ? $nest['name'] : 'Newstest'?></a>
	</h1>

	<?
	if ($categoryCount > 0)
	{
		$categoryIndex = Spawn::items(array(
			'table' => Spawn::getTableName('category'),
			'where' => 'nest_srl='.$nest['srl'],
			'order' => 'turn',
			'sort' => 'asc'
		));
	?>
		<section id="categoryList" class="categoryList">
			<h1 class="blind">List of categories</h1>
			<nav>
				<button type="button" id="toggleCategory">Select Category</button>
			</nav>
			<ul>
				<?
				$url = convertUrl(array('mod'=>$_nest));
				$active = (!$_category) ? " class='on'" : "";
				$cnt = Spawn::count(array(
					'table' => Spawn::getTableName('article'),
					'where' => 'nest_srl='.$nest['srl']
				));
				?>
				<li<?=$active?>><a href="<?=$url?>">All(<?=$cnt?>)</a></li>
				<?
				foreach ($categoryIndex as $k=>$v)
				{
					$url = convertUrl(array('mod'=>$_nest, 'cat'=>$v['srl']));
					$cnt = Spawn::count(array(
						'table' => Spawn::getTableName('article'),
						'where' => 'category_srl='.$v['srl']
					));
					$active = ($_category == $v['srl']) ? " class='on'" : "";
					$cnt = ($cnt > 0) ? "<em>($cnt)</em>" : "";
					echo "<li$active><a href=\"$url\">$v[name]$cnt</a></li>\n";
				}
				?>
			</ul>
		</section>
	<?
	}
	?>

	<section class="documentList">
		<h1 class="blind">List of items</h1>
		<div id="items">
			<div class="grid-sizer"></div>
		</div>
	</section>
</section>

<?
$itemsUrl = __ROOT__.'/items';
if ($_nest)
{
	$itemsUrl .= '/'.$_nest;
	$itemsUrl .= ($_category) ? '/'.$_category : '';
	$itemsUrl .= '/';
}
$itemsUrl .= ($_GET['page'] > 1) ? '?page='.$_GET['page'] : '';
?>

<script>
window.onload = function()
{
	var userData = {
		root : '<?=__ROOT__?>',
		loadItemsUrl : '<?=$itemsUrl?>',
		title : '<?=$title?>',
		paddingTop : 90
	};
	window.index = new Index(userData);
	$('html').addClass('scroll');
}
</script>