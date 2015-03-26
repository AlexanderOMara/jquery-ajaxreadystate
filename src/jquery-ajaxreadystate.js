/*!
 * jquery-ajaxreadystate
 * @version 1.1.0
 * @author Alexander O'Mara
 * @copyright Copyright (c) 2015 Alexander O'Mara
 * @license MPL 2.0 <http://mozilla.org/MPL/2.0/>
 */
/* global jQuery, define, module, require */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	}
	else {
		factory(jQuery);
	}
}(function($) {
	//'use strict';//jQuery cannot use this so neither can we.
	$.ajaxreadystate = function(url, options) {
		var
			ret,
			xhrOption,
			xhr,
			beforeSendOption,
			ajaxOptions,
			jqXHR,
			jqrsc,
			responseHeaders = null,
			responseHeadersMap,
			readyState = 0,
			eventBinding;
		
		//Custom RSC handler.
		function rsc() {
			//Get current readyState and set it on the jqXHR object.
			readyState = jqXHR.readyState = xhr.readyState;
			
			//Normalize for browser that do not provide these before receiving data.
			if (readyState < 2) {
				jqXHR.status = 0;
				jqXHR.statusText = '';
				jqXHR.responseText = '';
			}
			
			//Attempt to copy XHR properties onto jqXHR object (can fail in old browsers if AJAX is not complete).
			try {
				jqXHR.status = xhr.status || 0;
			}
			catch(e) {}
			try {
				jqXHR.statusText = xhr.statusText || '';
			}
			catch(e) {}
			try {
				jqXHR.responseText = xhr.responseText || '';
			}
			catch(e) {}
			
			//Fire the readyState API if set.
			if (typeof ajaxOptions.readystate === 'function') {
				ajaxOptions.readystate(jqXHR, readyState);
			}
			
			//Cleanup an bound events.
			if (eventBinding && readyState === 4) {
				xhr.removeEventListener(eventBinding, rsc, true);
			}
			
			//Fire the core RSC handler if set and is not the custom handler to prevent infinite recursion (jQuery 2 does not use this).
			if (jqrsc && jqrsc !== rsc) {
				jqrsc.apply(xhr, arguments);
			}
		}
		
		//Try to get all the response headers (can fail in old IE if AJAX is not complete).
		function tryGetAllResponseHeaders() {
			var r = null;
			try {
				r = xhr.getAllResponseHeaders();
			}
			catch(e) {}
			return r;
		}
		
		//Find the settings object.
		ajaxOptions = (typeof url === 'object' ? url : (options || {}));
		
		//Patch the beforeSend option.
		beforeSendOption = ajaxOptions.beforeSend;
		ajaxOptions.beforeSend = function(jqXHRArg, optionsArg) {
			//Reset and call the original method if set.
			ajaxOptions.beforeSend = beforeSendOption;
			if (beforeSendOption) {
				beforeSendOption.apply(options, arguments);
			}
			
			//Get the jqXHR object before it is sent.
			jqXHR = jqXHRArg;
			
			//Patch over functions that will not work properly until the entire request completes for browsers that can handle it.
			jqXHR.getAllResponseHeaders = function() {
				//Return the response headers caching on first request headers are available on.
				if (readyState > 1) {
					responseHeaders = responseHeaders || tryGetAllResponseHeaders();
				}
				return responseHeaders;
			};
			jqXHR.getResponseHeader = function(key) {
				var
					match = null,
					rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;
				
				//Create hash table on first requests headers are available on (based on jQuery core).
				if (readyState > 1) {
					responseHeaders = responseHeaders || tryGetAllResponseHeaders();
					if (responseHeaders && !responseHeadersMap) {
						responseHeadersMap = {};
						while ((match = rheaders.exec(responseHeaders))) {
							responseHeadersMap[match[1].toLowerCase()] = match[2];
						}
					}
					//If the hash table exists, get the value.
					if (responseHeadersMap) {
						key = key.toLowerCase();
						match = responseHeadersMap.hasOwnProperty(key) ? responseHeadersMap[key] : null;
					}
				}
				return match;
			};
			
			//Make sure the options object is the same.
			ajaxOptions = optionsArg;
			
			//Patch the XHR option.
			xhrOption = ajaxOptions.xhr;
			ajaxOptions.xhr = function() {
				//Reset and call the original method to create the XHR object and set custom RSC handler.
				ajaxOptions.xhr = xhrOption;
				xhr = xhrOption.apply(ajaxOptions, arguments);
				xhr.onreadystatechange = rsc;
				
				//Firefox <= 13 returns XrayWrapper and Firefox <= 3 throws an exception so bind event instead.
				try {
					eventBinding = xhr.onreadystatechange !== rsc;
				}
				catch(e) {
					eventBinding = true;
				}
				if (eventBinding) {
					//Check that event can be bound (prevents IE6 error on setting handler to null).
					if ((eventBinding = xhr.addEventListener)) {
						xhr.onreadystatechange = null;
						//Must have capture argument for older implementation.
						xhr.addEventListener((eventBinding = 'readystatechange'), rsc, true);
					}
				}
				
				//Return the modified XHR object to the core.
				return xhr;
			};
		};
		
		//Forward everything to the core AJAX.
		ret = $.ajax.apply($, arguments);
		
		//Do not replace the jQuery RSC handler if using event binding instead.
		if (!eventBinding) {
			//Try to copy and replace the core RSC handler (fails in IE6).
			try {
				jqrsc = xhr.onreadystatechange;
				xhr.onreadystatechange = rsc;
			}
			catch(e) {}
		}
		
		//Return the AJAX object.
		return ret;
	};
}));
