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
			_dateViewMode = viewMode;
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
	this.clearCapturedGanttBar = function() {
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
};
window.jedo.JedoGantt.prototype.initJedoGantt = function() {
	console.log("s -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
	console.log('this.svg.attr("width"):%i', this.svg.attr("width"));
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
	console.log("e -- window.jedo.JedoGantt.prototype.initJedoGantt -- ");
};
window.jedo.JedoGantt.prototype.isInChildGantt = function(id) {
	var o = null;
	var i = 0;
	var options = this.options;
	var ganttData = options.ganttData;
	var nLength = ganttData.length;
	for(i=0; i<nLength; i++) {
		o = ganttData[i];
		if(o.parentId == id) {
			return true;
		}
	}
	return false;
};
window.jedo.JedoGantt.prototype.initHeaderDateViewMode = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
	//var fnScale = this.getFnScale();
	var options = this.options;
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = this.fnScale(oDate);
	
	oDate.setHours(23,59,59,999);
	var iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Date["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.DATE;
		return;
	}
	
	
	oDate.setDate(7);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.WEEK;
		return;
	}
	
	
	oDate.setMonth(oDate.getMonth()+1);
	oDate.setDate(0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Month["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.MONTH;
		return;
	}
	
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(3);
	oDate.setDate(0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Quarter["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.QUARTER;
		return;
	}
	
	oDate.setMonth(12, 0);
	iWidth = this.fnScale(oDate) - iSPos;
	//console.debug("One Year["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.dateViewMode = window.jedo.YEAR;
		return;
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeHeaderDateViewMode = function(nHeaderDateViewMode) {
	//console.log("s -- window.jedo.JedoGantt.prototype.changeHeaderDateViewMode -- ");
	
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
	//console.log("e -- window.jedo.JedoGantt.prototype.changeHeaderDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.createGanttHeader = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
	
	var oGanttContainer = $(this.ganttContainer);
	
	var iLeft = 0;
    var iLineCount = 0;
    var iCount = 0;
    var iWidth = 0;
    var iHeadLine = 0;
    var options = this.options;
    
	var nSvgWidth = this.svg.attr("width");
	var nSvgHeaderHeight = options.header.lineHeight*options.header.viewLineCount;
	

	
  
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
	
	var sLineId = "";
	var headerViewLineCount = 0;
    if(	headerViewLineCount < options.header.viewLineCount && 
    	options.header.yearLine && 
    	0 < (this.dateViewMode-headerViewLineCount) ) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.YEAR);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.quarterLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.QUARTER);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.monthLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.MONTH);
    }	
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.weekLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.WEEK);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.dateLine &&
    	0 < (this.dateViewMode-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.DATE);
    }
    //console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
};

window.jedo.JedoGantt.prototype.createGanttBody = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
	
	var oGanttContainer = $(this.ganttContainer);
	
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
	this.setBodyGanttBar();
	//console.log("e -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
};
window.jedo.JedoGantt.prototype.setBodyGanttBar = function() {
	//console.log("s -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");

	var options = this.options;
	var nSvgWidth = this.svg.attr('width');
	var iHeadLineCount = options.header.viewLineCount;
	var nSvgHeaderHeight = options.header.lineHeight*iHeadLineCount;
	
	
	var nSvgHeight = nSvgHeaderHeight + (options.ganttData.length * options.lineHeight);
	this.svg.attr("height",nSvgHeight);
	
	
	
	var iSPos = 0;
	var iToSPos = 0;
	var iEPos = 0;
	var iToEPos = 0;
	var iLine = 0;
	var iWidth = 0;
	var iToWidth = 0;
	var oJedoGantt = this;
	var iGanttBarHeight = options.lineHeight-(options.body.barSpace*2);
	
	
	
	var arr = [];
	var oJedoGantt = this;
	$(options.ganttData).each(function(index){
		//console.log("ganttData.index:"+index);
		
		var sID = $(this).attr("id");
		var sDate = $(this).attr("startDate");
		var eDate = $(this).attr("endDate");
		
		iLine = options.unitSpace + (index * options.lineHeight);
		
		sDate.setHours(0,0,0,0);
		if(oJedoGantt.fnPrevScale) {
			iSPos = oJedoGantt.fnPrevScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
			iToSPos = oJedoGantt.fnScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
		} else {
			iSPos = oJedoGantt.fnScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
		}
		
		eDate.setHours(23,59,59,999);
		if(oJedoGantt.fnPrevScale) {
			iEPos = oJedoGantt.fnPrevScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
			iToEPos = oJedoGantt.fnScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
		} else {
			iEPos = oJedoGantt.fnScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
		}

		if(oJedoGantt.fnPrevScale) {
			iWidth = iEPos - iSPos;
			iToWidth = iToEPos - iToSPos;
		} else {
			iWidth = iEPos - iSPos;
		}
		
		arr[arr.length] = {
			id : sID,
			x1 : iSPos,
			y1 : nSvgHeaderHeight+((options.lineHeight*index)+options.body.barSpace),
			w1 : iWidth,
			h1 : iGanttBarHeight,
			x2 : iToSPos,
			w2 : iToWidth,
			lineHeight : options.lineHeight,
			ganttBarHeight : iGanttBarHeight,
			lineY : nSvgHeaderHeight+(options.lineHeight*index),
			isParent : oJedoGantt.isInChildGantt(sID),
			parentId : $(this).attr("parentId"),
			style : {
				fill: '#0000cd', 
				stroke: '#ff69b4', 
				strokeWidth: 0
			}
		}
	});
	
	var iX = this.fnScale(options.endGanttDate, window.jedo.DATE_SCALE_TYPE_END);
	window.jedo.setGanttBodyLine(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX);
	window.jedo.setGanttBodyBar(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX, this);
	if(!this.fnPrevScale) {
		this.svg.select('g.ganttBody').selectAll("rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar")
			.each(function(){
				this.addEventListener("mouseover", oJedoGantt.mouseOverBar.bind(oJedoGantt), false);
				//this.addEventListener("mouseout",  oJedoGantt.mouseOutBar.bind(oJedoGantt),  false);
				this.addEventListener("mousedown", oJedoGantt.mouseDownBar.bind(oJedoGantt), false);
			});
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");
};
window.jedo.JedoGantt.prototype.setHeaderLineMode = function(indexLine, lineMode) {
//	console.log("s -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
//	console.log("indexLine:"+indexLine);
//	console.log("lineMode:"+lineMode);
	
	var options = this.options;
	var sLineId = "Headerline"+indexLine;
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setHours(0,0,0,1);
	
	var nSvgWidth = this.svg.attr("width");
	
	//var fnScale = this.fnScale;
	//var fnPrevScale = this.fnPrevScale;
	
	var iWidth = 0;
	var iToWidth = 0;
	var iEnd = 0;
	var iToEnd = 0;
	var iLeft = options.unitSpace;
	var iToLeft = options.unitSpace;
	var iPrevYear = oDate.getFullYear();
	var iPrevDate = oDate.getDate();
	var iWeekNo = d3.time.format('%W')(oDate);
	var iPrevWeekNo = iWeekNo;
	var nQuarter = 0;
	var sDateText = "";
	var sClassName = "headRectLine"+indexLine;
	var sTextClassName = "headTextLine"+indexLine;
	
	var fnFormat = window.jedo.getTimeFormat(indexLine, lineMode);
	
	if(this.fnPrevScale) {
		iLeft = this.fnPrevScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
		iToLeft = this.fnScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
	} else {
		iLeft = this.fnScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
	}

	var arr = [];
	var y = options.unitSpace+(options.header.lineHeight*indexLine);
	
	var nGanttEndTime = options.endGanttDate.getTime();
	while(oDate.getTime() <= nGanttEndTime) {
		
		iLeft = iEnd+1;
		if(this.fnPrevScale) {
			iToLeft = iToEnd+1;
		}

    	window.jedo.setNextDate(oDate, lineMode, this.options);
    	if(nGanttEndTime < oDate.getTime()) {
    		oDate.setTime(nGanttEndTime);
    		oDate.setHours(23,59,59,999);
    	}
    	
    	if(this.fnPrevScale) {
    		iEnd = this.fnPrevScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
    		iToEnd = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
		} else {
			iEnd = this.fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
		}
    	
    	iWidth = iEnd - iLeft;
    	if(this.fnPrevScale) {
    		iWidth = iEnd - iLeft;
    		iToWidth = iToEnd - iToLeft;
    	}
		
		if(lineMode === window.jedo.YEAR) {
			
			sDateText = fnFormat(oDate);
			
    	} else if(lineMode === window.jedo.QUARTER) {
    		nQuarter = window.jedo.getQuarter(oDate);
    		sDateText = fnFormat(oDate)+" "+nQuarter+"분기";
    	} else if(lineMode === window.jedo.MONTH) {
    		sDateText = fnFormat(oDate);
    	} else if(lineMode === window.jedo.WEEK) {
    		sDateText = fnFormat(oDate);
    	} else if(lineMode === window.jedo.DATE) {
    		sDateText = fnFormat(oDate);
    	} else if(lineMode === window.jedo.HOUR) {
    		sDateText = fnFormat(oDate);
    	}
		
		var bLastHeaderLine = indexLine+1 === options.header.viewLineCount;
		var h = bLastHeaderLine ? options.header.lineHeight-(options.unitSpace*2) : options.header.lineHeight-options.unitSpace;
//		console.debug("iHeight:"+h);
		//console.debug("y:"+y);
		arr[arr.length] = {
				x : iLeft,
				y : y,
				width : (iWidth-options.unitSpace) < 1 ? 1 : (iWidth-options.unitSpace),
				height : h,
				x2 : iToLeft,
				y2 : y,
				w2 : iToWidth < 1 ? 1 :iToWidth,
				h2 : h,
				title : sDateText,
				itemId : window.jedo.getHeaderItemID(lineMode, sLineId, oDate),
				ObjectDate : (new Date()).setTime(oDate.getTime()),
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
		window.jedo.setEndDate(oDate, lineMode);
		if(lineMode === window.jedo.WEEK) {
	        if(iPrevYear == oDate.getFullYear()) {
	        	iWeekNo++;
	        } else {
	        	iWeekNo = 1;
	        	iPrevYear = oDate.getFullYear();
	        }
		} else if(lineMode === window.jedo.HOUR) {
			if(iPrevDate !== oDate.getDate()) {
				iPrevDate = oDate.getDate();
			}
		}
    }
	
	this.svg.selectAll('rect.rectheaderLine'+indexLine).remove();
	this.svg.selectAll('text.textheaderLine'+indexLine).remove();
	
	if(this.fnPrevScale) {
		
		window.jedo.createRectHeaderLineTransition(this.svg.select("g.ganttHeader"), indexLine, arr);
		window.jedo.createTextHeaderLineTransition(this.svg.select("g.ganttHeader"), indexLine, arr, this.options);
		
	} else {
		
		window.jedo.createRectHeaderLine(this.svg.select("g.ganttHeader"), indexLine, arr);
		window.jedo.createTextHeaderLine(this.svg.select("g.ganttHeader"), indexLine, arr, this.options);
	}
	if(indexLine+1 === options.header.viewLineCount) {
		var oJedoGant = this;
		this.svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
			.each(function(){
				this.addEventListener("mouseup", oJedoGant.changeFnScale.bind(oJedoGant),false);
			});
	}
//	console.log("e -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
};
window.jedo.JedoGantt.prototype.getMarkPoints = function(iX, iY, iW, iH) {
	var mH = (iH/5)*3;
	var mT = iH/3;
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
		throw TypeError("event.target class["+sClass+"] is bad");
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
	
	var sDataID = this.capturedDataID;
	if(sDataID) {
		var options = this.options;
		var svgPoint = window.jedo.getSVGCursorPoint(this.svg, event);
	    //console.debug("svg mouse at"+ " x:" + svgPoint.x +" y:" +svgPoint.y);
	    
		var gGanttBar = d3.select("#gGanttBar_"+sDataID);
		var oRectGanttBar = d3.select("#rectGanttBar_"+sDataID);
		var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+sDataID);
		var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+sDataID);
		
		var xRectGanttBar = oRectGanttBar.attr("x");
		var yRectGanttBar = oRectGanttBar.attr("y");
		var wRectGanttBar = oRectGanttBar.attr("width");
		var hRectGanttBar = oRectGanttBar.attr("height");
		
		var xEndMarkGanttBar = oEndMarkGanttBar.attr("width");
		
		
		var nGanttBarHeight = gGanttBar.attr("ganttBarHeight");
		if(this.capturedMode === "LeftChange") {
			
			
		} else if(this.capturedMode === "MoveChange") {
			
			
			
		} else if(this.capturedMode === "RightChange") {
			
			var w1 = parseInt(svgPoint.x) - xRectGanttBar;
			w1 = w1 < options.unitSpace ? options.unitSpace : w1;
			oRectGanttBar.attr("width", w1);
			
			var polyData = this.getMarkPoints(svgPoint.x, yRectGanttBar, wRectGanttBar, nGanttBarHeight);
			oEndMarkGanttBar.attr("points",function(d) { 
	    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
	    	});
		}
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.mouseMoveBar  --");
};
window.jedo.JedoGantt.prototype.changeFnScale = function(event) {
//	console.log("s -- window.jedo.JedoGantt.prototype.changeFnScale  --");
	
	var options = this.options;
	var oGanttContainer = $(this.ganttContainer);
	var nSvgWidth = this.svg.attr("width");
	var svgPoint	= window.jedo.getSVGCursorPoint(this.svg, event);
//	console.debug("event.clientX:"+event.clientX+" event.clientY:"+event.clientY+" svg mouse at"+ " x:" + svgPoint.x +" y:" +svgPoint.y);
//	console.debug("nSvgWidth:"+nSvgWidth);
	
	if(window.jedo.HOUR < (this.dateViewMode+1)) {
		console.debug("nHeaderDateViewMode["+this.dateViewMode+"] is bad");
		return;
	}
	this.dateViewMode = this.dateViewMode+1;
	
	this.changeHeaderDateViewMode(this.dateViewMode);
	
	//var fnScale = this.getFnScale();
	var nSvgToWidth = this.svg.attr("width");
	this.svg.select('rect.ganttHeaderBg').attr('width', nSvgToWidth);
	this.svg.select('rect.ganttBodyBg').attr('width', nSvgToWidth);

	var i = 0;
	var n = options.header.viewLineCount;
    for(i=0; i<n; i++) {
    	var nLineMode = this.dateViewMode-(n-(i+1));
    	this.setHeaderLineMode(i, nLineMode);
    }
    this.setBodyGanttBar();
    //console.debug("nSvgToWidth:"+nSvgToWidth);
    
    var xScroll = (nSvgToWidth / nSvgWidth) * svgPoint.x;
    xScroll = xScroll - ((oGanttContainer.width()/5)*3);
    xScroll = xScroll < 0 ? 0 : xScroll;
    //oGanttContainer.scrollLeft(xScroll);
    oGanttContainer.animate({
    	scrollLeft : xScroll
      }, 1500);
//	console.log("e -- window.jedo.JedoGantt.prototype.changeFnScale  --");
};



}//if(!window.jedo.hasOwnProperty("JedoGantt")) {

