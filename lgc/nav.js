
;(function(_) {

	var 

	sections = [
		common.dom.get('section-intro')
	 ,common.dom.get('section-portfolio')
	 ,common.dom.get('section-about')
	 ,common.dom.get('section-contact')
	]

	,navItems = [
		common.dom.get('nav-intro')
	 ,common.dom.get('nav-portfolio')
	 ,common.dom.get('nav-about')
	 ,common.dom.get('nav-contact')
	]

	,indicate = function(navItem) {
		if (!common.dom.containsClass(navItem, 'current')) {
			for (var j = 0; j < navItems.length; ++j) {
				common.dom.removeClass(navItems[j], 'current');
			}
			common.dom.addClass(navItem, 'current');
		}
	}

	,navigate = function(section) {
		animate({
			timing: 'easeInOutQuint',
			duration: 400,
			range: [ common.metrics.getPS().top, common.metrics.getEC(section).top ],
			render: function(renderedValue) {
				_.scrollTo(0, renderedValue);
			}
		});
	}

	,navsHandler = function(Event) {
		var buttonBox = common.event.getTarget(Event)
			 ,buttonBoxGo;
		if (buttonBox.className != 'able-to') {
			buttonBox = buttonBox.parentNode;
		}
		if ((buttonBoxGo = common.dom.dataset(buttonBox , 'go-section')) != 'no') {
			navigate(
				sections[buttonBoxGo - 1]
			);
		}
	}

	_.onscroll = function() {

		var offset = 320, pst = common.metrics.getPS().top
		
		if 			(pst >= common.metrics.getEC( sections[3] ).top - offset) indicate( navItems[3] );
		else if (pst >= common.metrics.getEC( sections[2] ).top - offset) indicate( navItems[2] );
		else if (pst >= common.metrics.getEC( sections[1] ).top - offset) indicate( navItems[1] );
		else if (pst >= common.metrics.getEC( sections[0] ).top - offset) indicate( navItems[0] );

	}

	// Indicate current navigation item
	_.onscroll();

	_.onwheel = function(Event) { if (common.event.getEvent(Event).ctrlKey) return false; }

	navItems[0].onmousedown = _.onbeforeunload = function(Event) { if (common.event.getEvent(Event).type == 'beforeunload') _.scrollTo(0, 0); else navigate(sections[0]); }

	navItems[1].onmousedown = function() {
		navigate(sections[1]);
	}

	navItems[2].onmousedown = function() {
		navigate(sections[2]);
	}
	
	navItems[3].onmousedown = function() {
		navigate(sections[3]);
	}

	for (var j = 0; j < sections.length; ++j) {
		var navs = common.dom.getByClassName(sections[j], 'able-to');
		for (var k = 0; k < navs.length; ++k) {
			navs[k].onclick = navsHandler;
		}
	}

})(window);	