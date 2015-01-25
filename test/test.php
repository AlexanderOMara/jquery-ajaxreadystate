<?php

error_reporting( E_ALL );

$jquery_cdn_format = '//code.jquery.com/jquery-%s.js';

$jquery_versions = array(
		'1.5',
		'1.5.1',
		'1.5.2',
		'1.6',
		'1.6.1',
		'1.6.2',
		'1.6.3',
		'1.6.4',
		'1.7',
		'1.7.0',
		'1.7.1',
		'1.7.2',
		'1.8.0',
		'1.8.1',
		'1.8.2',
		'1.8.3',
		'1.9.0',
		'1.9.1',
		'1.10.0',
		'1.10.1',
		'1.10.2',
		'1.11.0',
		'1.11.1',
		'1.11.2',
		
		'2.0.0',
		'2.0.1',
		'2.0.2',
		'2.0.3',
		'2.1.0',
		'2.1.1',
		'2.1.2',
		'2.1.3'
	);

$test_all = isset( $_GET['test_all'] );
$test_version = isset( $_GET['test_version'] ) ? $_GET['test_version'] : null;
$test_next = null;
if ( $test_all ) {
	//Automatic first version if none specified in all.
	if ( ! $test_version ) {
		$test_version = isset( $jquery_versions[0] ) ? $jquery_versions[0] : null;
	}
	//Find the next version to test.
	$current_text_index = array_search( $test_version, $jquery_versions );
	if ( $current_text_index !== false && isset( $jquery_versions[$current_text_index + 1] ) ) {
		$test_next = $jquery_versions[$current_text_index + 1];
	}
}

$page_title = $test_version ? 'Test jQuery ' . $test_version : 'Test Suite';

?><!DOCTYPE html>
<html lang="en-us">
	<head>
		<meta charset="utf-8">
		<title><?php echo $page_title; ?></title>
		<link rel="stylesheet" type="text/css" href="test.css">
		<?php
		if ( $test_version ) {
		?>
		<script type="text/javascript" src="<?php printf( $jquery_cdn_format, $test_version ); ?>"></script>
		<script type="text/javascript" src="../src/jquery-ajaxreadystate.js"></script>
		<script type="text/javascript" src="test.js"></script>
		<?php
		}
		?>
	</head>
	<body>
		<div class="wrap">
			<h1>jQuery ajaxreadystate plugin test</h1>
			<?php
			if ( $test_version ) {
			?>
			<h2>Testing Version: <code><?php echo $test_version; ?></code></h2>
			<div id="test-result" class="code-wrap" data-testnext="<?php echo $test_next ? '?test_all=1&amp;test_version=' . $test_next : ''; ?>"><pre></pre></div>
			<p><a href="?">Test List</a><?php echo $test_next ? ' | <a href="?test_all=1&amp;test_version=' . $test_next . '">Test Next</a>' : ''; ?></p>
			<?php
			} else {
			?>
			<h2>Choose a version of jQuery to test, or test all.</h2>
			<p><a href="?test_all=1">Test All</a></p>
			<ul>
			<?php
				foreach ( $jquery_versions as $version ) {
					?><li><a href="?test_version=<?php echo $version; ?>"><?php echo $version; ?></a></li><?php
				}
			}
			?>
			</ul>
			<?php
			?>
		</div>
	</body>
</html>