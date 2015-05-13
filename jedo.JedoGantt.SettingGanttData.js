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

if(!jedo.JedoGantt.hasOwnProperty("SettingGanttData")) {
	

/*\
 * jedo.JedoGantt.SettingGanttData
 [ construct ]

 * 줌인/줌아웃 으로 화면의 설정값.

 > Arguments

 - nViewMode		(number) 뷰모드(년,분기,월,일,시간,분,초,밀리세컨드)
 - nSvgPrevWidth	(number) 이전 화면의 폭
 - nSvgPrevWidth	(number) 현재 화면의 폭
 - fnScale			(function) 시간을 인수로 화면 X좌표를 구하는 함수.

 = (null) 
\*/
jedo.JedoGantt.SettingGanttData = function (nViewMode, nSvgPrevWidth, nSvgWidth, dateViewStart, dateViewEnd) {
	
	Object.defineProperty(this, "dateViewMode", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: nViewMode
	});
	
	Object.defineProperty(this, "dateViewModeString", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: jedo.JedoGantt.getViewModeString(nViewMode)
	});
	
	Object.defineProperty(this, "svgPrevWidth", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: parseInt(nSvgPrevWidth)
	});
	
	Object.defineProperty(this, "svgWidth", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: parseInt(nSvgWidth,10)
	});
	
	Object.defineProperty(this, "dateViewStart", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: dateViewStart
	});
	
	Object.defineProperty(this, "dateViewEnd", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: dateViewEnd
	});

	
	Object.defineProperty(this, "fnScale", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: jedo.getFnScale(dateViewStart, dateViewEnd, 0, nSvgWidth)
	});
	
	Object.defineProperty(this, "fnTime", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: jedo.getFnTime(dateViewStart, dateViewEnd, 0, nSvgWidth)
	});
	
	Object.defineProperty(this, "scrollLeft", {
		enumerable: false,
		configurable: false,
		writable: true,
		value: 0
	});
	
	Object.defineProperty(this, "viewStartDate", {
		enumerable: false,
		configurable: false,
		writable: true,
		value: dateViewStart
	});
	
	
	var _ganttHeaderData = {};
	Object.defineProperty(this, "getGanttHeaderData", {
		get: function() {
			return function(indexLine, lineMode) {
				var arr = _ganttHeaderData["HL"+indexLine+"M"+lineMode];
				return arr;
			};
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setGanttHeaderData", {
		get: function() {
			return function(indexLine, lineMode, arr) {
				_ganttHeaderData["HL"+indexLine+"M"+lineMode] = arr;
			};
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
	
	Object.defineProperty(this, "keyString", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: jedo.JedoGantt.getGanttDataKeyString(nViewMode,nSvgPrevWidth,nSvgWidth)
	});
	
	
};

}//if(!jedo.JedoGantt.hasOwnProperty("SettingGanttData")) {

