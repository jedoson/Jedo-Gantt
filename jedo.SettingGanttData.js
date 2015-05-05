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

"use strict";
if(typeof(Worker) === "undefined") {
	throw new Error("javascript Worker need!");
} 

if(!window.jedo.hasOwnProperty("SettingGanttData")) {
	
window.jedo.SettingGanttData = function (nViewMode, nSvgWidth, fnScale) {
	
	Object.defineProperty(this, "dateViewMode", {
		get: function() {
			return nViewMode;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "svgWidth", {
		get: function() {
			return nSvgWidth;
		},
		enumerable: false,
		configurable: false
	});
	
	
	Object.defineProperty(this, "fnScale", {
		get: function() {
			return fnScale;
		},
		enumerable: false,
		configurable: false
	});
	
	
	var _ganttHeaderData = {};
	var _getGanttHeaderData = function(indexLine, lineMode) {
		var arr = _ganttHeaderData["HL"+indexLine+"M"+lineMode];
		return arr;
	};
	var _setGanttHeaderData = function(indexLine, lineMode, arr) {
		_ganttHeaderData["HL"+indexLine+"M"+lineMode] = arr;
	};
	Object.defineProperty(this, "getGanttHeaderData", {
		get: function() {
			return _getGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setGanttHeaderData", {
		get: function() {
			return _setGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	
	
	var _ganttBodyData = null;
	Object.defineProperty(this, "ganttBodyData", {
		get: function() {
			return _ganttBodyData;
		},
		set: function(arrGanttBodyData) {
			_ganttBodyData = arrGanttBodyData;
		},
		enumerable: false,
		configurable: false
	});
	
	
};


}//if(!window.jedo.hasOwnProperty("SettingGanttData")) {
