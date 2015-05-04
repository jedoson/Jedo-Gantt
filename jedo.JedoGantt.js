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
	
	// -------------------------------------------------------------------------------------//
	var _ganttViewMode = [];
	var _settingGanttData = {};
	var _getSettingGanttData = function(nViewMode) {
		var sViewMode = window.jedo.getViewModeString(nViewMode);
		return _settingGanttData[sViewMode];
	};
	var _setSettingGanttData = function(nViewMode, oSettingGanttData) {
		var sViewMode = window.jedo.getViewModeString(nViewMode);
		if(!oSettingGanttData instanceof window.jedo.SettingGanttData) {
			throw new Error("parameter oSettingGanttData is not instance of window.jedo.SettingGanttData ");
		}
		var o = _settingGanttData[sViewMode];
		if(o != null) {
			throw new Error("ViewMode %s is already in ", sViewMode);
		}
		_settingGanttData[sViewMode] = oSettingGanttData;
		_ganttViewMode.push(nViewMode);
	};
	Object.defineProperty(this, "getSettingGanttData", {
		get: function() {
			return _getSettingGanttData;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setSettingGanttData", {
		get: function() {
			return _setSettingGanttData;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "dateViewMode", {
		get: function() {
			return _ganttViewMode[_ganttViewMode.length-1];
		},
		set: function(nViewMode) {
			if(this.isDateViewMode(nViewMode)) {
				_ganttViewMode.push(nViewMode);
			} else {
				throw new Error("Date ViewMode Setting Data Not found !.");
			}
		},
		enumerable: false,
		configurable: false
	});
	
	var _isDateViewMode = function(nViewMode) {
		var sViewMode = window.jedo.getViewModeString(nViewMode);
		return _settingGanttData[sViewMode] !== undefined;
	};
	Object.defineProperty(this, "isDateViewMode", {
		get: function() {
			return _isDateViewMode;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "prevSvgWidth", {
		get: function() {
			if(_ganttViewMode.length < 2) return null;
			var nDateViewMode = _ganttViewMode[_ganttViewMode.length-2];
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.svgWidth;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "dateViewModeSvgWidth", {
		get: function() {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.svgWidth;
		},
		enumerable: false,
		configurable: false
	});
	
	

	Object.defineProperty(this, "fnScale", {
		get: function() {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.fnScale;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "fnPrevScale", {
		get: function() {
			if(_ganttViewMode.length < 2) return null;
			var nDateViewMode = _ganttViewMode[_ganttViewMode.length-2];
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.fnScale;
		},
		enumerable: false,
		configurable: false
	});
	
	
	Object.defineProperty(this, "getGanttHeaderData", {
		get: function() {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.getGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "setGanttHeaderData", {
		get: function() {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.setGanttHeaderData;
		},
		enumerable: false,
		configurable: false
	});
	

	Object.defineProperty(this, "ganttBodyData", {
		get: function() {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			return oGanttData.ganttBodyData;
		},
		set: function(nData) {
			var nDateViewMode = this.dateViewMode;
			var oGanttData = this.getSettingGanttData(nDateViewMode);
			oGanttData.ganttBodyData = nData;
		},
		enumerable: false,
		configurable: false
	});
	
	// -------------------------------------------------------------------------------------//
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
window.jedo.JedoGantt.prototype.initJedoGantt = function(nSvgWidth) {
	//console.log("s -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
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

    var oFnScale = window.jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, nSvgWidth);
    var nDateViewMode = window.jedo.getDateViewMode(this.options, oFnScale);
    //console.log("sDateViewMode:"+window.jedo.getViewModeString(nDateViewMode));
    this.setSettingGanttData(nDateViewMode, 
    		new window.jedo.SettingGanttData(nDateViewMode, nSvgWidth, oFnScale));
    //console.log("this.dateViewMode:"+window.jedo.getViewModeString(this.dateViewMode));
	this.createGanttBody();
	this.createGanttHeader();
	

	//console.log("e -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
};
window.jedo.JedoGantt.prototype.changeGanttViewMode = function(svgPoint, nDateViewMode) {
	//console.log("s -- window.jedo.JedoGantt.prototype.changeGanttViewMode -- ");
	//console.log("nDateViewMode:"+window.jedo.getViewModeString(nDateViewMode));
	//console.log("now this.dateViewMode:"+window.jedo.getViewModeString(this.dateViewMode));
	
	var nSvgToWidth = 0;
	var nSvgWidth = this.svg.attr("width");
	if(window.jedo.DATE < nDateViewMode) {
		console.debug("nHeaderDateViewMode["+nDateViewMode+"] is bad");
		return;
	}
	if(nDateViewMode < window.jedo.MONTH) {
		console.debug("nHeaderDateViewMode["+nDateViewMode+"] is bad");
		return;
	}
	
	var bDataViewMode = this.isDateViewMode(nDateViewMode);
	if(!bDataViewMode) {
		nSvgToWidth = window.jedo.getChangeSvgWidth(nDateViewMode, this.fnScale, this.options, this.svg);
		var oFnScale = window.jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, nSvgToWidth);
		this.setSettingGanttData(nDateViewMode, 
	    		new window.jedo.SettingGanttData(nDateViewMode, nSvgToWidth, oFnScale));
		
	} else {
		this.dateViewMode = nDateViewMode;
		nSvgToWidth = this.dateViewModeSvgWidth;
	}
	
	this.svg.attr("width", nSvgToWidth);
	
	this.svg.select('rect.ganttHeaderBg').attr('width', nSvgToWidth);
	this.svg.select('rect.ganttBodyBg').attr('width', nSvgToWidth);
	
	this.changeGanttHeaderViewMode(svgPoint, nSvgWidth, nSvgToWidth);
	this.changeGanttBodyViewMode(svgPoint, nSvgWidth, nSvgToWidth);
	
	//console.log("e -- window.jedo.JedoGantt.prototype.changeGanttViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeGanttHeaderViewMode = function(svgPoint, nSvgWidth, nSvgToWidth) {
	//console.log("s -- window.jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
	
	var _arrDeferred = [];
	var _arrPromise = [];
	
	var oJedoWorker = {};
	var _oJedoGantt = this;
	
	var i = 0;
	var n = this.options.header.viewLineCount;
	for(i=0; i<n; i++) {
		var nLineMode = this.dateViewMode-(n-(i+1));
		//console.log("nLineMode:"+window.jedo.getViewModeString(nLineMode));
		var arr = this.getGanttHeaderData(i, nLineMode);
		if(arr == null) {
			_arrDeferred[i] = $.Deferred();
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
	    	_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();
		} else {
			_oJedoGantt.setHeaderLineMode(i, nLineMode, arr);
		}
	}
	
	if(0 < _arrPromise.length) {
		$.when.apply($, _arrPromise).done(function(){
			_oJedoGantt.createGanttHeaderBack();
		});
	} else {
		_oJedoGantt.createGanttHeaderBack();
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeGanttBodyViewMode = function(svgPoint, nSvgWidth, nSvgToWidth) {
	//console.log("s -- window.jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
	//this.setBodyGanttBar(nSvgWidth, nSvgToWidth);
	//console.debug("nSvgToWidth:"+nSvgToWidth);
	if(!this.ganttBodyData) {
		var jedoWorker = new Worker("jedo.JedoWorker.js");
		var _oJedoGantt = this;
		jedoWorker.addEventListener("message", function(event){
			switch(event.data.cmd) {
			case "SettingBodyGanttBarData":
				_oJedoGantt.ganttBodyData = event.data.ganttBodyBarDatas;
				_oJedoGantt.setBodyGanttBar(event.data.ganttBodyBarDatas);
				break;
			} 
		}, false);
		jedoWorker.postMessage({
			"cmd": "SettingBodyGanttBarData",
			"options": this.options,
			"startGanttDate": this.options.startGanttDate,
			"endGanttDate": this.options.endGanttDate,
			"nPrevWidth": nSvgWidth,
			"nToWidth": nSvgToWidth
		});
	} else {
		this.setBodyGanttBar(this.ganttBodyData);
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
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
    
    $.when.apply($, _arrPromise).done(function(){
    	_oJedoGantt.createGanttHeaderBack();
    });

	
	
    //console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
};
window.jedo.JedoGantt.prototype.createGanttHeaderBack = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
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
		
		
		var oGanttContainer = $(oJedoGantt.ganttContainer);
		var nViewWidth = oGanttContainer.width();
		var nClientX = nViewWidth/2;
		var scrollLeft = oGanttContainer.scrollLeft();
		var svgPoint	= window.jedo.getSVGCursorPoint(oJedoGantt.svg, event);
		
		var nSTime = oJedoGantt.options.startGanttDate.getTime();
		var nETime = oJedoGantt.options.endGanttDate.getTime();
		var nWTime = nETime - nSTime;
		var nFWidth = oJedoGantt.svg.attr("width");
		var nTime = (nWTime/nFWidth)*(svgPoint.x);
		
		var oClickDate = new Date(nSTime+nTime);
		
		var svgPoint	= window.jedo.getSVGCursorPoint(oJedoGantt.svg, event);
		oJedoGantt.changeGanttViewMode(svgPoint,  window.jedo.getZoomOutViewMode(oJedoGantt.dateViewMode));
		

		var nSvgToWidth = oJedoGantt.svg.attr("width");
		var nToTimePx = oJedoGantt.fnScale(oClickDate);
		var nTScroll = nToTimePx-nClientX;
		
	    oGanttContainer.animate({
	    	scrollLeft : nTScroll
	      }, 2000);
		
		
		console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeaderBack.click -- ");
	},false);
	//console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
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
				this.addEventListener("mousedown", oJedoGantt.mouseDownGanttBar.bind(oJedoGantt), false);
			});
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");
};
window.jedo.JedoGantt.prototype.setHeaderLineMode = function(indexLine, lineMode, arr) {
	//console.log("s -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
	//console.log("indexLine:"+indexLine+" lineMode:"+window.jedo.getViewModeString(lineMode));
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
window.jedo.JedoGantt.prototype.mouseDownGanttBar = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.mouseDownGanttBar  --");
//	console.log("event.type:"+event.type+" clientX:"+event.clientX+" x:"+event.x+" clientY:"+event.clientY+" y:"+event.y);
//	
	this.clearCapturedGanttBar();
	
	var oTarget = d3.select(event.target);
	var sDataID = oTarget.attr("dataID");
	var dataIndex = oTarget.attr("dataIndex");
	var gGanttBar = d3.select("#gGanttBar_"+sDataID);
	
	con            sole.log("dataIndex:"+dataIndex);
	
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
	
//	console.log("e -- window.jedo.JedoGantt.prototype.mouseDownGanttBar  --");
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
			var polyData = window.jedo.getMarkPoints(svgPoint.x, yRectGanttBar, wRectGanttBar, nGanttBarHeight);
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
	console.log("s -- window.jedo.JedoGantt.prototype.onHeaderMouseUp  --");
	
	var oGanttContainer = $(this.ganttContainer);
	var nViewWidth = oGanttContainer.width();
	var nClientX = event.clientX;
	var scrollLeft = oGanttContainer.scrollLeft();
	var svgPoint	= window.jedo.getSVGCursorPoint(this.svg, event);
	
	var nSTime = this.options.startGanttDate.getTime();
	var nETime = this.options.endGanttDate.getTime();
	var nWTime = nETime - nSTime;
	var nFWidth = this.svg.attr("width");
	var nTime = (nWTime/nFWidth)*(svgPoint.x);
	
	var oClickDate = new Date(nSTime+nTime);

	
	this.changeGanttViewMode(svgPoint, window.jedo.getZoomInViewMode(this.dateViewMode));

	var nSvgToWidth = this.svg.attr("width");
	var nToTimePx = this.fnScale(oClickDate);
	var nTScroll = nToTimePx-nClientX;
	
    oGanttContainer.animate({
    	scrollLeft : nTScroll
      }, 2000);
	
	console.log("e -- window.jedo.JedoGantt.prototype.onHeaderMouseUp  --");
};



}//if(!window.jedo.hasOwnProperty("JedoGantt")) {

