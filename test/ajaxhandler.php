<?php

error_reporting( E_ALL );

header( 'Content-Type: text/plain' );
//header( 'Content-Type: application/example' );//Attempt to bypass GZIP.

//Greater than 1 to simulates slower transfers with GZIP disabled.
$data_chunks = 1;

//Amount of data to respond with in bytes.
$data_amount = 1000000;


$data_sent = 0;
foreach ( range( 1, $data_chunks ) as $i ) {
	//Send a lot of data to ensure the browser will not buffer the events.
	$data_limit = round( $data_amount / $data_chunks * $i );
	while ( $data_sent < $data_limit ) {
		//Generate pseudo-random data to counter GZIP.
		$data = base64_encode( md5( mt_rand( 0, 1000000 ), true ) );
		//Keep track of data sent and prevent overflow.
		if ( $data_sent + strlen( $data ) > $data_amount ) {
			$data = substr( $data , 0, $data_amount - $data_sent );
		}
		$data_sent += strlen( $data );
		echo $data;
	}
	
	//Sleep to simulate latency.
	if ( $data_chunks ) {
		//Flush the output to the browser.
		while ( ob_get_level() ) {
			ob_end_flush();
		}
		flush();
		
		sleep(1);
	}
}