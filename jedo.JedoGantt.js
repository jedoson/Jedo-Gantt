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

if(!window.jedo.hasOwnProperty("JedoGantt")) {
window.jedo.JedoGantt = function (options, ganttContainer, svg) {
	
	Object.defineProperty(this, "options", {
		get: function() {
			return options;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "ganttContainer", {
		get: function() {
			return ganttContainer;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "svg", {
		get: function() {
			return svg;
		},
		enumerable: false,
		configurable: false
	});
	
	
	var _dateViewMode = window.jedo.DATE;
	Object.defineProperty(this, "dateViewMode", {
		get: function() {
			return _dateViewMode;
		},
		set: function(viewMode) {
			console.log("s -- set dateViewMode ---------------");
			console.log("viewMode:"+window.jedo.getViewModeString(viewMode));
			_dateViewMode = viewMode;
			console.log("e -- set dateViewMode ---------------");
		},
		enumerable: false,
		configurable: false
	});

		
	Object.defineProperty(this, "ganttTableId", {
		get: function() {
			return this.ganttContainer.getAttribute("id")+"_ganttTable";
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "ganttHeaderId", {
		get: function() {
			return this.ganttContainer.getAttribute("id")+"_ganttHeader";
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "ganttBodyId", {
		get: function() {
			return this.ganttContainer.getAttribute("id")+"_ganttBody";
		},
		enumerable: false,
		configurable: false
	});
	
	var ganttDate = {};
	this.setGanttDateX = function(sGanttDate, iLeft) {
		ganttDate[sGanttDate] = iLeft;
	};
	this.getGanttDateX = function(sGanttDate) {
		return ganttDate[sGanttDate];
	};
	

	
	var _fnScale = null;
	var _arrFnPrevScale = [];
	Object.defineProperty(this, "fnScale", {
		get: function() {
			return _fnScale;
		},
		set: function(fnScale) {
			if(_fnScale) {
				_arrFnPrevScale[_arrFnPrevScale.length] = _fnScale;
			}
			_fnScale = fnScale;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "fnPrevScale", {
		get: function() {
			if(0 < _arrFnPrevScale.length) {
				return _arrFnPrevScale[_arrFnPrevScale.length-1];
			} else {
				return null;
			}
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
	
	
	
	var _capturedMode = null;
	Object.defineProperty(this, "capturedMode", {
		get: function() {
			return _capturedMode;
		},
		set: function(mode) {
			_capturedMode = mode;
		},
		enumerable: false,
		configurable: false
	});
	
	
	var _capturedDataID = null;
	Object.defineProperty(this, "capturedDataID", {
		get: function() {
			return _capturedDataID;
		},
		set: function(sDataID) {
			_capturedDataID = sDataID;
		},
		enumerable: false,
		configurable: false
	});
	
	var _clearCapturedGanttBar = function() {
		if(this.capturedDataID) {
			d3.selectAll("#rectGanttBar_"+this.capturedDataID+", #startMarkGanttBar_"+this.capturedDataID+", #endMarkGanttBar_"+this.capturedDataID)
				.each(function(){
					d3.select(this).style({'cursor':'default'});
					if(this.getAttribute("class") == "rectGanttBar") {
						d3.select(this).style({'stroke-width':0});
					} else {
						d3.select(this).style({'stroke-width':1});
					}
				});
		}
		this.capturedMode = null; 
		this.capturedDataID = null;
	};
	Object.defineProperty(this, "clearCapturedGanttBar", {
		get: function() {
			return _clearCapturedGanttBar;
		},
		enumerable: false,
		configurable: false
	});
};
window.jedo.JedoGantt.prototype.initJedoGantt = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
	//console.log('this.svg.attr("width"):%i', this.svg.attr("width"));
	//this.fnScale = window.jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, this.svg.attr("width"));
	
	
	var defs = this.svg.append("defs");
    var headerGradient = defs.append("linearGradient")
		 	.attr("id", "headerGradient")
		 	.attr("x1", "0%")
		 	.attr("y1", "0%")
		 	.attr("x2", "0%")
		 	.attr("y2", "100%")
		 	.attr("spreadMethod", "pad");
    headerGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#F5F5F5")
			.attr("stop-opacity", 1);
    headerGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#DCDCDC")
			.attr("stop-opacity", 1);
	
    var ganttBarGradient = defs.append("linearGradient")
		 	.attr("id", "ganttBarGradient")
		 	.attr("x1", "0%")
		 	.attr("y1", "0%")
		 	.attr("x2", "0%")
		 	.attr("y2", "100%")
		 	.attr("spreadMethod", "pad");
    ganttBarGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#DCDCDC")
			.attr("stop-opacity", 1);
    ganttBarGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#2F4F4F")
			.attr("stop-opacity", 1);
    
    var ganttMarkGradient = defs.append("linearGradient")
		 	.attr("id", "ganttMarkGradient")
		 	.attr("x1", "0%")
		 	.attr("y1", "0%")
		 	.attr("x2", "0%")
		 	.attr("y2", "100%")
		 	.attr("spreadMethod", "pad");
    ganttMarkGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#DCDCDC")
			.attr("stop-opacity", 1);
    ganttMarkGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#2F4F4F")
			.attr("stop-opacity", 1);

	this.initHeaderDateViewMode();
	this.createGanttBody();
	this.createGanttHeader();
	

	//console.log("e -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
};
window.jedo.JedoGantt.prototype.initHeaderDateViewMode = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
	//var fnScale = this.getFnScale();
	
	var oDate = new Date();
	oDate.setTime(this.options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = this.fnScale(oDate);
	
	oDate.setHours(23,59,59,999);
	var iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Date["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(this.options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.DATE;
		return;
	}
	
	
	oDate.setDate(7);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(this.options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.WEEK;
		return;
	}
	
	
	oDate.setMonth(oDate.getMonth()+1);
	oDate.setDate(0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Month["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(this.options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.MONTH;
		return;
	}
	
	oDate.setTime(this.options.startGanttDate.getTime());
	oDate.setMonth(3);
	oDate.setDate(0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Quarter["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(this.options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.QUARTER;
		return;
	}
	
	oDate.setMonth(12, 0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Year["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(this.options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.YEAR;
		return;
	} 

	throw new Error("initHeaderDateViewMode dateViewMode Not define");
	//console.log("e -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeDateViewMode = function(nHeaderDateViewMode) {
	//console.log("s -- window.jedo.JedoGantt.prototype.changeDateViewMode -- ");
	//var fnScale = this.getFnScale();
	//var options = this.options;
	
	var xWidth = this.svg.attr('width');
	var xHeight = this.svg.attr('height');
	
	var oDate = new Date();
	oDate.setTime(this.options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_START);
	
	var iWidth = 0;
	var nWidth = xWidth;
	switch (nHeaderDateViewMode) {
		case window.jedo.YEAR :    // Year
	    	oDate.setMonth(12);
	    	oDate.setDate(0);
	    	oDate.setHours(23,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One YEAR["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change YEAR["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.YEAR;
			break;
		case window.jedo.QUARTER : // 분기
			var nQuarter = window.jedo.getQuarter(oDate);
	    	var nMonth = nQuarter*3;
	    	oDate.setMonth(nMonth);
	    	oDate.setDate(0);
	    	oDate.setHours(23,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One QUARTER["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change QUARTER["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.QUARTER;
			break;
		case window.jedo.MONTH :   // 월
			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			oDate.setHours(23,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MONTH["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change MONTH["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.MONTH;
			break;
		case window.jedo.WEEK :    // 주
			oDate.setDate(7);
			oDate.setHours(23,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change Week["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.WEEK;
			break;
		case window.jedo.DATE :    // 일
			oDate.setDate(oDate.getDate()+1);
			oDate.setHours(23,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One DATE["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change DATE["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.DATE;
			break;
		case window.jedo.HOUR :    // 시간
			//console.debug("window.jedo.HOUR -- DATE["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours());
			oDate.setHours(oDate.getHours()+1,59,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" Width:"+iWidth);
			iWidth = iWidth == 0 ? 1 : iWidth;
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.HOUR;
			break;
		case window.jedo.MIN :     // 분
			oDate.setMinutes(oDate.getMinutes()+1,59,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIN["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change MIN["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.MIN;
			break;
		case window.jedo.SEC :     // 초
			oDate.setSeconds(oDate.getSeconds()+1,999);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One SEC["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change SEC["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.SEC;
			break;
		case window.jedo.MIL :     // 밀리초
			oDate.setMilliseconds(oDate.getMilliseconds()+1);
			iWidth = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIL["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < this.options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * this.options.unitWidth;
				//console.debug("change MIL["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.dateViewMode = window.jedo.MIL;
			break;
		default :
			throw new TypeError("Param nHeaderDateViewMode["+nHeaderDateViewMode+"] is Bad");
	}
	this.fnScale = window.jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, nWidth);
	this.svg.attr("width", nWidth);
	//console.log("e -- window.jedo.JedoGantt.prototype.changeDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeGanttViewMode = function(svgPoint, nDateViewMode) {
	console.log("s -- window.jedo.JedoGantt.prototype.changeGanttViewMode -- ");

	var nSvgWidth = this.svg.attr("width");
	
	if(window.jedo.DATE < nDateViewMode) {
		console.debug("nHeaderDateViewMode["+nDateViewMode+"] is bad");
		return;
	}
	if(nDateViewMode < window.jedo.MONTH) {
		console.debug("nHeaderDateViewMode["+nDateViewMode+"] is bad");
		return;
	}
	console.log("2 -----------------------------------------------------------");
	this.changeDateViewMode(nDateViewMode);
	console.log("3 -----------------------------------------------------------");
	
	var nSvgToWidth = this.svg.attr("width");
	this.svg.select('rect.ganttHeaderBg').attr('width', nSvgToWidth);
	this.svg.select('rect.ganttBodyBg').attr('width', nSvgToWidth);
	
	var _arrDeferred = [];
	var _arrPromise = [];
	
	var oJedoWorker = {};
	var _oJedoGantt = this;
	
	console.log("4 -----------------------------------------------------------");
	
	var i = 0;
	var n = this.options.header.viewLineCount;
	for(i=0; i<n; i++) {
		_arrDeferred[i] = $.Deferred();
		var nLineMode = this.dateViewMode-(n-(i+1));
		console.log("nLineMode:"+nLineMode);
		var arr = this.getGanttHeaderData(i, nLineMode);
		if(arr == null) {
			oJedoWorker["jedoWorker"+i] = new Worker("jedo.JedoWorker.js");
	    	oJedoWorker["jedoWorker"+i].postMessage({
	    		"cmd": "SettingHeaderGanttData",
	    		"options": this.options,
	    		"indexLine": i,
	    		"lineMode": nLineMode,
	    		"nPrevWidth": nSvgWidth,
	    		"nToWidth": nSvgToWidth
	    	});
	    	oJedoWorker["jedoWorker"+i].addEventListener("message", function(event){
	    		switch(event.data.cmd) {
	    		case "SettingHeaderGanttData":
	    			_oJedoGantt.setGanttHeaderData(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
	    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
	    			_arrDeferred[event.data.indexLine].resolve();
	    			break;
	    		} 
	    	}, false);
		} else {
			_oJedoGantt.setHeaderLineMode(i, nDateViewMode, arr);
		}
		_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();
	}
	
	console.log("5 -----------------------------------------------------------");
	
	$.when(_arrPromise[0],_arrPromise[1],_arrPromise[2]).done(function(){
		console.log("s -- $.when() ---------------------------------------");
		_oJedoGantt.createGanttHeaderBack();
		console.log("e -- $.when() ---------------------------------------");
	});
	
	console.log("6 -----------------------------------------------------------");
	
	//this.setBodyGanttBar(nSvgWidth, nSvgToWidth);
	//console.debug("nSvgToWidth:"+nSvgToWidth);
	var jedoWorker = new Worker("jedo.JedoWorker.js");
	jedoWorker.postMessage({
		"cmd": "SettingBodyGanttBarData",
		"options": this.options,
		"startGanttDate": this.options.startGanttDate,
		"endGanttDate": this.options.endGanttDate,
		"nPrevWidth": nSvgWidth,
		"nToWidth": nSvgToWidth
	});
	
	jedoWorker.addEventListener("message", function(event){
		switch(event.data.cmd) {
		case "SettingBodyGanttBarData":
			_oJedoGantt.setBodyGanttBar(event.data.ganttBodyBarDatas);
			if(event.data.nPrevWidth) {
				var oGanttContainer = $(_oJedoGantt.ganttContainer);
				var xScroll = (event.data.nToWidth / event.data.nPrevWidth) * svgPoint.x;
				    xScroll = xScroll - ((oGanttContainer.width()/5)*3);
				    xScroll = xScroll < 0 ? 0 : xScroll;
				    oGanttContainer.animate({
				    	scrollLeft : xScroll
				      }, 1500);
			}
			break;
		} 
	}, false);
	console.log("e -- window.jedo.JedoGantt.prototype.changeGanttViewMode -- ");
};
window.jedo.JedoGantt.prototype.createGanttHeader = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
	
	var nSvgWidth = this.svg.attr("width");
	var nSvgHeaderHeight = this.options.header.lineHeight*this.options.header.viewLineCount;
	
	var ganttHeader = this.svg.append('g').attr('class', 'ganttHeader');
	ganttHeader.append('rect')
				.attr('class', 'ganttHeaderBg')
				.attr('x', 1)
				.attr('y', 1)
				.attr('width', nSvgWidth)
				.attr('height', nSvgHeaderHeight)
				.style({
					'fill': 'black',
				    'stroke': 'navy',
				    'stroke-width': 0
				});
	
	var _oJedoGantt = this;
	var _arrPromise = [];
	
	var sLineId = "";
	var headerViewLineCount = 0;
    if(	headerViewLineCount < this.options.header.viewLineCount && 
    	this.options.header.yearLine && 
    	0 < (this.dateViewMode-headerViewLineCount) ) {
    	var deferredYear = $.Deferred();
    	var JedoWorkerYear = new Worker("jedo.JedoWorker.js");
    	JedoWorkerYear.postMessage({
    		"cmd": "SettingHeaderGanttData",
    		"options": this.options,
    		"indexLine": headerViewLineCount,
    		"lineMode": window.jedo.YEAR,
    		"nPrevWidth": null,
    		"nToWidth": nSvgWidth
    	});
    	JedoWorkerYear.addEventListener("message", function(event){
    		switch(event.data.cmd) {
    		case "SettingHeaderGanttData":
    			_oJedoGantt.setGanttHeaderData(headerViewLineCount, window.jedo.YEAR, event.data.ganttHeaderDatas);
    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
    			deferredYear.resolve();
    			break;
    		}
    	}, false);
    	headerViewLineCount++;
    	_arrPromise[_arrPromise.length] = deferredYear.promise();
    }
    
    
    if(headerViewLineCount < this.options.header.viewLineCount && 
    		this.options.header.quarterLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	var deferredQuarter = $.Deferred();
    	var JedoWorkerQuarter = new Worker("jedo.JedoWorker.js");
    	JedoWorkerQuarter.postMessage({
    		"cmd": "SettingHeaderGanttData",
    		"options": this.options,
    		"indexLine": headerViewLineCount,
    		"lineMode": window.jedo.QUARTER,
    		"nPrevWidth": null,
    		"nToWidth": nSvgWidth
    	});
    	JedoWorkerQuarter.addEventListener("message", function(event){
    		switch(event.data.cmd) {
    		case "SettingHeaderGanttData":
    			_oJedoGantt.setGanttHeaderData(headerViewLineCount, window.jedo.QUARTER, event.data.ganttHeaderDatas);
    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
    			deferredQuarter.resolve();
    			break;
    		} 
    	}, false);
    	headerViewLineCount++;
    	_arrPromise[_arrPromise.length] = deferredQuarter.promise();
    }
    
    if(headerViewLineCount < this.options.header.viewLineCount && 
    		this.options.header.monthLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	var deferredMonth = $.Deferred();
    	var JedoWorkerMonth = new Worker("jedo.JedoWorker.js");
    	JedoWorkerMonth.postMessage({
    		"cmd": "SettingHeaderGanttData",
    		"options": this.options,
    		"indexLine": headerViewLineCount,
    		"lineMode": window.jedo.MONTH,
    		"nPrevWidth": null,
    		"nToWidth": nSvgWidth
    	});
    	JedoWorkerMonth.addEventListener("message", function(event){
    		switch(event.data.cmd) {
    		case "SettingHeaderGanttData":
    			_oJedoGantt.setGanttHeaderData(headerViewLineCount, window.jedo.MONTH, event.data.ganttHeaderDatas);
    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
    			deferredMonth.resolve();
    			break;
    		} 
    	}, false);
    	headerViewLineCount++;
    	_arrPromise[_arrPromise.length] = deferredMonth.promise();
    }	
    
    if(headerViewLineCount < this.options.header.viewLineCount && 
    		this.options.header.weekLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	var deferredWeek = $.Deferred();
    	var JedoWorkerWeek = new Worker("jedo.JedoWorker.js");
    	JedoWorkerWeek.postMessage({
    		"cmd": "SettingHeaderGanttData",
    		"options": this.options,
    		"indexLine": headerViewLineCount,
    		"lineMode": window.jedo.WEEK,
    		"nPrevWidth": null,
    		"nToWidth": nSvgWidth
    	});
    	JedoWorkerWeek.addEventListener("message", function(event){
    		switch(event.data.cmd) {
    		case "SettingHeaderGanttData":
    			_oJedoGantt.setGanttHeaderData(headerViewLineCount, window.jedo.WEEK, event.data.ganttHeaderDatas);
    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
    			deferredWeek.resolve();
    			break;
    		} 
    	}, false);
    	headerViewLineCount++;
    	_arrPromise[_arrPromise.length] = deferredWeek.promise();
    }
    
    if(headerViewLineCount < this.options.header.viewLineCount && 
    		this.options.header.dateLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	var deferredDate = $.Deferred();
    	var JedoWorkerDate = new Worker("jedo.JedoWorker.js");
    	JedoWorkerDate.postMessage({
    		"cmd": "SettingHeaderGanttData",
    		"options": this.options,
    		"indexLine": headerViewLineCount,
    		"lineMode": window.jedo.DATE,
    		"nPrevWidth": null,
    		"nToWidth": nSvgWidth
    	});
    	JedoWorkerDate.addEventListener("message", function(event){
    		switch(event.data.cmd) {
    		case "SettingHeaderGanttData":
    			_oJedoGantt.setGanttHeaderData(headerViewLineCount, window.jedo.DATE, event.data.ganttHeaderDatas);
    			_oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
    			deferredWeek.resolve();
    			break;
    		} 
    	}, false);
    	headerViewLineCount++;
    	_arrPromise[_arrPromise.length] = deferredDate.promise();
    }
    
    $.when(_arrPromise[0],_arrPromise[1],_arrPromise[2]).done(function(){
    	console.log("s -- $.when() ---------------------------------------");
    	_oJedoGantt.createGanttHeaderBack();
    	console.log("e -- $.when() ---------------------------------------");
    });

	
	
    //console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
};
window.jedo.JedoGantt.prototype.createGanttHeaderBack = function() {
	
	this.svg.select("rect.ganttHeaderBack").remove();
	var lH = this.options.header.lineHeight;
	var x = (lH/5);
	var y = (lH/5);
	var w = (lH/5)*3;
	var h = (lH/5)*3;
	var ganttHeader = this.svg.select("g.ganttHeader");
	ganttHeader.append('rect')
				.attr('class', 'ganttHeaderBack')
				.attr('x', x)
				.attr('y', y)
				.attr('width', w)
				.attr('height', h)
				.style({
					'fill': 'black',
				    'stroke': 'navy',
				    'stroke-width': 0
				});
	var node = this.svg.select("rect.ganttHeaderBack").node();
	node.addEventListener("mouseover", function(event){
		d3.select(this).style({
		    'stroke-width': 1
		});
	},false);
	node.addEventListener("mouseout", function(event){
		d3.select(this).style({
		    'stroke-width': 0
		});
	},false);
	var oJedoGantt = this;
	node.addEventListener("click", function(event){
		console.log("s -- window.jedo.JedoGantt.prototype.createGanttHeaderBack.click -- ");
		
		var svgPoint	= window.jedo.getSVGCursorPoint(oJedoGantt.svg, event);
		oJedoGantt.changeGanttViewMode(svgPoint, oJedoGantt.dateViewMode-1);
		console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeaderBack.click -- ");
	},false);
};
window.jedo.JedoGantt.prototype.createGanttBody = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
	
	var options = this.options;
	var nSvgWidth = this.svg.attr('width');
	var nSvgHeight = this.svg.attr('height');
	var nSvgHeaderHeight = options.header.lineHeight*options.header.viewLineCount;
	var nSvgBodyHeight = options.lineHeight*options.ganttData.length;
	
	var ganttBody = this.svg.append('g').attr('class', 'ganttBody');
	ganttBody.append('rect')
		.attr('class', 'ganttBodyBg')
		.attr('x', 1)
		.attr('y', nSvgHeaderHeight+1)
		.attr('width', nSvgWidth)
		.attr('height', nSvgBodyHeight)
		.style({
			'fill': 'red',
		    'stroke': 'navy',
		    'stroke-width': 0
		});
	//this.setBodyGanttBar(null, nSvgWidth);

	var jedoWorker = new Worker("jedo.JedoWorker.js");
	jedoWorker.postMessage({
		"cmd": "SettingBodyGanttBarData",
		"options": options,
		"startGanttDate": options.startGanttDate,
		"endGanttDate": options.endGanttDate,
		"nPrevWidth": null,
		"nToWidth": nSvgWidth
	});
	var _oJedoGantt = this;
	jedoWorker.addEventListener("message", function(event){
		switch(event.data.cmd) {
		case "SettingBodyGanttBarData":
			_oJedoGantt.setBodyGanttBar(event.data.ganttBodyBarDatas);
			break;
		} 
	}, false);
	
	//console.log("e -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
};
window.jedo.JedoGantt.prototype.setBodyGanttBar = function(arr) {
	//console.log("s -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");
	var iX = this.fnScale(this.options.endGanttDate, window.jedo.DATE_SCALE_TYPE_END);
	window.jedo.setGanttBodyLine(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX);
	window.jedo.setGanttBodyBar(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX, this);
	if(!this.fnPrevScale) {
		var oJedoGantt = this;
		this.svg.select('g.ganttBody').selectAll("rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar")
			.each(function(){
				this.addEventListener("mouseover", oJedoGantt.mouseOverBar.bind(oJedoGantt), false);
				//this.addEventListener("mouseout",  oJedoGantt.mouseOutBar.bind(oJedoGantt),  false);
				this.addEventListener("mousedown", oJedoGantt.mouseDownBar.bind(oJedoGantt), false);
			});
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");
};
window.jedo.JedoGantt.prototype.setHeaderLineMode = function(indexLine, lineMode, arr) {
	//console.log("s -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
	console.log("indexLine:"+indexLine+" lineMode:"+window.jedo.getViewModeString(lineMode));
	this.svg.selectAll('rect.rectheaderLine'+indexLine).remove();
	this.svg.selectAll('text.textheaderLine'+indexLine).remove();
	
	if(this.fnPrevScale) {
		
		window.jedo.createRectHeaderLineTransition(this.svg.select("g.ganttHeader"), indexLine, lineMode, arr);
		window.jedo.createTextHeaderLineTransition(this.svg.select("g.ganttHeader"), indexLine, lineMode, arr, this.options);
		
	} else {
		
		window.jedo.createRectHeaderLine(this.svg.select("g.ganttHeader"), indexLine, lineMode, arr);
		window.jedo.createTextHeaderLine(this.svg.select("g.ganttHeader"), indexLine, lineMode, arr, this.options);
	}
	
	var oJedoGant = this;
	var options = this.options;
	this.svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
		.each(function(){
			if(indexLine+1 === options.header.viewLineCount) {
				this.addEventListener("mouseup", oJedoGant.onHeaderMouseUp.bind(oJedoGant),false);
			} 
			this.addEventListener("mouseover", function(event){
				var sDataID = event.target.getAttribute("dataID");
				d3.select(this).style({'stroke-width':2});
			},false);
			this.addEventListener("mouseout", function(event){
				var sDataID = event.target.getAttribute("dataID");
				d3.select(this).style({'stroke-width':0});
			},false);
		});
	//console.log("e -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
};
window.jedo.JedoGantt.prototype.getMarkPoints = function(iX, iY, iW, iH) {
	var mH = (iH/5)*3;
	var mT = iH/3;
	//console.log("iX:%i, iY:%i, iW:%i, iH:%i ",iX, iY, iW, iH);
	return [ { "x": iX-mT,  "y": iY},  
             { "x": iX+mT,  "y": iY},
             { "x": iX+mT,  "y": iY+mH}, 
             { "x": iX,  	"y": iY+iH},
             { "x": iX-mT,  "y": iY+mH}
           ];
};
window.jedo.JedoGantt.prototype.mouseOverBar = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.mouseOverBar  --");
//	console.debug("id:"+event.target.getAttribute("id"));
//	console.debug("class:"+event.target.getAttribute("class"));
	
	var sDataID = event.target.getAttribute("dataID");
	//console.debug("dataID:"+event.target.getAttribute("dataID"));
	d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID).each(function(){
		if(this.getAttribute("class") == "rectGanttBar") {
			d3.select(this).style({'cursor':'pointer'});
		} else {
			d3.select(this).style({'cursor':'col-resize'});
		}
	});
//	console.log("e -- window.jedo.JedoGantt.prototype.mouseOverBar  --");
};
//window.jedo.JedoGantt.prototype.mouseOutBar = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.mouseOutBar  --");
//	d3.select(event.target).style({'cursor':'default'});
//	console.log("e -- window.jedo.JedoGantt.prototype.mouseOutBar  --");
//};
window.jedo.JedoGantt.prototype.mouseDownBar = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.mouseDownBar  --");
//	console.log("event.type:"+event.type+" clientX:"+event.clientX+" x:"+event.x+" clientY:"+event.clientY+" y:"+event.y);
//	
	this.clearCapturedGanttBar();
	
	var oTarget = d3.select(event.target);
	var sDataID = oTarget.attr("dataID");
	
	var gGanttBar = d3.select("#gGanttBar_"+sDataID);
	
	var sClass = event.target.getAttribute("class");
	if(sClass == "startMarkGanttBar") {
		
		this.capturedMode = "LeftChange";
	} else if(sClass == "rectGanttBar") {
		
		this.capturedMode = "MoveChange";
	} else if(sClass == "endMarkGanttBar") {
		
		this.capturedMode = "RightChange";
		
	} else {
		throw new TypeError("event.target class["+sClass+"] is bad");
	}
	d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID).each(function(){
		d3.select(this).style({'stroke-width':2});
	});
	this.capturedDataID = sDataID;
	
//	console.log("e -- window.jedo.JedoGantt.prototype.mouseDownBar  --");
};
window.jedo.JedoGantt.prototype.mouseUpBar = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.mouseUpBar  --");
	this.clearCapturedGanttBar();
//	console.log("e -- window.jedo.JedoGantt.prototype.mouseUpBar  --");
};
window.jedo.JedoGantt.prototype.mouseMoveBar = function(event) {
	//console.log("s -- window.jedo.JedoGantt.prototype.mouseMoveBar  --");
	//console.log("event.type:"+event.type+" clientX:"+event.clientX+" clientY:"+event.clientY+" y:"+event.y);
	//console.debug("which:"+event.which);
	
	if(this.capturedDataID) {
		var svgPoint = window.jedo.getSVGCursorPoint(this.svg, event);
	    //console.debug("svg mouse at"+ " x:" + svgPoint.x +" y:" +svgPoint.y);
	    
		var gGanttBar = d3.select("#gGanttBar_"+this.capturedDataID);
		var oRectGanttBar = d3.select("#rectGanttBar_"+this.capturedDataID);
		var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+this.capturedDataID);
		var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+this.capturedDataID);
		
		var xRectGanttBar = oRectGanttBar.attr("x");
		var yRectGanttBar = oRectGanttBar.attr("y");
		var wRectGanttBar = oRectGanttBar.attr("width");
		var hRectGanttBar = oRectGanttBar.attr("height");
		
		var xEndMarkGanttBar = oEndMarkGanttBar.attr("width");
		
		
		var nGanttBarHeight = gGanttBar.attr("ganttBarHeight");
		console.log("nGanttBarHeight:%i", nGanttBarHeight);
		if(this.capturedMode === "LeftChange") {
			
			
		} else if(this.capturedMode === "MoveChange") {
			
			
			
		} else if(this.capturedMode === "RightChange") {
			
			var w1 = parseInt(svgPoint.x) - xRectGanttBar;
			w1 = w1 < this.options.unitSpace ? this.options.unitSpace : w1;
			oRectGanttBar.attr("width", w1);
			//console.log("svgPoint.x:i%, yRectGanttBar:i%, wRectGanttBar:i%, nGanttBarHeight:i%", svgPoint.x, yRectGanttBar, wRectGanttBar, nGanttBarHeight);
			var polyData = this.getMarkPoints(svgPoint.x, yRectGanttBar, wRectGanttBar, nGanttBarHeight);
			//console.log("polyData:"+polyData);
			oEndMarkGanttBar.attr("points",function(d) { 
	    		return polyData.map(function(d){ 
	    			return [d.x,d.y].join(",");}).join(" "); 
	    	});
		}
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.mouseMoveBar  --");
};
window.jedo.JedoGantt.prototype.onHeaderMouseUp = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.onHeaderMouseUp  --");
	var svgPoint	= window.jedo.getSVGCursorPoint(this.svg, event);
	this.changeGanttViewMode(svgPoint, this.dateViewMode+1);
//	console.log("e -- window.jedo.JedoGantt.prototype.onHeaderMouseUp  --");
};



}//if(!window.jedo.hasOwnProperty("JedoGantt")) {

