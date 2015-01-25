/* global jQuery, window */
jQuery(function($) {//'use strict';
	var $test_result = $('#test-result'),
		$test_result_pre = $test_result.find('pre'),
		test_next = $test_result.attr('data-testnext'),
		successfulTestDelay = 3;
	
	//Log function.
	function log(message) {
		$test_result_pre
			.append($('<code></code>').text(message))
			.append('<br />');
		$test_result.scrollTop($test_result[0].scrollHeight);
	}
	
	//Test API.
	var test = (function() {
		var api = {};
		var tests = {};
		api.add = function(name) {
			tests[name] = false;
		};
		api.assert = function(name, test, messageSuccess, messageFail) {
			if (test) {
				tests[name] = true;
				log('[SUCCESS]:    ' + name + (messageSuccess ? ': ' + messageSuccess : ''));
			} else {
				log('[FAILURE]:    ' + name + (messageFail ? ': ' + messageFail : ''));
			}
		};
		api.done = function() {
			var p, r = true;
			for (p in tests) {
				if (tests.hasOwnProperty(p) && tests[p] === false) {
					r = false;
					log('[FAILED]:    ' + p);
				}
			}
			return r;
		};
		return api;
	})();
	
	//Register tests.
	test.add('beforeSend');
	test.add('xhr');
	test.add('readystate-1');
	test.add('readystate-2');
	test.add('readystate-3');
	test.add('readystate-4');
	test.add('prop-status');
	test.add('prop-statusText');
	test.add('prop-responseText');
	test.add('getAllResponseHeaders');
	test.add('getResponseHeader');
	test.add('complete');
	test.add('complete-noapi');
	test.add('no-exception');
	test.add('no-exception-2');
	
	//Give browsers a second to render.
	window.setTimeout(function() {
		
		//Start testing.
		log('STARTING TESTS');
		
		//Test the plugin API.
		$.ajaxreadystate({
			url: 'ajaxhandler.php',
			cache: false,
			type: 'GET',
			beforeSend: function() {
				test.assert('beforeSend',
						true,
						'beforeSend method called'
					);
			},
			xhr: function() {
				test.assert(
						'xhr',
						true,
						'xhr method called'
					);
				return jQuery.ajaxSettings.xhr();
			},
			readystate: function(jqXHR, readystate) {
				var headers, header;
				test.assert(
						'readystate-' + readystate,
						jqXHR.readyState === readystate,
						'readystate method called with readystate: ' + readystate,
						'readystate method called with mis-matched readyState values'
					);
				//Check status and headers on headers received state.
				if (readystate === 2) {
					//Check status.
					test.assert('prop-status',
							jqXHR.status,
							'status available: ' + jqXHR.status,
							'status not updated from: ' + jqXHR.status
						);
					test.assert('prop-statusText',
							jqXHR.statusText,
							'statusText available: ' + jqXHR.statusText,
							'statusText not updated from: ' + jqXHR.statusText
						);
					//Check all headers.
					headers = jqXHR.getAllResponseHeaders();
					test.assert(
							'getAllResponseHeaders',
							headers,
							'Headers:\n\n' + headers,
							'Failed to get response headers'
						);
					//Check single header case-insensitive.
					header = jqXHR.getResponseHeader('content-Type');
					test.assert(
							'getResponseHeader',
							header,
							'Content-Type: ' + header,
							'Failed to get Content-Type header case-insensitive'
						);
				}
				//Check that responseText is available on loading state.
				else if (readystate === 3) {
					test.assert('prop-responseText',
							jqXHR.responseText,
							'responseText length: ' + (jqXHR.responseText ? jqXHR.responseText.length : 0),
							'responseText not available'
						);
				}
			},
			complete: function(jqXHR) {
				test.assert(
						'complete',
						jqXHR.readyState === 4 && jqXHR.responseText,
						'complete method called with readyState: 4 and responseText length: ' + (jqXHR.responseText ? jqXHR.responseText.length : 0),
						'complete method called with invalid readyState or responseText'
					);
				
				//Test complete again without using any other API to ensure it does not conflict.
				$.ajaxreadystate({
					url: 'ajaxhandler.php',
					cache: false,
					complete: function() {
						test.assert('complete-noapi', true, 'complete method called on request using no other API');
						//Check success.
						if (test.done()) {
							log('TESTS COMPLETED SUCCESSFULLY');
							if (test_next) {
								log('Starting next test in ' + successfulTestDelay + ' seconds...');
								window.setTimeout(function() {
									window.location.href = test_next;
								}, successfulTestDelay * 1000);
							}
						} else {
							log('TESTS COMPLETED WITH FAILURES');
						}
					}
				});
				
				test.assert('no-exception-2',
						true,
						'test continued without exception'
					);
			}
		});
		
		//Check that the API calls did not throw an exception.
		test.assert('no-exception',
				true,
				'test started without exception'
			);
		
	}, 1000);
});