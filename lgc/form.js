
// NB: formspree.io limit: 1000 submissions per email for each month
;(function(_) {

	var formspreeForm = _.document.forms['formspree-form']

	,emailRE = new RegExp(
		'^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*' 
			+ '@' 
			+ '('
				+ '[a-z0-9_][-a-z0-9_]*(\\.[-a-z0-9_]+)*\\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])'
				+ '|'
				+ '([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})'
			+ ')'
			+ '(:[0-9]{1,5})?$', 'i'
	)

	,requestResult = function(data) {
		if (console && console.log) {
			console.log(
				'formspree.io request (status: ' + data.status + ', statusText: ' + data.statusText + ', response: ' + data.response + ')'
			);
		}
	}

	,validate = function(form) {

		var $ = form.elements

			 ,username = common._.trim($['username'].value)
			 ,usertext = common._.trim($['usertext'].value)
			 ,useremail = common._.trim($['useremail'].value)
		
		if (username.length == 0) {
			return 'emptyName';
		}
		
		if (useremail.length == 0) {
			return 'emptyEmail';
		}
		else if (emailRE.test(useremail) == false) {
			return 'invalidEmail';
		}
		
		if (usertext.length == 0) {
			return 'emptyText';
		}

		return {
			'username': username,
			'useremail': useremail,
			'usertext': usertext
		}
	}

	,formspreeIO = function(options) {
		var _ = function(data) {
			return {
				response: data,
				status: this.status,
				statusText: this.statusText,
				headers: this.getAllResponseHeaders()
			}
		}
		common.request.json({
			url: options.url,
			data: options.data,
			success: function(data) {
				options.ok(
					_.call(this, data)
				)
			},
			error: function(data) {
				options.fail(
					_.call(this, data)
				)
			}
		})
	}

	formspreeForm.onsubmit = function(Event) {
		var res = validate(this);
		if (typeof res == 'object') {
			_.popupBox.show({
				text: i18n._popupbox['ok'],
				ico: 'ok'
			});
			if (common.request.CORSSupport) {
				formspreeIO({
					url: '//formspree.io/ipankov64@gmail.com',
					data: res,
					ok: requestResult,
					fail: requestResult
				})
			}
			else {
				this.submit();
			}
		}
		// Validation error
		else {
			_.popupBox.show({
					text: i18n._popupbox[res],
					ico: 'fail'
			});
		}

		// Prevent default form submission
		common.event.preventDefault(Event);
	}

	// Mobile fix: menu intersects input elements when it is focused
	if ('onfocus' in document.createElement('div')) {
		var menu = common.dom.get('menu'), 
		
		vendors = [
			'webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'
		],
		moveMenu = function(y) {
			for (var v = 0; v < vendors.length; ++v) {
				menu.style[vendors[v]] = 'translateY(' + y + ')';
			}
		}
		
		onfocus = function(Event) {
			if (640 >= _.innerWidth || documentElement.clientWidth || documentBody.clientWidth) {
				moveMenu('-100%');
			}
		},
		onblur = function(Event) {
			moveMenu('0');
		}
		for (var names = ['username', 'useremail', 'usertext'], j = 0; j < names.length; ++j) {
			formspreeForm.elements[names[j]].onfocus = onfocus;
			formspreeForm.elements[names[j]].onblur = onblur;
		}
	}
})(window);