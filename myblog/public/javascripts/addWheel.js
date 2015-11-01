/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-11 10:36:14
 * @version $Id$
 */

function addWheel(obj, callback){
	if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
		obj.addEventListener('DOMMouseScroll', _wheel, false);
	}else{
		obj.onmousewheel=_wheel;
	}


	function _wheel(ev){
		var oEvent = ev || event;
		var bDown = false;
		if(oEvent.wheelDelta){
			bDown = oEvent.wheelDelta > 0 ? false : true;
		}else{
			bDown = oEvent.detail > 0 ? true : false;
		}
		callback &&　callback(bDown);
	}
}