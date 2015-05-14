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
if(!self.hasOwnProperty("jedo")) {

self.jedo = {};

Object.defineProperty(jedo, "DATE_SCALE_TYPE_START", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9701
});
Object.defineProperty(jedo, "DATE_SCALE_TYPE_END", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9702
});

jedo.VIEW_MODE = {};
Object.defineProperty(jedo.VIEW_MODE, "YEAR", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9801
});
Object.defineProperty(jedo.VIEW_MODE, "QUARTER", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9802
});
Object.defineProperty(jedo.VIEW_MODE, "MONTH", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9803
});
Object.defineProperty(jedo.VIEW_MODE, "WEEK", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9804
});
Object.defineProperty(jedo.VIEW_MODE, "DATE", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9805
});
Object.defineProperty(jedo.VIEW_MODE, "HOUR", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9806
});
Object.defineProperty(jedo.VIEW_MODE, "MIN", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9807
});
Object.defineProperty(jedo.VIEW_MODE, "SEC", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9808
});
Object.defineProperty(jedo.VIEW_MODE, "MIL", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9809
});
Object.defineProperty(jedo.VIEW_MODE, "toString", {
	get: function() {
		return function(nViewMode) {
			if(nViewMode === jedo.VIEW_MODE.YEAR)		return "jedo.VIEW_MODE.YEAR";
			if(nViewMode === jedo.VIEW_MODE.QUARTER)	return "jedo.VIEW_MODE.QUARTER";
			if(nViewMode === jedo.VIEW_MODE.MONTH)		return "jedo.VIEW_MODE.MONTH";
			if(nViewMode === jedo.VIEW_MODE.WEEK)		return "jedo.VIEW_MODE.WEEK";
			if(nViewMode === jedo.VIEW_MODE.DATE)		return "jedo.VIEW_MODE.DATE";
			if(nViewMode === jedo.VIEW_MODE.HOUR)		return "jedo.VIEW_MODE.HOUR";
			if(nViewMode === jedo.VIEW_MODE.MIN)		return "jedo.VIEW_MODE.MIN";
			if(nViewMode === jedo.VIEW_MODE.SEC)		return "jedo.VIEW_MODE.SEC";
			if(nViewMode === jedo.VIEW_MODE.MIL)		return "jedo.VIEW_MODE.MIL";
			throw new Error("jedo.VIEW_MODE.toString nViewMode is bad");
		};
	},
	enumerable: false,
	configurable: false
});

jedo.CAPTURED_MODE = {};
Object.defineProperty(jedo, "CAPTURED_MODE", {
	enumerable: false,
	configurable: false,
	writable: false
});
Object.defineProperty(jedo.CAPTURED_MODE, "LEFT_CHANGE", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9901
});
Object.defineProperty(jedo.CAPTURED_MODE, "RIGHT_CHANGE", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9902
});
Object.defineProperty(jedo.CAPTURED_MODE, "MOVE_CHANGE", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: 9903
});
Object.defineProperty(jedo, "gantt", {
	enumerable: false,
	configurable: false,
	writable: false,
	value:{}
});


/*\
 * jedo.getFnScale
 [ method ]

 * 시간시작일, 시간종요일, svg 폭과 을 기준으로 
 * 화면상의 위치를 리턴 하는 함수를 리턴한다.

 > Arguments

 - oSDate (Date) SVG 화면의 시작일자
 - oEDate (Date) SVG 화면의 종료일자
 - nSpx   (number) SVG 화면 시작점.
 - nEpx   (number) SVG 화면 폭.

 = (function) function of returned 
\*/
Object.defineProperty(jedo, "getFnScale", {
	get: function() {
		return function(oSDate, oEDate, nSpx, nEpx) {
			var nSTime = oSDate.getTime();
			var nETime = oEDate.getTime();
			var nTime = nETime - nSTime;
			var nPx = nEpx - nSpx;
			return function (oDate, pDateScaleType){
				//return (oDate.getTime()*nPx)/nTime;
				return (nPx/nTime)*(oDate.getTime()-nSTime);
			};
		};
	},
	enumerable: false,
	configurable: false
});


/*\
 * jedo.getTime
 [ method ]

 * 시간시작일, 시간종요일, svg 폭, 화면지점
 * 화면상의 위치를 리턴 하는 함수를 리턴한다.

 > Arguments

 - oSDate (Date) SVG 화면의 시작일자
 - oEDate (Date) SVG 화면의 종료일자
 - nSpx   (number) SVG 화면 시작점.
 - nEpx   (number) SVG 화면 폭.

 = (function) function of returned 
\*/
Object.defineProperty(jedo, "getFnTime", {
	get: function() {
		return function(oSDate, oEDate, nSpx, nEpx) {
			var nSTime = oSDate.getTime();
			var nETime = oEDate.getTime();
			var nTime = nETime - nSTime;
			var nPx = nEpx - nSpx;
			return function (xClient){
				//return (oDate.getTime()*nPx)/nTime;
				var t = (nTime/nPx)*xClient;
				//console.log("s -- getFnTime nTime["+nTime+"] nPx["+nPx+"] xClient["+xClient+"] t:"+t);
				return new Date(nSTime+t);
			};
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo, "getQuarter", {
	get: function() {
		return function(oDate) {
			if(!(oDate instanceof Date)) {
				throw new TypeError("Param oDate is Bad");
			}
			var iMonth = oDate.getMonth();
			switch (iMonth) {
				case 0  : return 1;
				case 1  : return 1;
				case 2  : return 1;
				case 3  : return 2;
				case 4  : return 2;
				case 5  : return 2;
				case 6  : return 3;
				case 7  : return 3;
				case 8  : return 3;
				case 9  : return 4;
				case 10 : return 4;
				case 11 : return 4;
			}
			return 0;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo, "setNextDate", {
	get: function() {
		return function(oDate, lineMode, options) {
			if(lineMode === jedo.VIEW_MODE.YEAR) {
				oDate.setMonth(12);
				oDate.setDate(0);
				oDate.setHours(23);
				oDate.setMinutes(59,59,999);
			} else if(lineMode === jedo.VIEW_MODE.QUARTER) {
				var nQuarter = jedo.getQuarter(oDate);
				oDate.setMonth(nQuarter*3);
				oDate.setDate(0);
				oDate.setHours(23,59,59,999);
			} else if(lineMode === jedo.VIEW_MODE.MONTH) {
				oDate.setMonth(oDate.getMonth()+1);
				oDate.setDate(0);
				oDate.setHours(23,59,59,999);
			} else if(lineMode === jedo.VIEW_MODE.WEEK) {
				var nWeekDay = oDate.getDay();
		    	if(nWeekDay != options.startWeekDay) {
		    		oDate.setDate(oDate.getDate()+((7-nWeekDay)+options.startWeekDay));
		    	} else {
		    		oDate.setDate(oDate.getDate()+6);
		    	}
		    	oDate.setHours(23,59,59,999);
			} else if(lineMode === jedo.VIEW_MODE.DATE) {
				oDate.setHours(23,59,59,999);
			} else if(lineMode === jedo.VIEW_MODE.HOUR) {
				//oDate.setHours(oDate.getHours()+1);
				oDate.setMinutes(59,59,999);
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo, "setEndDate", {
	get: function() {
		return function(oDate, lineMode) {
			if(	lineMode === jedo.VIEW_MODE.YEAR 		|| 
					lineMode === jedo.VIEW_MODE.QUARTER 	|| 
					lineMode === jedo.VIEW_MODE.MONTH 		|| 
					lineMode === jedo.VIEW_MODE.WEEK       ||
					lineMode === jedo.VIEW_MODE.DATE		) {
					
					oDate.setDate(oDate.getDate()+1);
			        oDate.setHours(0,0,0,1);
			        
				} else if(lineMode === jedo.VIEW_MODE.HOUR) {
					
					oDate.setHours(oDate.getHours()+1,0,0,1);

				} else {
					throw Error("lineMode is bad");
				}
			};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo, "getHeaderItemID", {
	get: function() {
		return function(lineMode, sLineId, oDate) {
			if(lineMode === jedo.VIEW_MODE.YEAR) {
				return sLineId+"_Y"+oDate.getFullYear();
			} else if(lineMode === jedo.VIEW_MODE.QUARTER) {
				var nQuarter = jedo.getQuarter(oDate);
				return sLineId+"_Y"+oDate.getFullYear()+"_Q"+nQuarter;
			} else if(lineMode === jedo.VIEW_MODE.MONTH) {
				return sLineId+"_Y"+oDate.getFullYear()+"_M"+oDate.getMonth();
			} else if(lineMode === jedo.VIEW_MODE.WEEK) {
				var nTime = oDate.getTime();
				var sDate = new Date(nTime);
				sDate.setMonth(0);
				sDate.setDate(1);
				sDate.setHours(0,0,1,1);
				var mil = nTime - sDate.getTime();
				var iWeekNo = parseInt((((((mil/1000)/60)/60)/24)/7),10);
				return sLineId+"_Y"+oDate.getFullYear()+"_W"+iWeekNo;
			} else if(lineMode === jedo.VIEW_MODE.DATE) {
				return sLineId+"_Y"+oDate.getFullYear()+"_M"+oDate.getMonth()+"_D"+oDate.getDate();
			} else if(lineMode === jedo.VIEW_MODE.HOUR) {
				return sLineId+"_Y"+oDate.getFullYear()+"_M"+oDate.getMonth()+"_D"+oDate.getDate()+"_H"+oDate.getHours();
			} else if(lineMode === jedo.VIEW_MODE.MIN) {
				return sLineId+"_Y"+oDate.getFullYear()+"_M"+oDate.getMonth()+"_D"+oDate.getDate()+"_H"+oDate.getHours()+"_m"+oDate.getMinutes();
			} else {
				throw Error("lineMode is bad");
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo, "nextHeaderItemID", {
	get: function() {
		return function(itemId) {
			
			var startWith = "";
			var mark = "";
			var no = -1;
			for(var i = itemId.length-1; 0 <= i; i--) {
				var c = itemId.charAt(i);
				if(Number.isNaN(c)) {
					startWith = itemId.substring(0, i+1);
					itemId.substring(i+1);
					mark = c;
					break;
				}
			}
			console.log("startWith["+startWith+"] mark["+mark+"] no["+no+"]");
			
			
			if(mark == "Q") {
				
				
				
				
			} else if(mark == "M") {
				
				
				
				
			} else if(mark == "W") {
				
				
				
			}
			
			
		};
	},
	enumerable: false,
	configurable: false
});

Object.defineProperty(jedo, "isInChildGantt", {
	get: function() {
		return function (id, ganttData) {
			var o = null;
			var i = 0;
			var nLength = ganttData.length;
			for(i=0; i<nLength; i++) {
				o = ganttData[i];
				if(o.parentId == id) {
					return true;
				}
			}
			return false;
		};
	},
	enumerable: false,
	configurable: false
});


}//if(!hasOwnProperty("jedo")) {

