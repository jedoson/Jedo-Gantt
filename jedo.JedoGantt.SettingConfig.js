/*  Copyright 2010  이상주  (email : jedoson@naver.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

*/
if(!jedo.JedoGantt.hasOwnProperty("SettingConfig")) {
	
	
	
	
jedo.JedoGantt.SettingConfig = function () {
	

	
	var _arrGanttWidth = [];
	Object.defineProperty(this, "pushGanttWidth", {
		get: function() {
			return function(w) {
				_arrGanttWidth.push(w);
			};
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "popGanttWidth", {
		get: function() {
			return function() {
				_arrGanttWidth.pop();
			};
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "dateViewModeSvgPrevWidth", {
		get: function() {
			return _arrGanttWidth[_arrGanttWidth.length-2];
		},
		enumerable: false,
		configurable: false
	});
	
	
	
	
	
	
	
	
	

	var _arrGanttDataKey = [];
	var _settingGanttData = {};
	Object.defineProperty(this, "getSettingGanttData", {
		get: function() {
			return function(sGanttDataKey) {
				return _settingGanttData[sGanttDataKey];
			};
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setSettingGanttData", {
		get: function() {
			return function(oSettingGanttData) {
				if(!oSettingGanttData instanceof jedo.JedoGantt.SettingGanttData) {
					throw new TypeError("param oSettingGanttData is not instance of jedo.SettingGanttData ");
				}
				var sGanttDataKey = oSettingGanttData.keyString;
				var o = _settingGanttData[sGanttDataKey];
				if(o != null) {
					throw new Error("sGanttDataKey "+sGanttDataKey+" is already in ");
				}
				_settingGanttData[sGanttDataKey] = oSettingGanttData;
				_arrGanttDataKey.push(sGanttDataKey);
			};
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "dateViewMode", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].dateViewMode;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "changePrevDateViewMode", {
		get: function() {
			return function () {
				if(_arrGanttDataKey.length == 1) throw new Error("Prev Gantt Data Not In");
				return _arrGanttDataKey.pop();
			};
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "isGanttData", {
		get: function() {
			return function(nViewMode, nSvgPrevWidth, nSvgWidth) {
				var k = jedo.JedoGantt.getGanttDataKeyString(nViewMode, nSvgPrevWidth, nSvgWidth);
				return _settingGanttData.hasOwnProperty(k);
			};
		},
		enumerable: false,
		configurable: false
	});
	
	
	
	Object.defineProperty(this, "dateViewModeSvgWidth", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].svgWidth;
		},
		enumerable: false,
		configurable: false
	});
	
	

	Object.defineProperty(this, "fnScale", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].fnScale;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "fnPrevScale", {
		get: function() {
			if(_arrGanttDataKey.length < 2) return null;
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-2]].fnScale;
		},
		enumerable: false,
		configurable: false
	});
	
	
	Object.defineProperty(this, "fnTime", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].fnTime;
		},
		enumerable: false,
		configurable: false
	});
	
	
	Object.defineProperty(this, "scrollLeft", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].scrollLeft;
		},
		set: function(nScrollLeft) {
			_settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].scrollLeft = nScrollLeft;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "prevScrollLeft", {
		get: function() {
			if(_arrGanttDataKey.length < 2) return null;
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-2]].scrollLeft;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "viewStartDate", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].viewStartDate;
		},
		set: function(oDate) {
			_settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].viewStartDate = oDate;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "prevViewStartDate", {
		get: function() {
			if(_arrGanttDataKey.length < 2) return null;
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-2]].viewStartDate;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "getGanttHeaderData", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].getGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setGanttHeaderData", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].setGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	

	Object.defineProperty(this, "ganttBodyData", {
		get: function() {
			return _settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].ganttBodyData;
		},
		set: function(nData) {
			_settingGanttData[_arrGanttDataKey[_arrGanttDataKey.length-1]].ganttBodyData = nData;
		},
		enumerable: false,
		configurable: false
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};

}//if(!jedo.JedoGantt.hasOwnProperty("SettingConfig")) {

