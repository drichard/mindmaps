<?php

	/*
		CREATE TABLE `mindmap`
		(
			`id` varchar(64) not null primary key,
			`title` varchar(64) not null,
			`data` text not null
		);
	*/

	// config these
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', '');
	define('DB_NAME', 'mindmaps');

	// don't config below
	mysql_connect(DB_HOST, DB_USER, DB_PASS);
	mysql_select_db(DB_NAME);

	// are we saving?
	if ( $_POST['action'] == 'save' )
	{
		$mindmap = json_decode(stripslashes($_POST['mindmap']));

		$res = mysql_query("select * from `mindmap` where `id`='" . $mindmap->id . "'");

		// update
		if ( mysql_num_rows($res) == 1 )
		{
			mysql_query("update `mindmap` set `data`='" . str_replace(array("\n", "'"), array(' ', "\'"), json_encode($mindmap)) . "' where `id`='" . $mindmap->id . "'") or die(mysql_error());
		}
		// new
		else
		{
			mysql_query("insert into `mindmap` set `id`='" . $mindmap->id . "', `data`='" . str_replace(array("\n", "'"), array(' ', "\'"), json_encode($mindmap)) . "', `title`='" . $mindmap->title . "'") or die(mysql_error());
		}

		echo 'ok';
	}
	// loading the mindmaps?
	else if ( $_POST['action'] == 'load' )
	{
		$mindmaps = array();
		$res = mysql_query("select * from `mindmap` order by `title`");

		for ( $i = 0; $i < mysql_num_rows($res); $i++ )
		{
			$mindmaps[] = json_decode(str_replace("\n", ' ', mysql_result($res, $i, 'data')));
		}

		echo json_encode($mindmaps);
	}
	// removing
	else if ( $_POST['action'] == 'remove' )
	{
		mysql_query("delete from `mindmap` where `id`='" . $_POST['id'] . "'");

		echo 'ok';
	}