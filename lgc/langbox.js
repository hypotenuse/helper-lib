;(function(_) {
	if (common.cookie.get('i18n') == null) {
		// show langBox after 700ms
		_.setTimeout(
			'common.dom.addClass(common.dom.get(\'langBox\'), \'show\')', 700
		)
	}
})(window);