<?php
if(!defined("GOOSE")){exit();}

header('Content-Type: text/xml; charset=utf-8');
echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
?>

<rss version="2.0">
	<channel>
		<title><?=$html_inf['title']?></title>
		<description><?=$html_inf['description']?></description>
		<link>http://<?=$_SERVER['SERVER_NAME']?></link>
		<?
		$itemParameter = 'group_srl='.$group;
		$items = $goose->spawn->getItems(array(
			'table' => $goose->tablesName['articles'],
			'where' => $itemParameter,
			'order' => 'srl',
			'sort' => 'desc',
			'limit' => array(0, 20)
		));
		foreach($items as $k=>$v)
		{
			foreach($v as $kk=>$vv)
			{
				$v[$kk] = htmlspecialchars($vv);
			}
		?>
			<item>
				<title><?=$v['title']?></title>
				<link><?=URL?>/article/<?=$v['srl']?>/</link>
				<description><?=$v['content']?></description>
				<author><?=$html_inf['author']?></author>
				<pubDate><?=$goose->util->convertDate($v['regdate']);?></pubDate>
			</item>
		<?
		}
		?>
	</channel>
</rss>