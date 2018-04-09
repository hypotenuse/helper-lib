# helper-lib (v1.0 Currently not supported)
Helper library (exports common object to the global)

Contains (dom, event, metrics, request, cookie, _ objects)

#### common.dom.htmlNode => @element
#### common.dom.headNode => @element
#### common.dom.bodyNode => @element
#### common.dom.html => @element
#### common.dom.head => @element
#### common.dom.body => @element
#### common.dom.get => @function
#### common.dom.getByClassName => @function
#### common.dom.dataset => @function
#### common.dom.text => @function
#### common.dom.html => @function
#### common.dom.insert => @function
#### common.dom.containsClass => @function
#### common.dom.addClass => @function
#### common.dom.removeClass => @function
#### common.dom.toggleClass => @function


#### common.event.getEvent => @function
#### common.event.getTarget => @function
#### common.event.stopPropagation => @function
#### common.event.preventDefault => @function
#### common.event.on => @function
#### common.event.off => @function


#### common.metrics.getPS => @function
#### common.metrics.getEC => @function
#### common.metrics.vw => @function
#### common.metrics.vh => @function


#### common.request.CORSSupport => @bool
#### common.request.XDRSupport => @bool
#### common.request.XHRSupport => @bool
#### common.request.JSONSupport => @bool
#### common.request.toQP => @function
#### common.request.toQS => @function
#### common.request.get => @function
#### common.request.post => @function
#### common.request.xdr => @function
#### common.request.jsonp => @function
#### common.request.script => @function


#### common.cookie.set => @function
#### common.cookie.get => @function
#### common.cookie.remove => @function
#### common.cookie.has => @function
#### common.cookie.keys => @function


#### common._.owns => @function
#### common._.trim => @function
