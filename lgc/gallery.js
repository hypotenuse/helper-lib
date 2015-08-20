;(function(_) {
	
	var updatePosition = function(itemsWrapper, position) {
		// Use translate in order to achieve smoother animation
		var vendors = [
			'webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'
		];
		for (var v = 0; v < vendors.length; ++v) {
			itemsWrapper.style[vendors[v]] = 'translateX( ' + position  + 'px)';
		}
	}

	,gallerize = function(itemsWrapper, leftArrow, rightArrow, itemsCount, showCount, itemWidth) {
			
		var itemsRL = 0
		   ,itemsRR = itemsCount - showCount
		   ,position = 0;

		if (itemsCount > showCount) {
			leftArrow.onclick = rightArrow.onclick = function(Event) {
					
				var target = common.event.getTarget(Event);

				// Direction Right
				if (target.id.charAt(0) == 'r') {
					// Show first `showCount` items
					if (itemsRR == 0) {
						position = itemsRL = 0;
						itemsRR = itemsCount - showCount;
					}
					else {
						if (itemsRR < showCount) {
							position = position - itemsRR * itemWidth;
							itemsRL = itemsRL + itemsRR;
							itemsRR = 0;
						}
						else {
							position = position - showCount * itemWidth;
							itemsRL = itemsRL + showCount;
							itemsRR = itemsRR - showCount;
						}
					}
				}
				// Direction Left
				else {
					// Show last `showCount` items
					if (itemsRL == 0) {
						position = position - itemsRR * itemWidth;
						itemsRL = itemsRL + itemsRR;
						itemsRR = 0;
					}
					else {
						if (itemsRL < showCount) {
							position = position + itemsRL * itemWidth;
							itemsRR = itemsRR + itemsRL;
							itemsRL = 0;
						}
						else {
							position = position + showCount * itemWidth;
							itemsRL = itemsRL - showCount;
							itemsRR = itemsRR + showCount;
						}
					}
				}
				updatePosition(itemsWrapper, position);
			}
		}
	}

	,escCode = 27
	,documentElement = _.document.documentElement
	,documentBody = _.document.body || _.document.getElementsByTagName('body')[0]
	,showCount = 3
	,itemWidth = 205 //+ 5 * 2 // + 3 * 2

	,itemData = i18n._worksData
	,itemsWrapper = [ common.dom.get('items-wrapper-1'), common.dom.get('items-wrapper-2') ]
	,itemIndexesLast
	,shboxContentWrap = common.dom.get('shbox-content-wrap')
	,shboxArrowLeft = common.dom.get('shbox-arrow-left')
	,shboxArrowRight = common.dom.get('shbox-arrow-right')
	,shboxClose = common.dom.get('shbox-close')
	,itemShowBox = common.dom.get('item-showbox')
	,shboxItemPrev = common.dom.get('item-prev')
	,shboxItemNext =  common.dom.get('item-next')

	,sw = (function() {
		var boxA = document.createElement('div')
			 ,boxB = document.createElement('div')
			 ,w, _w;
		boxA.style.cssText = 'width:100px;height:100px;position:absolute;visibility:hidden';
		boxB.style.cssText = 'width:50px;height:105px';
		documentBody.appendChild(boxA);
		w = boxA.clientWidth;
		boxA.style.cssText += 'overflow-y:scroll';
		boxA.appendChild(boxB);
		_w = boxA.clientWidth;
		documentBody.removeChild(boxA);
		return w - _w;
	})()
	
	,cssText = function(node, value) {
		node.style.cssText = value;
	}

	,sbarHide = function() {
		cssText(documentElement, 'overflow:hidden;margin-right:' + sw + 'px');
	}

	,sbarShow = function() {
		cssText(documentElement, 'overflow:visible');
	}

	,formItem = function(index, src, name) {
		return '<a data-index=\"' + index + '\"><div class=\"item\"><div class=\"img-wrapper\"><img src=\"' + src + '\" /></div><p>' + name + '</p></div></a>';
	}

	,formLink = function(url, text) {
		return '<div class=\"shbox-link\"><a href=\"' + url + '\" target=\"_blank\"><span>' + text + '</span></a></div>';
	}

	,_Event = function(Event) {
		common.event.stopPropagation(Event);
		common.event.preventDefault(Event);
	}

	,shbox = function(itemIndexX, itemIndexY) {
		
		var data = itemData[itemIndexX][itemIndexY];

		common.dom.html(common.dom.getByClassName(itemShowBox, 'shbox-title')[0], data.title);
		common.dom.html(common.dom.getByClassName(itemShowBox, 'shbox-revision-date')[0], data.revisionDate);
		common.dom.html(common.dom.getByClassName(itemShowBox, 'shbox-item-text')[0], data.text);
		common.dom.html(shboxLinks = common.dom.getByClassName(itemShowBox, 'shbox-item-links')[0], '');

		cssText(common.dom.getByClassName(itemShowBox, 'shbox-item-image')[0], 'background-image: url(' + data.src + ')');

		for (var p = 0; p < data.links.length; ++p) {
			common.dom.insert('html', 'be', shboxLinks
				,formLink(
					data.links[p].url
				 ,data.links[p].text
				)
			)
		}
		_.onresize();
		common.dom.addClass(itemShowBox, 'show');
	}
	
	,itemClick = function(Event) {

		var data, shboxLinks;
		
		sbarHide();
		itemIndexesLast = common.dom.dataset(this, 'index').split('-');
		itemIndexesLast[0] = +itemIndexesLast[0];
		itemIndexesLast[1] = +itemIndexesLast[1];

		// shbox this!
		shbox(
			itemIndexesLast[0]
		 ,itemIndexesLast[1]
		)
		_Event(Event);
	}

shboxClose.onclick = _.document.onkeyup = function(Event) {
	_Event(Event = common.event.getEvent(Event));
	if(Event.keyCode == escCode || Event.type == 'click') {
		sbarShow();
		common.dom.removeClass(itemShowBox, 'show');
	}
}

shboxItemPrev.onclick = shboxItemNext.onclick = function(Event) {
	
	var dir;

	if (itemIndexesLast) {
		dir = common.dom.dataset(this, 'dir');
		if (dir == 'prev') {
			if (itemIndexesLast[0] == 1) {
				if (itemIndexesLast[1] == 0) {
					itemIndexesLast[0] = 0;
					itemIndexesLast[1] = itemData[0].length - 1;
				}
				else {
					--itemIndexesLast[1];
				}
			}
			else {
				if (itemIndexesLast[1] > 0) {
					--itemIndexesLast[1];
				}
				else {
					itemIndexesLast[0] = 1;
					itemIndexesLast[1] = itemData[1].length - 1;
				}
			}
		}
		else {
			if (itemIndexesLast[0] == 1) {
				if (itemData[1][itemIndexesLast[1] + 1]) {
					++itemIndexesLast[1];
				}
				else {
					itemIndexesLast[0] = 0;
					itemIndexesLast[1] = 0;
				}
			}
			else {
				if (itemData[0][itemIndexesLast[1] + 1]) {
					++itemIndexesLast[1];
				}
				else {
					itemIndexesLast[0] = 1;
					itemIndexesLast[1] = 0;
				}
			}
		}
		// shbox this!
		shbox(
			itemIndexesLast[0]
		 ,itemIndexesLast[1]
		)
	}
	_Event(Event);
}

_.onresize = function(Event) {
	if (shboxContentWrap.clientHeight > (_.innerHeight || documentElement.clientHeight || documentBody.clientHeight)) {
		cssText(shboxArrowRight, 'position:fixed');
		cssText(shboxArrowLeft, 'position:fixed');
	}
	else {
		cssText(shboxArrowRight, 'position:absolute');
		cssText(shboxArrowLeft, 'position:absolute');
	}
}

for (var j = 0; j < itemsWrapper.length; ++j) {
	for (var p = 0; p < itemData[j].length; ++p) {
		common.dom.insert('html', 'be', itemsWrapper[j], formItem(
			j + '-' + p
		 ,itemData[j][p].src
		 ,itemData[j][p].name
		))
	}
}

for (var j = 0; j < itemsWrapper.length; ++j) {
	for (var items = itemsWrapper[j].getElementsByTagName('a'), k = 0; k < items.length; ++k) {
		items[k].onclick = itemClick;
	}
}

gallerize(itemsWrapper[0], common.dom.get('larrow-1'), common.dom.get('rarrow-1'), itemData[0].length, showCount, itemWidth);
gallerize(itemsWrapper[1], common.dom.get('larrow-2'), common.dom.get('rarrow-2'), itemData[1].length, showCount, itemWidth);

_.onresize();

})(window);

