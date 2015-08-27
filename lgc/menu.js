;(function(_) {

	var dom = common.dom
		 ,toggle = dom.get('menu-toggle')
		 ,menu = dom.get('menu')
		 ,content = dom.get('content')

	toggle.onclick = function(Event) {
		if (common.dom.containsClass(menu, 'show')) {
			dom.removeClass(menu, 'show');
			dom.removeClass(content, 'show');
			dom.addClass(menu, 'hide');
			dom.addClass(content, 'hide');
		}
		else {
			dom.removeClass(menu, 'hide');
			dom.removeClass(content, 'hide');
			dom.addClass(menu, 'show');
			dom.addClass(content, 'show');
		}
	}

})(window);