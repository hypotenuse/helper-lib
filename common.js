;(function(_) {
	
	var emptyBox = _.document.createElement('DIV')
		 ,htmlNode = _.document.documentElement
		 ,headNode = _.document.head || _.document.getElementsByTagName('head')[0]
		 ,bodyNode = _.document.body || _.document.getElementsByTagName('body')[0]
		 ,ObjectProto = Object.prototype
		 ,StringProto = String.prototype
		
	,owns = function(object, property) {
		return ObjectProto.hasOwnProperty.call(object, property);
	}

	,prepareRegExpString = function(str) {
		return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}

	,camelize = function(str) {
		return str.replace(/\-(?:.)/g, function(_) {
			return _.charAt(1).toUpperCase();
		});
	}

	,trim = function(string) {
		try {
			string = StringProto.trim.call(string);
		}
		catch(ex) {
			string = string.replace(/^\s+|\s+$/g, '');
		}
		return string;
	}
		 
	,useClassList = ('classList' in emptyBox) && emptyBox.classList.add && emptyBox.classList.remove && emptyBox.classList.contains && emptyBox.classList.toggle
	,eventMethod = 'addEventListener' in emptyBox ? ['addEventListener', 'removeEventListener'] : 'attachEvent' in emptyBox ? ['attachEvent', 'detachEvent'] : ''

	,changeClassProperty = function(box, token) {
		box.setAttribute('class', token);
		box.className = token;
		return box;
	}

	,clearClass = function(box) {
		return changeClassProperty(box, '');
	}

	// Export common object	
	_.common = {

		dom: {

			htmlNode: htmlNode,
			headNode: headNode,
			bodyNode: bodyNode,
			html: htmlNode,
			head: headNode,
			body: bodyNode,

			get: function(id) {
				return _.document.getElementById(id);
			},

			getByClassName: function(box, className) {
				var matches = []
					 ,box = box || _.document
					 ,classPattern = new RegExp('(?:^|\\s)' + prepareRegExpString(className) + '(?:\\s|$)');
				if (box.getElementsByClassName)
					matches = box.getElementsByClassName(className);
				else {
					for (var i = 0, list = box.getElementsByTagName('*'), length = list.length; i < length; ++i) {
						if (classPattern.test(list[i].className))
								matches.push(list[i]);
						}
				}
				return matches;
			},

			dataset: function(box, dataset) {
				var dataRE = /^data\-/
					 ,data = dataRE.test(dataset);
				if ('dataset' in box) {
					return box.dataset[
						camelize(data ? dataset.replace(dataRE, '') : dataset)
					];
				}
				// IE10-
				else {
					return box.getAttribute(
						data ? dataset : dataset.replace(/^/, 'data-')
					);
				}
			},

			text: function(box, text) {
				if(box.textContent) {
					box.textContent = text;
				}
				// IE
				else if (box.innerText) {
					box.innerText = text;
				}
			},

			html: function(box, chunk) {
				box.innerHTML = chunk;
			},

			insert: (function(proto) {
				var _where = ['beforeBegin', 'afterBegin', 'beforeEnd', 'afterEnd']
					 ,whereRE = /^(?:bb|ab|be|ae)$/i
				if (proto && !proto.insertAdjacentElement) {
					proto.insertAdjacentElement = function(where, node) {
						var parent = this.parentNode;
						if (where == _where[0]) {
							parent.insertBefore(node, this);
						}
						else if (where == _where[1]) {
							this.insertBefore(node, this.firstChild);
						}
						else if (where == _where[2]) {
							this.appendChild(node);
						}
						else if (where == _where[3]) {
							if(this.nextSibling) {
								parent.insertBefore(node, this.nextSibling)
							}
							else {
								parent.appendChild(node);
							}
						}
						return node;
					}
					proto.insertAdjacentHTML = function(where, chunk) {
						var range;
						this.insertAdjacentElement(
							where, (range = this.ownerDocument.createRange(), range.setStartBefore(this), range.createContextualFragment(chunk))
						)
					}
					proto.insertAdjacentText = function(where, text) {
						this.insertAdjacentElement(
							where, document.createTextNode(text)
						)
					}
				}
				return function(type, where, node, value) {
					if (whereRE.test(where)) {
						node['insertAdjacent' + ((type = type.toLowerCase()) == 'element' ? 'Element' : type == 'html' ? 'HTML' : 'Text')](
							(where = where.toLowerCase()) == 'bb'
							? _where[0] : where == 'ab' ? _where[1] : where == 'be' ? _where[2] : _where[3]
								,value
						)
					}
				}
			})(HTMLElement && HTMLElement.prototype),

			containsClass: function(box, token) {
				var result;
				token = trim(token);
				if (useClassList) {
					// Throws an exception if token has space characters
					result = box.classList.contains(token);
				}
				else {
					result = new RegExp('(?:^|\\s)' + prepareRegExpString(token) + '(?:\\s|$)').test(box.className);
				}
				return result;
			},

			addClass: function(box, token) {
				token = trim(token);
				if (useClassList) {
					// Won't add the same class.
					box.classList.add(token);
				}
				else {
					if (!_.common.dom.containsClass(box, token)) {
						changeClassProperty(
							box, box.className + (box.className.length ? ' ' : '') + token
						);
					}
				}
				return box;
			},

			removeClass: function(box, token) {
				token = trim(token);
				if (useClassList) {
					box.classList.remove(token);
				}
				else {
					if (_.common.dom.containsClass(box, token)) {
						changeClassProperty(
							box, box.className.replace(new RegExp('(?:^|\\s)' + prepareRegExpString(token)), '')
						);
					}
				}
				return box;
			},

			toggleClass: function(box, token) {
				token = trim(token);
				if (useClassList) {
					box.classList.toggle(token);
				}
				else {
					if (_.common.dom.containsClass(box, token)) {
						_.common.dom.removeClass(box, token);
					}
					else {
						_.common.dom.addClass(box, token);
					}
				}
				return box;
			}
		},

		event: {
			getEvent: function(originalEvent) {
				return originalEvent || _.event;
			},

			getTarget: function(Event) {
				Event = _.common.event.getEvent(Event);
				return Event.target || Event.srcElement;
			},

			stopPropagation: function(Event) {
				Event = _.common.event.getEvent(Event);
				if (Event.stopPropagation) {
					Event.stopPropagation();
				}
				else {
					Event.cancelBubble = true;
				}
			},

			preventDefault: function(Event) {
				Event = _.common.event.getEvent(Event);
				if (Event.preventDefault) {
					Event.preventDefault();
				}
				else {
					Event.returnValue = false;
				}
			},

			_callbacks: [],

			on: (function() {
				
				var bind = function(element, callback) {
					var wrappedCallback = function(Event) {
						callback.call(element, Event);
					}
					common.event._callbacks.push([callback, wrappedCallback]);
					return wrappedCallback;
				}

				return function(type, element, callback) {
					callback = bind(element, callback);
					prefixed = 'on' + type;
					if(eventMethod) {
						element[eventMethod[0]](
							eventMethod[0] == 'attachEvent' ? prefixed : type, callback
						)
					}
					else {
						element[prefixed] = callback;
					}
				}
			})(),

			off: function(type, element, callback) {
				var prefixed = 'on' + type,
						callbacks = common.event._callbacks;
				for (var j = 0; j < callbacks.length; ++j) {
					if (callbacks[j][0] == callback) {
						callback = callbacks[j][1];
						callbacks.splice(j, 1);
						break;
					}
				}
				if (eventMethod) {
					element[eventMethod[1]](
						eventMethod[1] == 'detachEvent' ? prefixed : type, callback
					)
				}
				else {
					element[prefixed] = null;
				}
			}
		}

		,metrics: {
			getPS: function() {
				if (_.pageYOffset != void(0)) {
					return {
						top: _.pageYOffset,
						left: _.pageXOffset
					}
				}
				else if (_.scrollY != void(0)) {
					return {
						top: _.scrollY,
						left: _.scrollX
					}
				}
				else {
					return {
						top: (htmlNode.scrollTop || bodyNode && bodyNode.scrollTop || 0) - (htmlNode.clientTop || bodyNode.clientTop),
						left: (htmlNode.scrollLeft || bodyNode && bodyNode.scrollLeft || 0) - (htmlNode.clientLeft || bodyNode.clientLeft)
					}
				}
			},

			getEC: function(node) {
				function $(node) {
					var boundingClientRect = node.getBoundingClientRect();
					return {
						top: Math.round(_.common.metrics.getPS().top + boundingClientRect.top),
						left: Math.round(_.common.metrics.getPS().left + boundingClientRect.left)
					}
				}
				function $$(node) {
					var top = left = 0;
					while (node) {
						top = top + parseFloat(node.offsetTop);
						left = left + parseFloat(node.offsetLeft);
						node = node.offsetParent;
					}
					return { top: top, left: left }
				}
				if (node && node.nodeType == 1) {
					if (node.getBoundingClientRect) {
						return $(node);
					}
					else {
						return $$(node);
					}
				}
			},

			vw: function() {
				return _.innerWidth || htmlNode.clientWidth || bodyNode.clientWidth;
			},

			vh: function() {
				return _.innerHeight || htmlNode.clientHeight || bodyNode.clientHeight;
			}
		}

		// In order to work with CORS see server-side part (https://developer.mozilla.org/en-US/docs/Web/HTTP/Server-Side_Access_Control)
		,request: (function(alias) {

			var

			CORSSupport = ('XMLHttpRequest' in _) && 'withCredentials' in new _.XMLHttpRequest(),
			XDRSupport = 'XDomainRequest' in _,
			JSONSupport = _.JSON && _.JSON.parse && _.JSON.stringify,
			htmlType = 'text/html',
			jsonType = 'application/json',
			DOMDocumentVersions = [
				'MSXML2.DOMDocument.6.0',
				'MSXML2.DOMDocument.5.0',
				'MSXML2.DOMDocument.4.0',
				'MSXML2.DOMDocument.3.0',
				'MSXML2.DOMDocument',
				'MSXML.DOMDocument',
				'Microsoft.XMLDOM'
			],
			XMLHttpVersions = [
				'MSXML2.XMLHTTP.6.0',
				'MSXML2.XMLHTTP.3.0',
				'MSXML2.XMLHTTP',
				'Microsoft.XMLHTTP'
			],
			states = [
				'UNSENT',
				'OPENED',
				'HEADERS_RECEIVED',
				'LOADING',
				'DONE'
			],
			accepts = {
				'script': 'text/javascript, application/javascript',
				'json': jsonType,
				'html': htmlType,
				'text': 'text/plain',
				'xml': 'application/xml, text/xml'
			},
			incorrectHeaderRE = /[^a-z0-9\-#$%&'*+.\^_`|~]/i,
			protocolRE = /^([\w-]+:)\/\//,
			scriptTypeRE = /^(?:text|application)\/(?:x-)?javascript/i,
			localProtocolRE = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
			xmlTypeRE = /^(?:text|application)\/xml/i,

			console = function(method, text) {
				if (('console' in _) && 'function' == typeof _.console[method]) {
					_.console[method](text);
				}
			},

			emptyfunc = Function(''),

			getAjaxTransport = function() {
				var transport, axo = _.ActiveXObject, i = ~0;
				// Although IE supports the XMLHttpRequest object, but it does not work on local files
				if (_.XMLHttpRequest && !(axo && location.protocol == 'file:')) {
					transport = new _.XMLHttpRequest();
				}
				else if (axo) {
					while(++i < XMLHttpVersions.length) {
						try {
							transport = new axo(XMLHttpVersions[v]); break;
						}
						catch(boo) {}
					}
					if (!transport) {
						throw new Error('No transport support');
					}
				}
				for (var j = 0; j < states.length; ++j) {
					if (false == (states[j] in transport)) {
						transport[states[j]] = j;
					}
				}
				return transport;
			},

			XHRSupport = (function() {
				try {
					return !!getAjaxTransport();
				}
				catch (boo) {
					return false;
				}
			})(),

			getMSXMLDocumentObject = function() {
				var i = ~0;
				if (_.ActiveXObject) {
					while(++i < DOMDocumentVersions.length) {
						try {
							return new _.ActiveXObject(DOMDocumentVersions[i]);
						}
						catch(boo) {}
					}
				}
				else {
					return console('error', 'No ActiveXObject');
				}
				return console('error', 'No MSXML');
			},

			parseXML = function(transport) {
				var xmlDocument = transport.responseXML, pe, parser, parsingError = false;
				// If responseXML is not valid, try to create the XML document from the responseText property
				if (!xmlDocument || !xmlDoc.documentElement) {
					if (_.DOMParser) {
						parser = new _.DOMParser();
						try {
							xmlDocument = parser.parseFromString(transport.responseText, 'text/xml');
						}
						catch(boo) {
							return console('error', boo.message);
						}
					}
					// IE9-
					else {
						try {
							if (xmlDocument = getMSXMLDocumentObject()) {
								xmlDocument.async = false;
								xmlDocument.loadXML(transport.responseText);
							}
							else {
								return xmlDocument;
							}
						}
						catch(boo) {
							return console('error', boo.message);
						}
					}
				}
				// If there was an error while parsing the XML document
				if ((pe = xmlDocument.parseError) && pe.errorCode != 0) {
					parsingError = 'XML parsing error: ' + pe.reason + ' at line ' + pe.line;
				}
				else {
					if (xmlDocument.documentElement) {
						if (xmlDocument.documentElement.nodeName == "parsererror") {
							parsingError = xmlDocument.documentElement.childNodes[0].nodeValue;
						}
					}
				}
				return parsingError ? console('error', parsingError) : xmlDocument;
			},

			toQP = function(key, value) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(value);
			},
			toQS = function(p) {
				var res = [];
				if (Object(p) === p) {
					for (var field in p) {
						if (common._.owns(p, field)) {
							res.push(
								toQP(field, String(p[field]))
							)
						}
					}
				}
				else if('string' == typeof p) {
					return p;
				}
				return res.join('&').replace(/%20/g, '+');
			},
			
			mime2Type = function(mime) {
				return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
			},

			requestSuccess = function(data, context, success) {
				if (success) {
					success.call(context, data);
				}
			},

			requestError = function(errorMessage, context, error) {
				if (error) {
					error.call(context, console('error', errorMessage));
				}
			},

			isRequestSuccessful = function(transport, url) {
				return (transport.status >= 200 && transport.status < 300)
					|| transport.status == 304
					|| transport.status == 1223
					|| (transport.status == 0 && localProtocolRE.test(protocolRE.test(url) ? RegExp.$1 : _.location.protocol));
			},

			request = function(params) {
				var method = (params.method || 'GET').toUpperCase(),
						url = params.url || _.location.toString(),
						dataType = params.dataType || 'text',
						mimeType = accepts[dataType],
						data = params.data || '',
						authName = params.authName || '',
						authPassword = params.authPassword || '',
						timeout = params.timeout || 0,
						async = false !== params.async,
						caching = false !== params.caching,
						credentials = true === params.credentials,
						headers = (/^([\w-]+:)?\/\/([^\/]+)/.test(url) && RegExp.$2 != _.location.host)
							? {} : { 'X-Requested-With': 'XMLHttpRequest' },
					 _headers = params.headers;

				var transport = getAjaxTransport(),
						abortTimeout = void(false);

				if (Object(data) === data) {
					if (data instanceof _.FormData) {
						headers['Content-Type'] = 'multipart/form-data';
					}
					else {
						data = toQS(data);
					}
				}
				if ('POST' == method) {
					headers['Content-Type'] = headers['Content-Type'] ||
					// default enctype for GET
					'application/x-www-form-urlencoded; charset=UTF-8';
				}
				if (_headers) {
					for (var header in _headers) {
						if (common._.owns(_headers, header)) {
							if (false == incorrectHeaderRE.test(header)) {
								headers[header] = _headers[header];
							}
							else {
								throw new TypeError('Invalid character in header field name');
							}
						}
					}
				}
				transport.onreadystatechange = function() {
					if (this.readyState == this.DONE) {
						var data, error = false;
						_.clearTimeout(abortTimeout);
						if (isRequestSuccessful(this, url)) {
							try {
								dataType = dataType || mime2Type(this.getResponseHeader ? this.getResponseHeader('Content-Type').split(';')[0] : false);
								data = this.responseText;
								if (dataType == 'script') {
									(true, _.eval)(data);
								}
								else if (dataType == 'xml') {
									if (!(data = parseXML(this))) {
										throw {
											message: 'XML Parsing Error'
										}
									}
								}
								else if (dataType == 'json') {
									if (/^\s*$/.test(data)) {
										data = {};
									}
									else {
										if (JSONSupport) {
											data = JSON.parse(data);
										}
									}
								}
							}
							catch(boo) {
								error = boo;
							}
							if (!error) {
								requestSuccess(data, this, params.success);
							}
							else {
								requestError(error.message, this, params.error);
							}
						}
						else {
							requestError(
								'Request error (status: ' + this.status + ', statusText: ' + this.statusText + ')', this, params.error
							)
						}
					}
				}
				if (!caching) {
					// IE11+
					if ('msCaching' in transport) {
						if (transport.msCachingEnabled()) {
							transport.msCaching = 'disabled';
						}
					}
					else {
						try {
							transport.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
						}
						catch(boo) {
							url = url + (url.match(/\?/) ? '&' : '?') + 'no-cache=' + (new Date()).getTime();
						}
					}
				}
				if (method == 'GET') {
					url = url + (url.match(/\?/) ? '&' : '?') + data;
					data = void(0);
				}
				transport.open(method, url, async, authName, authPassword);

				if (mimeType) {
					// Lists the MIME types expected by the UA
					if (!headers['Accept']) {
						headers['Accept'] = mimeType;
					}
					if (transport.overrideMimeType) {
						// Sets the Content-Type header for the response to the MIME provided
						transport.overrideMimeType(
							mimeType.indexOf(',') > -1 ? mimeType.split(',', 2)[0] : mimeType
						)
					}
				}
				if (transport.setRequestHeader) {
					for (var header in headers) {
						if (common._.owns(headers, header)) {
							transport.setRequestHeader(header, headers[header]);
						}
					}
				}
				if (credentials && CORSSupport) {
					// Include cookies and authentication
					transport.withCredentials = true;
				}
				if (timeout > 0) {
					var timeoutExceeded = 'Request error (timeout exceeded)';
					if (('timeout' in transport) && 'ontimeout' in transport) {
						transport.timeout = timeout;
						transport.ontimeout = function() {
							this.onreadystatechange = emptyfunc;
							this.abort();
							requestError(timeoutExceeded, this, params.error);
						}
					}
					// IE8-
					else {
						abortTimeout = _.setTimeout(function() {
							transport.onreadystatechange = emptyfunc;
							requestError(timeoutExceeded, transport, params.error);
						}, timeout);
					}
				}
				// Avoid sending empty string
				transport.send(data ? data : null);
			},

			executeRequest = function(method, params, json) {
				var defaultJSONMethodRequest = json;
				if ('string' == typeof params) {
					if (method) {
						request({
							method: method, url: params
						});
					}
					else {
						request({
							method: defaultJSONMethodRequest, url: params, dataType: 'json'
						});
					}
				}
				else if (params == Object(params)) {
					if (method) {
						params.method = method;
					}
					else {
						if (!params.hasOwnProperty('method')) params.method = defaultJSONMethodRequest;
						if (!params.hasOwnProperty('dataType')) params.dataType = 'json';
					}
					request(params);
				}
				else {
					throw new TypeError('Method expects string or object type');
				}
			},

			jsonpID = 0;
			
			return (alias = {
				
				CORSSupport: CORSSupport,
				XDRSupport: XDRSupport,
				XHRSupport: XHRSupport,
				JSONSupport: JSONSupport,
				toQP: toQP,
				toQS: toQS,

				get: function(params) {
					executeRequest('GET', params);
				},
				post: function(params) {
					executeRequest('POST', params);
				},
				json: function(params) {
					executeRequest(void(0), params, 'POST');
				},
				xdr: function(params) {
					var url = params.url || _.location.toString(),
							method = (params.method || 'POST').toUpperCase(),
							data = params.data ? toQS(params.data) : '',
							timeout = params.timeout || 0,
							currentProtocol = _.location.protocol,
							protocolRE = /^(https?:)/,
							validProtocol = protocolRE.test(protocolRE.test(url) && url || currentProtocol),
							validMethod = method == 'POST' || method == 'GET',
							hasHeaders = Object(params.headers) == params.headers,
							hasCredentials = params.credentials == true,
							sameScheme = /^\/\/?/.test(url) || protocolRE.test(url) && RegExp.$1 == currentProtocol,
							xdr;
					// XDR Restrictions (Only HTTP/HTTPS, Only GET/POST, No headers, No authentication or cookies (credentials), Same scheme)
					if (XDRSupport && validProtocol && validMethod && !hasHeaders && !hasCredentials && sameScheme) {
						xdr = new _.XDomainRequest();
						if (method == 'GET') {
							url = url + (url.match(/\?/) ? '&' : '?') + data;
							data = void(0);
						}
						xdr.open(method, url);
						xdr.onerror = function() {
							requestError('Cannot perform XDR Request', this, params.error);
						}
						xdr.onload = function() {
							requestSuccess(this.responseText, 
								this, params.success);
						}
						if (timeout > 0) {
							xdr.timeout = timeout;
							xdr.ontimeout = function() {
								this.abort();
								requestError('Cannot perform XDR Request (timeout exceeded)', this, params.error);
							}
						}
						xdr.send(data ? data : null);
					}
					else {
					}
				},
				jsonp: function(params) {
					return alias.script(params);
				},
				script: function(params) {
					var script = _.document.createElement('script'),
							callbackName = (function(jsonpN) { do { jsonpN = 'jsonp' + (++jsonpID); } while(jsonpN in _); return jsonpN; })(),
							callback = 'callback=' + callbackName,
							callbackInvoked = false,
							url = params.url || _.location.toString(),
							callbackCheckInvocation;

					script.src = (url = url + (url.match(/\?/) ? '&' : '?') + callback + (params.data ? '&' + toQS(params.data) : ''));
					script.type = 'text/javascript';
					script.charset = 'UTF-8';

					_[callbackName] = function(data) {
						callbackInvoked = true;
						delete _[callbackName];
						headNode.removeChild(script);
						try {
							requestSuccess(arguments.callee.caller == alias.jsonp && JSONSupport ? JSON.parse(data) : data, _, params.success);
						}
						catch(boo) {
							requestError(boo.message, _, params.error);
						}
					}

					callbackCheckInvocation = function() {
						if (callbackInvoked) {
							return true;
						}
						else {
							delete _[callbackName];
							headNode.removeChild(script);
							requestError('Cannot perform JSONP Request', _, params.error);
						}
					}

					if ('readyState' in script) {
						script.onreadystatechange = function() {
							if (this.readyState == 'loaded' || this.readyState == 'complete') {
								this.onreadystatechange = null;
								// Wait for callbackName script execution
								_.setTimeout(callbackCheckInvocation, 0);
							}
						}
					}
					else {
						// Fully loaded and executed
						script.onload = callbackCheckInvocation;
						// Not loaded for some reason
						script.onerror = callbackCheckInvocation;
					}
					headNode.insertBefore(script, headNode.firstChild || null);
				}
			})
		})()

		,cookie: (function(self) {
			
			var enc = _.encodeURIComponent,
					dec = _.decodeURIComponent,

					maxExpire = '; expires=Fri, 31 Dec 9999 23:59:59 GMT',
					endExpire = '; expires=Thu, 01 Jan 1970 00:00:00 GMT',

			prepareKey = function(key) {
				return encodeURIComponent(key).replace(
					/[\-\.\+\*\(\)]/g, '\\$&'
				)
			},
			cookie = function(type, key, value, expires, params) {
				if (type == 'get') {
					/**
					 * document.cookie is an accessor property with native setter and getter functions, 
					 * and consequently is not a data property with a value: 
					 * what you write is not the same than you read, everything is always mediated by the JavaScript interpreter
					 *
					 */
					return _.document.cookie;
				}
				else if (type == 'set') {
					return _.document.cookie = enc(key) + '=' + (enc(value) || '') + expires +
						(params.domain 	? '; domain=' + params.domain : '') +
						(params.path 		? '; path=' 	+ params.path 	: '') +
						(params.secure 	? '; secure' : '')
				}
			}

			return (self = {
			/**
			 * Create/overwrite a cookie
			 *
			 * @param {string} key
			 *		The name of the cookie to create/overwrite
			 *
			 * @param {string} value
			 *		The value of the cookie
			 *
			 * @param {Object} [params] 
			 *		The set of optional parameters
			 *
				 * @param {number|string|Date} [params.end] Expire date 
				 *	number
				 *		864e2 (for a day)
				 *		6048e2 (for a week)
				 *		2592e3 (for a month)
				 *		31536e3 (for a year)
				 *		Infinity (for a never-expires cookie)
				 *	string
				 *		GMTString date format
				 *	Date
				 *		An instance of a Date
				 *	If not specified it will expire at the end of session.
				 *
				 * @param {string} [params.path] The path from where the cookie will be readable
				 *	/
				 *	/path1
				 *	/path1/path2
				 *	If not specified, defaults to the current path of the current document location.
				 *
				 * @param {string} [params.domain] The domain from where the cookie will be readable
				 *	xxx.org
				 *	.xxx.org (includes all subdomains)
				 *	xxxxxx.xxx.org
				 *	If not specified, defaults to the host portion of the current document location
				 *
				 * @param {boolean} [params.secure] The cookie will be transmitted only over secure protocol as https
			 *
			 * @returns {boolean}
			 */
				set: function(key, value, params) {
					params = params || {};
					var expires = '', end = params.end;
					if (key && !/^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
						if (end) {
							if (end.constructor == Number) {
								if (end === Infinity) {
									expires = maxExpire;
								}
								else {
									expires = '; max-age=' + end;
								}
							}
							else if (end.constructor == String) { expires = '; expires=' + end; }
							else if (end.constructor == Date) 	{ expires = '; expires=' + end.toUTCString(); }
						}
						return Boolean(cookie('set', key, value, expires, params));
					}
					else {
						return false;
					}
				},

			/**
			 * Delete a cookie
			 *
			 * @param {string} key
			 *		The name of the cookie to create/overwrite
			 *
			 * @param {Object} [params] 
			 *		The set of optional parameters
			 *
			 * @returns {boolean}
			 */
				remove: function(key, params) {
					params = params || {};
					if (key && self.has(key)) {
						return Boolean(cookie('set', key, '', endExpire, params));
					}
					else {
						return false;
					}
				},

				/**
				 * Read a cookie
				 *
				 * @param {string} key. The name of the cookie to read.
				 * @returns {string|null}
				 */
				get: function(key) {
					return dec(cookie('get').replace(new RegExp('(?:(?:^|.*;)\\s*' + prepareKey(key) + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
				},

				/**
				 * Check if a cookie exists
				 *
				 * @param {string} key. The name of the cookie to test.
				 * @returns {boolean}
				 */
				has: function(key) {
					return (new RegExp('(?:^|;\\s*)' + prepareKey(key) + '\\s*\\=')).test(cookie('get'));
				},

				/**
				 * Get all cookie-keys for current location
				 * @returns {array}
				 */
				keys: function() {
					var j = ~0, encodedKeys = cookie('get').replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
					while(++j < encodedKeys.length) {
						encodedKeys[j] = dec(encodedKeys[j]);
					}
					return encodedKeys;
				}
			})
		})()

		,_: { owns: owns, trim: trim }
	}

})(window);
