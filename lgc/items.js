;(function(_) {

	var itemHeaderClass = 'item-header'
		 ,itemHeaders = common.dom.getByClassName(common.dom.get('section-about'), itemHeaderClass)

	,getItemText = function(itemHeader) {
		var itemText = itemHeader.nextSibling;
		if (itemText.nodeType == 1) {
			return itemText;
		}
		else {
			if (itemHeader.nextElementSibling) {
				return itemHeader.nextElementSibling;
			}
			else {
				while(itemText.nodeType != 1) {
					itemText = itemText.nextSibling;
				}
				return itemText;
			}
		}
	}

	,getItemHeader = function(itemHeader) {
		if (!common.dom.containsClass(itemHeader, itemHeaderClass)) {
			itemHeader = itemHeader.parentNode;
		}
		return itemHeader;
	}

	,toggleArrow = function(arrow) {
		if (common.dom.containsClass(arrow, 'fa-angle-down')) {
			common.dom.removeClass(arrow, 'fa-angle-down');
			common.dom.addClass(arrow, 'fa-angle-up');
		}
		else {
			common.dom.removeClass(arrow, 'fa-angle-up');
			common.dom.addClass(arrow, 'fa-angle-down');
		}
	}
	
	,indicate = function(itemHeader, itemText, toggle) {
		if (toggle) {
			common.dom.toggleClass(itemHeader, 'current');
			common.dom.toggleClass(itemText, 'current');
			toggleArrow(itemHeader.children[0]);
		}
		else {
			if (previousItemHeader && common.dom.containsClass(previousItemHeader, 'current')) {
				common.dom.removeClass(previousItemHeader, 'current');
				common.dom.removeClass(previousItemText, 'current');
				toggleArrow(previousItemHeader.children[0]);
			}
			common.dom.addClass(previousItemHeader = itemHeader, 'current');
			common.dom.addClass(previousItemText = itemText, 'current');
			toggleArrow(itemHeader.children[0]);
		}
	}

	,itemHeaderHandler = function(Event) {

		var currentItemHeader = getItemHeader(common.event.getTarget(Event))
			 ,currentItemText = getItemText(currentItemHeader);
		
		if (previousItemHeader) {
			if (previousItemHeader == currentItemHeader) {
				indicate(previousItemHeader, previousItemText, true);
			}
			else {
				indicate(currentItemHeader, currentItemText, false);
			}
		}
		else {
			indicate(currentItemHeader, currentItemText, false);
		}
	}

	,previousItemText = previousItemHeader = void(0);

	for(var j = 0; j < itemHeaders.length; ++j) {
		itemHeaders[j].onclick = itemHeaderHandler;
	}

})(window);