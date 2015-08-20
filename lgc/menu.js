;(function(_) {

	var mToggle = common.dom.get('menu-toggle')
		 ,menu = common.dom.get('menu')
		 ,content = common.dom.get('content')
		 ,state = 'show';

	mToggle.onclick = function(Event) {
		if (state == 'show') {
			state = 'hide';
			content.style.marginLeft = '0px';
			menu.style.marginLeft = '-260px';
		}
		else {
			state = 'show';
			content.style.marginLeft = '260px';
			menu.style.marginLeft = '0';
		}
	}

})(window);