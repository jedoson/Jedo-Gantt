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
var JedoWorker = {};
Object.defineProperty(JedoWorker, "YEAR", {
	get: function() {
		return 1;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "QUARTER", {
	get: function() {
		return 2;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "MONTH", {
	get: function() {
		return 3;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "WEEK", {
	get: function() {
		return 4;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "DATE", {
	get: function() {
		return 5;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "HOUR", {
	get: function() {
		return 6;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "MIN", {
	get: function() {
		return 7;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "SEC", {
	get: function() {
		return 8;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(JedoWorker, "MIL", {
	get: function() {
		return 9;
	},
	enumerable: false,
	configurable: false
});
JedoWorker.isInChildGantt = function (id, ganttData) {
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
JedoWorker.getFnScale = function (oSDate, oEDate, nSpx, nEpx) {
	var nSTime = oSDate.getTime();
	var nETime = oEDate.getTime();
	var nTime = nETime - nSTime;
	var nPx = nEpx - nSpx;
	return function (oDate, pDateScaleType){
		return (nPx/nTime)*(oDate.getTime()-nSTime);
	};
};
JedoWorker.getQuarter = function(oDate) {
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
JedoWorker.setNextDate = function(oDate, lineMode, options) {
	if(lineMode === JedoWorker.YEAR) {
		oDate.setMonth(12);
		oDate.setDate(0);
		oDate.setHours(23);
		oDate.setMinutes(59,59,999);
	} else if(lineMode === JedoWorker.QUARTER) {
		var nQuarter = JedoWorker.getQuarter(oDate);
		oDate.setMonth(nQuarter*3);
		oDate.setDate(0);
		oDate.setHours(23,59,59,999);
	} else if(lineMode === JedoWorker.MONTH) {
		oDate.setMonth(oDate.getMonth()+1);
		oDate.setDate(0);
		oDate.setHours(23,59,59,999);
	} else if(lineMode === JedoWorker.WEEK) {
		var nWeekDay = oDate.getDay();
    	if(nWeekDay != options.startWeekDay) {
    		oDate.setDate(oDate.getDate()+((7-nWeekDay)+options.startWeekDay));
    	} else {
    		oDate.setDate(oDate.getDate()+6);
    	}
    	oDate.setHours(23,59,59,999);
	} else if(lineMode === JedoWorker.DATE) {
		oDate.setHours(23,59,59,999);
	} else if(lineMode === JedoWorker.HOUR) {
		//oDate.setHours(oDate.getHours()+1);
		oDate.setMinutes(59,59,999);
	}
};
JedoWorker.setEndDate = function(oDate, lineMode) {
	if(	lineMode === JedoWorker.YEAR 		|| 
		lineMode === JedoWorker.QUARTER 	|| 
		lineMode === JedoWorker.MONTH 		|| 
		lineMode === JedoWorker.WEEK       ||
		lineMode === JedoWorker.DATE		) {
		
		oDate.setDate(oDate.getDate()+1);
        oDate.setHours(0,0,0,1);
        
	} else if(lineMode === JedoWorker.HOUR) {
		
		oDate.setHours(oDate.getHours()+1,0,0,1);

	} else {
		throw Error("lineMode is bad");
	}
};
JedoWorker.getHeaderItemID = function(lineMode, sLineId, oDate) {
	if(lineMode === JedoWorker.YEAR) {
		return sLineId+"_"+oDate.getFullYear();
	} else if(lineMode === JedoWorker.QUARTER) {
		var nQuarter = JedoWorker.getQuarter(oDate);
		return sLineId+"_"+oDate.getFullYear()+"_"+nQuarter;
	} else if(lineMode === JedoWorker.MONTH) {
		return sLineId+"_"+oDate.getFullYear()+"_"+oDate.getMonth();
	} else if(lineMode === JedoWorker.WEEK) {
		var iWeekNo = 33;
		return sLineId+"_"+oDate.getFullYear()+"_"+iWeekNo;
	} else if(lineMode === JedoWorker.DATE) {
		return sLineId+"_"+oDate.getFullYear()+"_"+oDate.getDate();
	} else if(lineMode === JedoWorker.HOUR) {
		var nY = oDate.getFullYear();
		var nM = oDate.getMonth()+1;
		var nD = oDate.getDate();
		var sY = ""+nY;
		var sM = nM < 10 ? "0"+nM : ""+nM;
		var sD = nD < 10 ? "0"+sD : ""+sD;
		return sLineId+"_"+sY+sM+sD+"_"+oDate.getHours();
	} else {
		throw Error("lineMode is bad");
	}
};
JedoWorker.getSettingHeaderGanttData = function (options, indexLine, lineMode, nToWidth, nPrevWidth) {
	//console.log("s -- jedo.JedoWorker.js - getSettingHeaderGanttData  --");
	//console.log("indexLine:"+indexLine);
	//console.log("lineMode:"+lineMode);
	//console.log("nToWidth:"+nToWidth);
	//console.log("nPrevWidth:"+nPrevWidth);
	var fnScale = JedoWorker.getFnScale(options.startGanttDate, options.endGanttDate, 0, nToWidth);
	var fnPrevScale = null;
	if(nPrevWidth != null) {
		fnPrevScale = JedoWorker.getFnScale(options.startGanttDate, options.endGanttDate, 0, nPrevWidth);
		//console.log("fnPrevScale created");
	} else {
		//console.log("fnPrevScale is null");
	}

	var sLineId = "Headerline"+indexLine;
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setHours(0,0,0,1);
	
	var iWidth = 0;
	var iToWidth = 0;
	var iEnd = 0;
	var iToEnd = 0;
	var iLeft = options.unitSpace;
	var iToLeft = options.unitSpace;
	var sClassName = "headRectLine"+indexLine;
	var sTextClassName = "headTextLine"+indexLine;
	var iHeaderLineHeight = options.header.lineHeight-options.unitSpace;
	var iLastHeaderLineHeight = options.header.lineHeight-(options.unitSpace*2);
	
	//var fnFormat = getTimeFormat(indexLine, lineMode);
	
	if(fnPrevScale) {
		iLeft = fnPrevScale(options.startGanttDate);
		iToLeft = fnScale(options.startGanttDate);
	} else {
		iLeft = fnScale(options.startGanttDate);
	}

	var arr = [];
	var y = options.unitSpace+(options.header.lineHeight*indexLine);
	
	var nGanttEndTime = options.endGanttDate.getTime();
	while(oDate.getTime() <= nGanttEndTime) {
		
		iLeft = iEnd+1;
		if(fnPrevScale) {
			iToLeft = iToEnd+1;
		}

    	JedoWorker.setNextDate(oDate, lineMode, options);
    	if(nGanttEndTime < oDate.getTime()) {
    		oDate.setTime(nGanttEndTime);
    		oDate.setHours(23,59,59,999);
    	}
    	
    	if(fnPrevScale) {
    		iEnd = fnPrevScale(oDate);
    		iToEnd = fnScale(oDate);
		} else {
			iEnd = fnScale(oDate);
		}
    	
    	iWidth = iEnd - iLeft;
    	if(fnPrevScale) {
    		iWidth = iEnd - iLeft;
    		iToWidth = iToEnd - iToLeft;
    	}
		
		var bLastHeaderLine = indexLine+1 === options.header.viewLineCount;
		var h = bLastHeaderLine ? iLastHeaderLineHeight : iHeaderLineHeight;
		arr[arr.length] = {
				x : iLeft,
				y : y,
				width : (iWidth-options.unitSpace) < 1 ? 1 : (iWidth-options.unitSpace),
				height : h,
				x2 : iToLeft,
				y2 : y,
				w2 : iToWidth < 1 ? 1 :iToWidth,
				h2 : h,
				title : 'dd', //fnFormat(oDate),
				currentDate : new Date(oDate.getTime()),
				itemId : JedoWorker.getHeaderItemID(lineMode, sLineId, oDate),
				style : {
					fill : 'yellow', 
					stroke : 'navy', 
					strokeWidth : 0
				},
				textStyle : {
					fill: 'red',
					fontFamily : "Verdana",
					fontSize : options.header.fontSize
				}
		}
		JedoWorker.setEndDate(oDate, lineMode);
    }
	//console.log("e -- jedo.JedoWorker.js - getSettingHeaderGanttData  --");
	return arr;
};
JedoWorker.getSettingBodyGanttBarData = function (options, startGanttDate, endGanttDate, nToWidth, nPrevWidth) {
	//console.log("s -- jedo.JedoWorker.js - getSettingBodyGanttBarData  --");
	
	var fnScale = JedoWorker.getFnScale(startGanttDate, endGanttDate, 0, nToWidth);
	var fnPrevScale = null;
	if(nPrevWidth != null) {
		fnPrevScale = JedoWorker.getFnScale(startGanttDate, endGanttDate, 0, nPrevWidth);
		//console.log("fnPrevScale created");
	} else {
		//console.log("fnPrevScale is null");
	}
	
	var iSPos = 0;
	var iToSPos = 0;
	var iEPos = 0;
	var iToEPos = 0;
	var iLine = 0;
	var iWidth = 0;
	var iToWidth = 0;
	var iGanttBarHeight = options.lineHeight-(options.body.barSpace*2);
	var iHeadLineCount = options.header.viewLineCount;
	var nSvgHeaderHeight = options.header.lineHeight*iHeadLineCount;
	
	var i = 0;
	var arr = [];
	var nLength = options.ganttData.length;
	for(i = 0; i < nLength; i++) {
		//console.log("ganttData.index:"+i);

		var o = options.ganttData[i];
		var sID = o.id;
		var sDate = o.startDate;
		var eDate = o.endDate;
		//console.log("id:"+sID);
		
		iLine = options.unitSpace + (i * options.lineHeight);
		
		sDate.setHours(0,0,0,0);
		if(fnPrevScale) {
			iSPos = fnPrevScale(sDate);
			iToSPos = fnScale(sDate);
		} else {
			iSPos = fnScale(sDate);
		}
		
		eDate.setHours(23,59,59,999);
		if(fnPrevScale) {
			iEPos = fnPrevScale(eDate);
			iToEPos = fnScale(eDate);
		} else {
			iEPos = fnScale(eDate);
		}

		if(fnPrevScale) {
			iWidth = iEPos - iSPos;
			iToWidth = iToEPos - iToSPos;
		} else {
			iWidth = iEPos - iSPos;
		}
		
		//console.log("x1:%i x2:%i w1:%i w2:%i", iSPos, iToSPos, iWidth, iToWidth);
		arr[arr.length] = {
			id : sID,
			x1 : iSPos,
			y1 : nSvgHeaderHeight+((options.lineHeight*i)+options.body.barSpace),
			w1 : iWidth,
			h1 : iGanttBarHeight,
			x2 : iToSPos,
			w2 : iToWidth,
			lineHeight : options.lineHeight,
			ganttBarHeight : iGanttBarHeight,
			lineY : nSvgHeaderHeight+(options.lineHeight*i),
			isParent : JedoWorker.isInChildGantt(sID, options.ganttData),
			parentId : o.parentId,
			style : {
				fill: '#0000cd', 
				stroke: '#ff69b4', 
				strokeWidth: 0
			}
		}
	};
	//console.log("e -- jedo.JedoWorker.js - getSettingBodyGanttBarData  --");
	return arr;
	
};


self.addEventListener('message', function(e) {
	var data = e.data;
	switch (data.cmd) {
	case 'InitJedoWorker':
		try {
			
		} finally {
			self.close(); // 웹 워커를 종료한다.
		}
		break;
	case 'SettingHeaderGanttData':
		try {
			var arr = JedoWorker.getSettingHeaderGanttData(data.options, data.indexLine, data.lineMode, data.nToWidth, data.nPrevWidth);
			postMessage({
				"cmd": "SettingHeaderGanttData",
				"indexLine": data.indexLine,
				"lineMode": data.lineMode,
				"nToWidth": data.nToWidth,
				"nPrevWidth": data.nPrevWidth,
				"ganttHeaderDatas": arr
			});
		} finally {
			self.close(); // 웹 워커를 종료한다.
		}
		break;
	case 'SettingBodyGanttBarData':
		try {
			var arr = JedoWorker.getSettingBodyGanttBarData(data.options, data.startGanttDate, data.endGanttDate, data.nToWidth, data.nPrevWidth);
			postMessage({
				"cmd": "SettingBodyGanttBarData",
				"nToWidth": data.nToWidth,
				"nPrevWidth": data.nPrevWidth,
				"ganttBodyBarDatas": arr
			});
		} finally {
			self.close(); // 웹 워커를 종료한다.
		}
		break;
	default:
		postMessage('Dude, unknown cmd: ' + data.msg);
	};
}, false);











