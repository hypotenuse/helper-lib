;(function(_) {
	/*
	function GS(itemsWrapper, itemsListWrapper, leftArrow, rightArrow, itemsCount, showCount) {
		this._itemsWrapper = itemsWrapper;
		this._itemsListWrapper = itemsListWrapper;
		this._leftArrow = leftArrow;
		this._rightArrow = rightArrow;
		this._itemsCount = itemsCount;
		this._showCount = showCount;
		this._itemsRR = this._itemsCount - this._showCount;
		this._itemsRL = 0;
		this._position = 0;
		this._itemWidth = 205;
	}

	GS.prototype = {
		constructor: GS,

		updatePosition: function(pos) {
			// Use translate in order to achieve smoother animation
			var vendors = [
				'webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'
			];
			for (var v = 0; v < vendors.length; ++v) {
				this._itemsWrapper.style[vendors[v]] = 'translateX( ' + pos  + 'px)';
			}
			return this;
		},
			
		initEvents: function() {
			var self = this;
			if (self._itemsCount > self._showCount) {
				self._leftArrow.onclick = self._rightArrow.onclick = function(Event) {
					var target = common.event.getTarget(Event);
					if (target.id.charAt(0) == 'r') {
						if (self._itemsRR == 0) {
							self._position = self._itemsRL = 0;
							self._itemsRR = self._itemsCount - self._showCount;
						}
						else {
							if (self._itemsRR < self._showCount) {
								self._position = self._position - self._itemsRR * self._itemWidth;
								self._itemsRL = self._itemsRL + self._itemsRR;
								self._itemsRR = 0;
							}
							else {
								self._position = self._position - self._showCount * self._itemWidth;
								self._itemsRL = self._itemsRL + self._showCount;
								self._itemsRR = self._itemsRR - self._showCount;
							}
						}
					}
					else {
						if (self._itemsRL == 0) {
							self._position = self._position - self._itemsRR * self._itemWidth;
							self._itemsRL = self._itemsRL + self._itemsRR;
							self._itemsRR = 0;
						}
						else {
							if (self._itemsRL < self._showCount) {
								self._position = self._position + self._itemsRL * self._itemWidth;
								self._itemsRR = self._itemsRR + self._itemsRL;
								self._itemsRL = 0;
							}
							else {
								self._position = self._position + self._showCount * self._itemWidth;
								self._itemsRL = self._itemsRL - self._showCount;
								self._itemsRR = self._itemsRR + self._showCount;
							}
						}
					}
					self.updatePosition(self._position);
				}
			}
			return this;
		},
			
		prepareWrappers: function() {
			this._itemsWrapper.style.width = this._itemWidth * this._itemsCount + 'px';
			this._itemsListWrapper.style.width = this._itemWidth * this._showCount + 'px';
			return this;
		},

		changeShowCount: function(count) {
			this._showCount = count;
			this._itemsRL = this._position = 0;
			this._itemsRR = this._itemsCount - this._showCount;
			this.prepareWrappers();
			this.updatePosition(this._position);
			return this;
		}
	}
	*/
	var escCode = 27

	,documentElement = _.document.documentElement
	,documentBody = _.document.body || _.document.getElementsByTagName('body')[0]
	
	,itemData = i18n._worksData
	,itemsList = [ common.dom.get('items-list-1'), common.dom.get('items-list-2') ]
	,itemIndexesLast

	,shboxContentWrap = common.dom.get('shbox-content-wrap')
	,shboxArrowLeft = common.dom.get('shbox-arrow-left')
	,shboxArrowRight = common.dom.get('shbox-arrow-right')
	,shboxClose = common.dom.get('shbox-close')
	,itemShowBox = common.dom.get('item-showbox')
	,shboxItemPrev = common.dom.get('item-prev')
	,shboxItemNext =  common.dom.get('item-next')

	//,gs_1 = new GS(itemsWrapper[0], itemsWrapper[0].parentNode.parentNode, common.dom.get('larrow-1'), common.dom.get('rarrow-1'), itemData[0].length, 3).prepareWrappers().initEvents()
	//,gs_2 = new GS(itemsWrapper[1], itemsWrapper[1].parentNode.parentNode, common.dom.get('larrow-2'), common.dom.get('rarrow-2'), itemData[1].length, 3).prepareWrappers().initEvents()

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
		
		var data = itemData[itemIndexX][itemIndexY], shboxLinks;

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
	
	var vw = _.innerWidth || documentElement.clientWidth || documentBody.clientWidth,
			vh = _.innerHeight || documentElement.clientHeight || documentBody.clientHeight;
	
	if (shboxContentWrap.clientHeight > vh) {
		cssText(shboxArrowRight, 'position:fixed');
		cssText(shboxArrowLeft, 'position:fixed');
	}
	else {
		cssText(shboxArrowRight, 'position:absolute');
		cssText(shboxArrowLeft, 'position:absolute');
	}
	/*
	if (vw > 930) {
		gs_1.changeShowCount(3);
		gs_2.changeShowCount(3);
	}
	else if (930 >= vw && vw >= 420) {
		gs_1.changeShowCount(2);
		gs_2.changeShowCount(2);
	}
	else if (420 >= vw) {
		gs_1.changeShowCount(1);
		gs_2.changeShowCount(1);
	}
	*/
}

for (var j = 0; j < itemsList.length; ++j) {
	for (var p = 0; p < itemData[j].length; ++p) {
		common.dom.insert('html', 'be', itemsList[j], formItem(
			j + '-' + p
		 ,itemData[j][p].src
		 ,itemData[j][p].name
		))
	}
}

for (var j = 0; j < itemsList.length; ++j) {
	for (var items = itemsList[j].getElementsByTagName('a'), k = 0; k < items.length; ++k) {
		items[k].onclick = itemClick;
	}
}

_.onresize();

})(window);