
// See components/_popup-box.sass if you want to modify popup view
;(function(_) {
	
	var gbc = common.dom.getByClassName
		 ,addClass = common.dom.addClass
		 ,removeClass = common.dom.removeClass;

	var popupBox = common.dom.get('popupBox')
		 ,statusIcoBox = gbc(popupBox, 'status-ico-i')[0]
		 ,statusTextBox = gbc(popupBox, 'status-text')[0]
		 ,buttonOkBox = gbc(popupBox, 'ok-button')[0]
		 ,escCode = 27
		 ,icoOk = 'fa-check-circle'
		 ,icoFail = 'fa-exclamation-circle'

	_.popupBox = {
		show: function(ag) {

			common.dom.text(statusTextBox, ag.text);
			
			// Remove previous icon
			if (ag.ico == 'ok') {
				removeClass(statusIcoBox, icoFail);
				addClass(statusIcoBox, icoOk);
			}
			else if (ag.ico == 'fail') {
				removeClass(statusIcoBox, icoOk);
				addClass(statusIcoBox, icoFail);
			}

			// Show popupBox
			addClass(popupBox, 'show');
		},

		hide: function(ag) {
			removeClass(popupBox, 'show');
		}
	}

	_.document.onkeydown = buttonOkBox.onclick = function(Event) {
		Event = common.event.getEvent(Event);
		if(Event.keyCode == escCode || Event.type == 'click') {
			_.popupBox.hide();
		}
	}

})(window);