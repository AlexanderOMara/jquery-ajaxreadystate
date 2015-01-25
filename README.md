jquery-ajaxreadystate
=====================

jQuery ajaxreadystate plugin

Overview
--------

The jQuery AJAX implementation is somewhat limited in that it does not provide a way of responding to the `readystatechange` events that fire during the AJAX request. The `jQuery.ajax` API documentation actually states the following.

> No `onreadystatechange` mechanism is provided, however, since `done`, `fail`, `always`, and `statusCode` cover all conceivable requirements.

While this statement is true for most use cases, what if you want to access the response headers or status code before the entire request completes, or access the response body as it streams?

Evidently jQuery does not provide this functionality due to browser compatibility issues, so this plugin adds this extra functionality for browsers that support these features (see compatibility notes below).

This plugin works by adding a new method `jQuery.ajaxreadystate` method, which acts as a wrapper for `jQuery.ajax`, extending the functionality and updating the `jqXHR` object to remove the limitations and update properties as the `readyState` changes.

Usage
-----

You use `jQuery.ajaxreadystate` just like you would `jQuery.ajax`, except you have one extra method you can define, the `readystate` method.

```js
jQuery.ajaxreadystate({
	readystate: function(jqXHR, readyState) {
		
	}
});
```

This method will fire every time the request fires a `readystatechange` event, and will pass in the updated `jqXHR` object, and the current `readyState`.

Download
--------

You can download the latest stable and minified release from the releases section of this repository. Alternately you can clone the repository download from a package managers.

Browser Compatibility
---------------------

###Fully Supported

The following browsers are fully supported.

- Firefox 3+
- Chrome 14+
- Internet Explorer 10+
- Safari 5+
- iOS Safari 4+
- Opera 15+

###Partially Supported

The following browsers are partially supported due to technical limitations of the browser itself. Compatibility issues are noted.

- Internet Explorer 9
  - `responseText` is not available until `readyState` is `4`.
  - Only fires one `readystatechange` event for `readyState` `3` at some point during the transfer.
- Internet Explorer 7-8
  - `responseText` is not available until `readyState` is `4`.
  - `status` and `statusText` are not updated until `readyState` is `4`.
  - `getAllResponseHeaders` and `getResponseHeader` return `null` until `readyState` is `4`.
- Internet Explorer 6
  - The `readystate` callback is only fired for `readyState` `1`.
  - `responseText` is not available until `readyState` is `4`.
  - `status` and `statusText` are not updated until `readyState` is `4`.
  - `getAllResponseHeaders` and `getResponseHeader` return `null` until `readyState` is `4`.
- Safari 4
  - `getAllResponseHeaders` and `getResponseHeader` return `null` until `readyState` is `3`.
- iOS Safari 3
  - `getAllResponseHeaders` and `getResponseHeader` return `null` until `readyState` is `3`.
- Opera 11.6-12.16
  - Only fires one `readystatechange` event for `readyState` `3` at some point during the transfer.
- Opera 11.1-11.5
  - `status` and `statusText` are not updated until `readyState` is `3`.
  - Only fires one `readystatechange` event for `readyState` `3` at some point during the transfer.
- Opera 10.6
  - `status` and `statusText` are not updated until `readyState` is `3`.
  - Only fires one `readystatechange` event for `readyState` `3` at some point during the transfer.
  - `getAllResponseHeaders` and `getResponseHeader` return `null` until `readyState` is `4`.

Older browsers than those listed were not tested, but may be partially or fully supported.

jQuery Compatibility
--------------------

This plugin is compatible with jQuery 1.5+ and jQuery 2.0.0+.

Development
-----------

To create a minified build, run this commend from the root directory of this repository.

```bash
$ npm run build
```

Bugs
----

If you find a bug or have compatibility issues not documented above, please open a ticket under issues section for this repository.

License
-------

See LICENSE.txt

If this license does not work for you, feel free to contact me.

Donations
---------
If you find my software useful, please consider making a modest donation on my website at [alexomara.com](http://alexomara.com).
