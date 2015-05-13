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

importScripts('jedo.js');
//importScripts('jedo.var.js');

if(!self.hasOwnProperty("JedoWorker")) {

self.JedoWorker = {};
JedoWorker.getSettingHeaderGanttData = function (options, dateViewStart, dateViewEnd, indexLine, lineMode, nToWidth, nPrevWidth) {
	//console.log("s -- jedo.JedoWorker.js - getSettingHeaderGanttData  --");
	//console.log("indexLine:"+indexLine);
	//console.log("lineMode:"+lineMode);
	//console.log("nToWidth:"+nToWidth);
	//console.log("nPrevWidth:"+nPrevWidth);
	var fnScale = jedo.getFnScale(dateViewStart, dateViewEnd, 0, nToWidth);
	var fnPrevScale = null;
	if(nPrevWidth != null) {
		fnPrevScale = jedo.getFnScale(dateViewStart, dateViewEnd, 0, nPrevWidth);
		//console.log("fnPrevScale created");
	} else {
		//console.log("fnPrevScale is null");
	}

	var sLineId = "Headerline"+indexLine;
	
	var oDate = new Date();
	oDate.setTime(dateViewStart.getTime());
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
	
	if(fnPrevScale) {
		iLeft = fnPrevScale(dateViewStart);
		iToLeft = fnScale(dateViewStart);
	} else {
		iLeft = fnScale(dateViewStart);
	}

	var arr = [];
	var y = options.unitSpace+(options.header.lineHeight*indexLine);
	
	var nGanttEndTime = dateViewEnd.getTime();
	while(oDate.getTime() <= nGanttEndTime) {
		
		iLeft = iEnd+1;
		if(fnPrevScale) {
			iToLeft = iToEnd+1;
		}

		jedo.setNextDate(oDate, lineMode, options);
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
				itemId : jedo.getHeaderItemID(lineMode, sLineId, oDate),
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
		jedo.setEndDate(oDate, lineMode);
    }
	//console.log("e -- jedo.JedoWorker.js - getSettingHeaderGanttData  --");
	return arr;
};
JedoWorker.getSettingAddHeaderGanttData = function (options, dateViewStart, dateViewEnd, indexLine, lineMode, nToWidth) {
	//console.log("s -- jedo.JedoWorker.js - getSettingAddHeaderGanttData  --");
	//console.log("indexLine:"+indexLine);
	//console.log("lineMode:"+lineMode);
	//console.log("nToWidth:"+nToWidth);
	//console.log("nPrevWidth:"+nPrevWidth);
	var fnScale = jedo.getFnScale(dateViewStart, dateViewEnd, 0, nToWidth);
	

	var sLineId = "Headerline"+indexLine;
	
	var oDate = new Date();
	oDate.setTime(dateViewStart.getTime());
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
	
	iLeft = fnScale(dateViewStart);

	var arr = [];
	var y = options.unitSpace+(options.header.lineHeight*indexLine);
	
	var nGanttEndTime = dateViewEnd.getTime();
	while(oDate.getTime() <= nGanttEndTime) {
		
		iLeft = iEnd+1;

		jedo.setNextDate(oDate, lineMode, options);
    	if(nGanttEndTime < oDate.getTime()) {
    		oDate.setTime(nGanttEndTime);
    		oDate.setHours(23,59,59,999);
    	}
    	
    	iEnd = fnScale(oDate);
    	
    	iWidth = iEnd - iLeft;
		
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
				itemId : jedo.getHeaderItemID(lineMode, sLineId, oDate),
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
		jedo.setEndDate(oDate, lineMode);
    }
	//console.log("e -- jedo.JedoWorker.js - getSettingAddHeaderGanttData  --");
	return arr;
};
JedoWorker.getSettingBodyGanttBarData = function (options, startGanttDate, endGanttDate, nToWidth, nPrevWidth) {
	//console.log("s -- jedo.JedoWorker.js - getSettingBodyGanttBarData  --");
	
	var fnScale = jedo.getFnScale(startGanttDate, endGanttDate, 0, nToWidth);
	var fnPrevScale = null;
	if(nPrevWidth != null) {
		fnPrevScale = jedo.getFnScale(startGanttDate, endGanttDate, 0, nPrevWidth);
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
			h1 : options.ganttBarHeight,
			x2 : iToSPos,
			w2 : iToWidth,
			lineHeight : options.lineHeight,
			ganttBarHeight : options.ganttBarHeight,
			lineY : nSvgHeaderHeight+(options.lineHeight*i),
			isParent : jedo.isInChildGantt(sID, options.ganttData),
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
			var arr = JedoWorker.getSettingHeaderGanttData(data.options, data.dateViewStart, data.dateViewEnd, data.indexLine, data.lineMode, data.nToWidth, data.nPrevWidth);
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
	case 'SettingAddHeaderGanttData':
		try {
			var arr = JedoWorker.getSettingAddHeaderGanttData(data.options, data.dateViewStart, data.dateViewEnd, data.indexLine, data.lineMode, data.nToWidth);
			postMessage({
				"cmd": "SettingAddHeaderGanttData",
				"indexLine": data.indexLine,
				"lineMode": data.lineMode,
				"nToWidth": data.nToWidth,
				"ganttHeaderDatas": arr
			});
		} finally {
			self.close(); // 웹 워커를 종료한다.
		}
		break;
	case 'SettingBodyGanttBarData':
		try {
			var arr = JedoWorker.getSettingBodyGanttBarData(data.options, data.dateViewStart, data.dateViewEnd, data.nToWidth, data.nPrevWidth);
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





} //if(!self.hasOwnProperty("JedoWorker")) {





