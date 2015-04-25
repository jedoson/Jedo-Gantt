/**
 * @author jedoson
 */
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
/**
 * @author jedoson
 */
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

window.jedo = window.jedo || {};
window.jedo.YEAR = 1;    // Year
window.jedo.QUARTER = 2; // 분기
window.jedo.MONTH = 3;   // 월
window.jedo.WEEK = 4;    // 주
window.jedo.DATE = 5;    // 일
window.jedo.HOUR = 6;    // 시간
window.jedo.MIN = 7;     // 분
window.jedo.SEC = 8;     // 초
window.jedo.MIL = 9;     // 밀리초
window.jedo.DATE_SCALE_TYPE_START = 1;
window.jedo.DATE_SCALE_TYPE_END = 2;
window.jedo.getQuarter = function(oDate) {
	
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
window.jedo.getWeekNo = function(oDate) {
	console.log("s -- window.jedo.getWeekNo -- ");
	
	if(!(oDate instanceof Date)) {
		throw new TypeError("Param oDate is Bad");
	}
	try {
		var nWeekNo = 1;
		var iYear = oDate.getFullYear();
		var oTDate = new Date();
		oTDate.setTime(oDate.getTime());
		oTDate.setMonth(0);
		oTDate.setDate(1);
		oTDate.setHours(0,0,0,1);
		//console.debug("window.jedo.getFomattedDate:"+window.jedo.getFomattedDate(oTDate));
		while(oTDate.getTime() < oDate.getTime()) {
			
			nWeekNo++;
			
			oTDate.setDate(oTDate.getDate()+7);
		}
		return nWeekNo;
	} finally {
		console.log("e -- window.jedo.getWeekNo -- ");
	}
};
window.jedo.getFomattedDate = function(oDate, sFormat) {
	if(sFormat == null || sFormat == undefined || sFormat == "YYYYMMDD") {
		var sM = "";
		var iM = oDate.getMonth() + 1;
		if(iM < 9) {
			sM = "0"+iM;
		} else {
			sM = ""+iM;
		}
		var sS = "";
		var iS = oDate.getDate();
		if(iS < 10) {
			sS = "0"+iS;
		} else {
			sS = ""+iS;
		}
		return oDate.getFullYear()+sM+sS;
	}
	return oDate.getFullYear()+"."+oDate.getMonth()+"."+oDate.getDate();
};
window.jedo.getFnScale = function(oSDate, oEDate, nSpx, nEpx) {
	var nSTime = oSDate.getTime();
	var nETime = oEDate.getTime();
	var nTime = nETime - nSTime;
	var nPx = nEpx - nSpx;
	var x = d3.scale.linear()
					.domain([nSTime, nETime])
					.range([nSpx, nEpx]);
	return function (oDate, pDateScaleType){
		return x(oDate.getTime());
//		if(nTime < nPx) {
//			if(pDateScaleType === window.jedo.DATE_SCALE_TYPE_START) {
//				return x(oDate.getTime())+1;
//			} else {
//				return x(oDate.getTime());
//			}
//		} else {
//			return x(oDate.getTime());
//		}
	};
};
window.jedo.getSVGCursorPoint = function(svg, event) {
	var pt = svg.node().createSVGPoint();
	pt.x = event.clientX; 
	pt.y = event.clientY;
    var a = svg.node().getScreenCTM();
    //console.debug("offset based on svg"+ " x:" + a.e +" y:" + a.f);
    var b = a.inverse();
    return pt.matrixTransform(b);
};
window.jedo.getParentMarkPoints = function(iX, iY, iW, iH) {
	var mH = (iH/5)*3;
	return [ { "x": iX-10,  "y": iY},  
             { "x": iX+10,  "y": iY},
             { "x": iX+10,  "y": iY+mH}, 
             { "x": iX,  	"y": iY+iH},
             { "x": iX-10,  "y": iY+mH}
           ];
};
window.jedo.JedoGantt = function () {
	
	
	var options = null;
	this.setOptions = function(o) {
		options = o;
	};
	this.getOptions = function() {
		return options;
	};
	
	var iHeaderDateViewMode = window.jedo.DATE;
	this.setHeaderDateViewMode = function(nHeaderDateViewMode) {
		iHeaderDateViewMode = nHeaderDateViewMode;
	};
	this.getHeaderDateViewMode = function() {
		return iHeaderDateViewMode;
	};
	
	
	var oSVG = null;
	this.setSVG = function(svg) {
		oSVG = svg;
	};
	this.getSVG = function() {
		return oSVG;
	};
	
	var oSVGGanttHeader = null;
	this.setSVGGanttHeader = function(svgHeader) {
		oSVGGanttHeader = svgHeader;
	};
	this.getSVGGanttHeader = function() {
		return oSVGGanttHeader;
	};
		
	var ganttTableId = "";
	this.setGanttTableId = function(sGanttTableId) {
		ganttTableId = sGanttTableId;
	};
	this.getGanttTableId = function() {
		return ganttTableId;
	};
	
	
	var ganttHeaderId = "";
	this.setGanttHeaderId = function(sGanttHeaderId) {
		ganttHeaderId = sGanttHeaderId;
	};
	this.getGanttHeaderId = function() {
		return ganttHeaderId;
	};
	
	var ganttBodyId = "";
	this.setGanttBodyId = function(sGanttBodyId) {
		ganttBodyId = sGanttBodyId;
	};
	this.getGanttBodyId = function() {
		return ganttBodyId;
	};
	
	
	var aSVGHeaderLine = [];
	this.addSVGHeaderLine = function(gLine) {
		aSVGHeaderLine.push(gLine);
	};
	this.getSVGHeaderLine = function(idx) {
		return aSVGHeaderLine[idx];
	};

	
	
	var ganttDate = {};
	this.setGanttDateX = function(sGanttDate, iLeft) {
		ganttDate[sGanttDate] = iLeft;
	};
	this.getGanttDateX = function(sGanttDate) {
		return ganttDate[sGanttDate];
	};
	
	var arrFnPrevScale = [];
	this.addFnPrevScale = function(fScale) {
		arrFnPrevScale[arrFnPrevScale.length] = fScale;
	};
	this.getFnPrevScale = function() {
		if(0 < arrFnPrevScale.length) {
			return arrFnPrevScale[arrFnPrevScale.length-1];
		} else {
			return null;
		}
	};
	
	var fnScale = null;
	this.setFnScale = function(fScale) {
		fnScale = fScale;
	};
	this.getFnScale = function() {
		return fnScale;
	};
	
	
	var oCapturedGanttBar = null;
	this.setCapturedGanttBar = function(o) {
		oCapturedGanttBar = o;
	};
	this.getCapturedGanttBar = function() {
		return oCapturedGanttBar;
	};
};
window.jedo.JedoGantt.prototype.isInChildGantt = function(id) {
	var o = null;
	var i = 0;
	var options = this.getOptions();
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
	console.log("s -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
	var fnScale = this.getFnScale();
	var options = this.getOptions();
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = fnScale(oDate);
	
	oDate.setHours(23,59,59,999);
	var iWidth = fnScale(oDate) - iSPos;
	//console.debug("One Date["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.setHeaderDateViewMode(window.jedo.DATE);
		return;
	}
	
	
	oDate.setDate(7);
	iWidth = fnScale(oDate) - iSPos;
	//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.setHeaderDateViewMode(window.jedo.WEEK);
		return;
	}
	
	
	oDate.setMonth(oDate.getMonth()+1);
	oDate.setDate(0);
	iWidth = fnScale(oDate) - iSPos;
	//console.debug("One Month["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.setHeaderDateViewMode(window.jedo.MONTH);
		return;
	}
	
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(3);
	oDate.setDate(0);
	iWidth = fnScale(oDate) - iSPos;
	//console.debug("One Quarter["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.setHeaderDateViewMode(window.jedo.QUARTER);
		return;
	}
	
	oDate.setMonth(12, 0);
	iWidth = fnScale(oDate) - iSPos;
	//console.debug("One Year["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		this.setHeaderDateViewMode(window.jedo.YEAR);
		return;
	}
	console.log("e -- window.jedo.JedoGantt.prototype.initHeaderDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.changeHeaderDateViewMode = function(nHeaderDateViewMode) {
	console.log("s -- window.jedo.JedoGantt.prototype.changeHeaderDateViewMode -- ");
	
	var fnScale = this.getFnScale();
	var options = this.getOptions();
	
	var svg = this.getSVG();
	var xWidth = svg.attr('width');
	var xHeight = svg.attr('height');
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_START);
	
	var iWidth = 0;
	var nWidth = xWidth;
	
	switch (nHeaderDateViewMode) {
		case window.jedo.YEAR :    // Year
	    	oDate.setMonth(12);
	    	oDate.setDate(0);
	    	oDate.setHours(23,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One YEAR["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change YEAR["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.YEAR);
			break;
		case window.jedo.QUARTER : // 분기
			var nQuarter = window.jedo.getQuarter(oDate);
	    	var nMonth = nQuarter*3;
	    	oDate.setMonth(nMonth);
	    	oDate.setDate(0);
	    	oDate.setHours(23,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One QUARTER["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change QUARTER["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.MONTH);
			break;
		case window.jedo.MONTH :   // 월
			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			oDate.setHours(23,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MONTH["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change MONTH["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.MONTH);
			break;
		case window.jedo.WEEK :    // 주
			oDate.setDate(7);
			oDate.setHours(23,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change Week["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.WEEK);
			break;
		case window.jedo.DATE :    // 일
			oDate.setDate(oDate.getDate()+1);
			oDate.setHours(23,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One DATE["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change DATE["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.DATE);
			break;
		case window.jedo.HOUR :    // 시간
			console.debug("window.jedo.HOUR -- DATE["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours());
			oDate.setHours(oDate.getHours()+1,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			console.debug("One HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" Width:"+iWidth);
			iWidth = iWidth == 0 ? 1 : iWidth;
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				console.debug("change HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.HOUR);
			break;
		case window.jedo.MIN :     // 분
			oDate.setMinutes(oDate.getMinutes()+1,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIN["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change MIN["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.MIN);
			break;
		case window.jedo.SEC :     // 초
			oDate.setSeconds(oDate.getSeconds()+1,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One SEC["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change SEC["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.SEC);
			break;
		case window.jedo.MIL :     // 밀리초
			oDate.setMilliseconds(oDate.getMilliseconds()+1);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIL["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change MIL["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			this.setHeaderDateViewMode(window.jedo.MIL);
			break;
		default :
			throw new TypeError("Param nHeaderDateViewMode["+nHeaderDateViewMode+"] is Bad");
	}
	this.addFnPrevScale(fnScale);
	//nWidth = nWidth + options.unitWidth;
	var newFnScale = window.jedo.getFnScale(options.startGanttDate, options.endGanttDate, 0, nWidth);
	this.setFnScale(newFnScale);
	
	svg.attr("width", nWidth);
	console.log("e -- window.jedo.JedoGantt.prototype.changeHeaderDateViewMode -- ");
};
window.jedo.JedoGantt.prototype.createGanttHeader = function(oGanttContainer) {
	console.log("s -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
	
	var iLeft = 0;
    var iLineCount = 0;
    var iCount = 0;
    var iWidth = 0;
    var iHeadLine = 0;
    var options = this.getOptions();
    

    
    
	this.setGanttHeaderId(oGanttContainer.attr("id")+"_ganttHeader");
	
	var svg = this.getSVG();
	var nSvgWidth = svg.attr("width");
	var nSvgHeaderHeight = options.header.lineHeight*options.header.viewLineCount;
	
    var gradient = svg.append("defs")
				    .append("linearGradient")
				      .attr("id", "headerGradient")
				      .attr("x1", "0%")
				      .attr("y1", "0%")
				      .attr("x2", "0%")
				      .attr("y2", "100%")
				      .attr("spreadMethod", "pad");

  gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#F5F5F5")
      .attr("stop-opacity", 1);

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#DCDCDC")
      .attr("stop-opacity", 1);
	
  
  var ganttHeader = svg.append('g').attr('class', 'ganttHeader');
  
	
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
    	0 < (this.getHeaderDateViewMode()-headerViewLineCount) ) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.YEAR);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.quarterLine &&
    	0 < (this.getHeaderDateViewMode()-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.QUARTER);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.monthLine &&
    	0 < (this.getHeaderDateViewMode()-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.MONTH);
    }	
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.weekLine &&
    	0 < (this.getHeaderDateViewMode()-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.WEEK);
    }
    
    if(headerViewLineCount < options.header.viewLineCount && 
    	options.header.dateLine &&
    	0 < (this.getHeaderDateViewMode()-headerViewLineCount)) {
    	
    	this.setHeaderLineMode(headerViewLineCount++, window.jedo.DATE);
    }
    console.log("e -- window.jedo.JedoGantt.prototype.createGanttHeader -- ");
};

window.jedo.JedoGantt.prototype.createGanttBody = function(oGanttContainer) {
	console.log("s -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
	
	this.setGanttBodyId(oGanttContainer.attr("id")+"_ganttBody");
	
	var svg = this.getSVG();
	var options = this.getOptions();
	var nSvgWidth = svg.attr('width');
	var nSvgHeight = svg.attr('height');
	var nSvgHeaderHeight = options.header.lineHeight*options.header.viewLineCount;
	var nSvgBodyHeight = options.lineHeight*options.ganttData.length;
	
	var rect = svg.selectAll('rect.ganttBodyBg')
		.data([0])
		.enter()
		.append('rect')
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
	
	console.log("e -- window.jedo.JedoGantt.prototype.createGanttBody -- ");
};
window.jedo.JedoGantt.prototype.setBodyGanttBar = function() {
	console.log("s -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");

	var svg = this.getSVG();
	var options = this.getOptions();
	var nSvgWidth = svg.attr('width');
	var iHeadLineCount = options.header.viewLineCount;
	var nSvgHeaderHeight = options.header.lineHeight*iHeadLineCount;
	
	
	var nSvgHeight = nSvgHeaderHeight + (options.ganttData.length * options.lineHeight);
	svg.attr("height",nSvgHeight);
	
	var fnScale = this.getFnScale();
	var fnPrevScale = this.getFnPrevScale();
	
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
	$(options.ganttData).each(function(index){
		//console.log("ganttData.index:"+index);
		
		var sID = $(this).attr("id");
		var sDate = $(this).attr("startDate");
		var eDate = $(this).attr("endDate");
		
		iLine = options.unitSpace + (index * options.lineHeight);
		
		sDate.setHours(0,0,0,0);
		if(fnPrevScale) {
			iSPos = fnPrevScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
			iToSPos = fnScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
		} else {
			iSPos = fnScale(sDate, window.jedo.DATE_SCALE_TYPE_START);
		}
		
		eDate.setHours(23,59,59,999);
		if(fnPrevScale) {
			iEPos = fnPrevScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
			iToEPos = fnScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
		} else {
			iEPos = fnScale(eDate, window.jedo.DATE_SCALE_TYPE_END);
		}

		if(fnPrevScale) {
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
			lineY : nSvgHeaderHeight+(options.lineHeight*index),
			isParent : oJedoGantt.isInChildGantt(sID),
			style : {
				fill: '#0000cd', 
				stroke: '#ff69b4', 
				strokeWidth: 0
			}
		}
	});
	


	var iX = fnScale(options.endGanttDate, window.jedo.DATE_SCALE_TYPE_END);
	if(fnPrevScale) {
		svg.selectAll('rect.ganttBodyLine').attr('width', iX);
	} else {
		svg.selectAll('rect.ganttBodyLine')
			.data(arr)
			.enter()
			.append('rect')
			.attr('class', 'ganttBodyLine')
			.attr('x', 0)
			.attr('y', function(d){ return d.lineY; })
			.attr('width', iX)
			.attr('height', function(d){ return d.lineHeight; })
			.style('fill', function(d, i){ return i%2 ? '#FFFFF0' : '#F0FFF0'; });
	}

	
	if(fnPrevScale) {
		arr.forEach(function(o,i){
			svg.selectAll("#rectGanttBar_"+o.id+", #startMarkGanttBar_"+o.id+", #endMarkGanttBar_"+o.id)
				.transition().duration(1000)
				.attr('x',function(d){
					if(d3.select(this).attr("id") == "rectGanttBar_"+o.id) {
						return o.x2;
					} else {
						return null;
					}})
				.attr('width',function(d){
					if(d3.select(this).attr("id") == "rectGanttBar_"+o.id) {
						return o.w2;
					} else {
						return null;
					}})
				.attr('points',function(d){
					var oThis = d3.select(this);
					if(oThis.attr("id") == "startMarkGanttBar_"+o.id) {
						
						var polyData = window.jedo.getParentMarkPoints(o.x2, o.y1, o.w2, o.h1);
						return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
					} else if(oThis.attr("id") == "endMarkGanttBar_"+o.id) {
						
						var polyData = window.jedo.getParentMarkPoints(o.x2+o.w2, o.y1, o.w2, o.h1);
						return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
					} 
					return null;
				});
		});
		
	} else {
		var aGanttBodyBar = svg.selectAll('g.ganttBar')
							.data(arr)
							.enter()
							.append('g')
							.attr('class', 'ganttBar')
							.attr('id', function(d){ return "gGanttBar_"+d.id});
		
		aGanttBodyBar.append("rect").attr('class', 'ganttBodyBar')
							.attr('id', function(d){ return "rectGanttBar_"+d.id})
							.attr('x', function(d){ return d.x1; })
							.attr('y', function(d){ return d.y1; })
							.attr('width', function(d){ return d.w1; })
							.attr('height', function(d){ 
								if(d.isParent) {
									return (d.h1/3)*2;
								} else {
									return d.h1;
								}
							}).style({
								'fill': '#0000cd', 
								'stroke': '#ff69b4', 
								'stroke-width': 0
							});

		aGanttBodyBar.each(function(d,i){
			console.log("d.id:"+d.id+" d.isParent:"+d.isParent);
			if(d.isParent) {
				// start Group Mark.
				var polyData = window.jedo.getParentMarkPoints(d.x1, d.y1, d.w1, d.h1);
				svg.select("#gGanttBar_"+d.id).append("polygon")
						.attr("id", "startMarkGanttBar_"+d.id)
						.attr("class", "startMarkGanttBar")
				    	.attr("points",function(d) { 
				    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
				    	})
						.attr("stroke", "red")
						.attr("stroke-width", 1)
						.attr("fill", "yellow");
				
				// end group Mark.
				polyData = window.jedo.getParentMarkPoints(d.x1+d.w1, d.y1, d.w1, d.h1);
				svg.select("#gGanttBar_"+d.id).append("polygon")
						.attr("id", "endMarkGanttBar_"+d.id)
						.attr("class", "endMarkGanttBar")
				    	.attr("points",function(d) { 
				    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
				    	})
						.attr("stroke", "red")
						.attr("stroke-width", 1)
						.attr("fill", "yellow");
			}
		});

		aGanttBodyBar.selectAll(".ganttBodyBar").each(function(){
			this.addEventListener("mouseover", oJedoGantt.mouseOverBar.bind(oJedoGantt), false);
			this.addEventListener("mouseout",  oJedoGantt.mouseOutBar.bind(oJedoGantt),  false);
			this.addEventListener("mousedown", oJedoGantt.mouseDownBar.bind(oJedoGantt), false);
		});
	}
	
	
	console.log("e -- window.jedo.JedoGantt.prototype.setBodyGanttBar  --");
};
window.jedo.JedoGantt.prototype.mouseOverBar = function(event) {
	console.log("s -- window.jedo.JedoGantt.prototype.mouseOverBar  --");

	console.log("e -- window.jedo.JedoGantt.prototype.mouseOverBar  --");
};
window.jedo.JedoGantt.prototype.mouseOutBar = function(event) {
	console.log("s -- window.jedo.JedoGantt.prototype.mouseOutBar  --");

	console.log("e -- window.jedo.JedoGantt.prototype.mouseOutBar  --");
};
window.jedo.JedoGantt.prototype.mouseDownBar = function(event) {
	console.log("s -- window.jedo.JedoGantt.prototype.mouseDownBar  --");
	console.log("event.type:"+event.type+" clientX:"+event.clientX+" clientY:"+event.clientY+" y:"+event.y);
	
	var svg = this.getSVG();
	var oCapturedGanttBar = this.getCapturedGanttBar();
	if(oCapturedGanttBar) {
		d3.select(oCapturedGanttBar).style({'stroke-width':0});
	}
	var id = d3.select(event.target).attr("id");
	console.debug("event.target.getAttribute('id'):"+id);
	this.setCapturedGanttBar(event.target);
	d3.select(event.target).style({'stroke-width':2});
	
	console.log("e -- window.jedo.JedoGantt.prototype.mouseDownBar  --");
};
window.jedo.JedoGantt.prototype.mouseUpBar = function(event) {
	console.log("s -- window.jedo.JedoGantt.prototype.mouseUpBar  --");
	var oCapturedGanttBar = this.getCapturedGanttBar();
	if(oCapturedGanttBar) {
		d3.select(oCapturedGanttBar).style({'stroke-width':0});
		this.setCapturedGanttBar(null);
	}
	console.log("e -- window.jedo.JedoGantt.prototype.mouseUpBar  --");
};
window.jedo.JedoGantt.prototype.mouseMoveBar = function(event) {
	//console.log("s -- window.jedo.JedoGantt.prototype.mouseMoveBar  --");
	//console.log("event.type:"+event.type+" clientX:"+event.clientX+" clientY:"+event.clientY+" y:"+event.y);

    var oCapturedGanttBar = this.getCapturedGanttBar();
	if(oCapturedGanttBar) {
		var svg = this.getSVG();
		var options = this.getOptions();
		var svgPoint	= window.jedo.getSVGCursorPoint(svg, event);
	    //console.debug("svg mouse at"+ " x:" + svgPoint.x +" y:" +svgPoint.y);
	    
		var o = d3.select(oCapturedGanttBar);
		
		var x = o.attr("x");
		var w = o.attr("width");
		var w1 = parseInt(event.clientX) - x;
		w1 = w1 < options.unitSpace ? options.unitSpace : w1;
		o.attr("width", w1);
	}
	//console.log("e -- window.jedo.JedoGantt.prototype.mouseMoveBar  --");
};
window.jedo.JedoGantt.prototype.setHeaderLineMode = function(indexLine, lineMode) {
	console.log("s -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
	console.log("indexLine:"+indexLine);
	console.log("lineMode:"+lineMode);
	
	var svg = this.getSVG();
	var options = this.getOptions();
	var sLineId = "Headerline"+indexLine;
	
	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setHours(0,0,0,1);
	
	var nSvgWidth = svg.attr("width");
	
	var fnScale = this.getFnScale();
	var fnPrevScale = this.getFnPrevScale();
	
	var iWidth = 0;
	var iToWidth = 0;
	var iEnd = 0;
	var iToEnd = 0;
	var iLeft = options.unitSpace;
	var iToLeft = options.unitSpace;
	var iPrevYear = oDate.getFullYear();
	var iPrevDate = oDate.getDate();
	var iWeekNo = window.jedo.getWeekNo(oDate);
	var iPrevWeekNo = iWeekNo;
	var nQuarter = 0;
	var sDateText = "";
	var sClassName = "headRectLine"+indexLine;
	var sTextClassName = "headTextLine"+indexLine;
	
	var format = null;
	if(lineMode === window.jedo.YEAR) {
		format = d3.time.format("%Y년");
	} else if(lineMode === window.jedo.QUARTER) {
		format = d3.time.format("%Y년");
	} else if(lineMode === window.jedo.MONTH) {
		if(1 < indexLine) {
			format = d3.time.format("%m월");
		} else {
			format = d3.time.format("%Y년 %m월");
		}
	} else if(lineMode === window.jedo.WEEK) {
		if(1 < indexLine) {
			format = d3.time.format("%U주");
		} else {
			format = d3.time.format("%Y년 %U주");
		}
	} else if(lineMode === window.jedo.DATE) {
		format = d3.time.format("%d일");
	} else if(lineMode === window.jedo.HOUR) {
		format = d3.time.format("%H시");
	}
	
	if(fnPrevScale) {
		iLeft = fnPrevScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
		iToLeft = fnScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
	} else {
		iLeft = fnScale(options.startGanttDate, window.jedo.DATE_SCALE_TYPE_START);
	}

	var arr = [];
	var y = options.unitSpace+(options.header.lineHeight*indexLine);
	
	var nGanttEndTime = options.endGanttDate.getTime();
	while(oDate.getTime() <= nGanttEndTime) {
//		console.debug("s oDate:"+new Intl.DateTimeFormat('ko-KR').format(oDate));
//		console.debug("s oDate HH:"+oDate.getHours());
//		console.debug("s oDate MM:"+oDate.getMinutes());
//		console.debug("s oDate SS:"+oDate.getSeconds());
//		console.debug("s oDate MI:"+oDate.getMilliseconds());
		
		iLeft = iEnd+1;
		if(fnPrevScale) {
			iToLeft = iToEnd+1;
		}
    	
//		console.debug("iY:"+y);
//    	console.debug("iLeft:"+iLeft);
    	
    	if(lineMode === window.jedo.YEAR) {
    		oDate.setMonth(12);
    		oDate.setDate(0);
    		oDate.setHours(23);
    		oDate.setMinutes(59,59,999);
    	} else if(lineMode === window.jedo.QUARTER) {
    		nQuarter = window.jedo.getQuarter(oDate);
    		oDate.setMonth(nQuarter*3);
    		oDate.setDate(0);
    		oDate.setHours(23,59,59,999);
    	} else if(lineMode === window.jedo.MONTH) {
    		oDate.setMonth(oDate.getMonth()+1);
    		oDate.setDate(0);
    		oDate.setHours(23,59,59,999);
    	} else if(lineMode === window.jedo.WEEK) {
    		var nWeekDay = oDate.getDay();
        	if(nWeekDay != options.startWeekDay) {
        		oDate.setDate(oDate.getDate()+((7-nWeekDay)+options.startWeekDay));
        	} else {
        		oDate.setDate(oDate.getDate()+6);
        	}
        	oDate.setHours(23,59,59,999);
    	} else if(lineMode === window.jedo.DATE) {
    		oDate.setHours(23,59,59,999);
    	} else if(lineMode === window.jedo.HOUR) {
    		//oDate.setHours(oDate.getHours()+1);
    		oDate.setMinutes(59,59,999);
    	}
    	
    	
    	if(nGanttEndTime < oDate.getTime()) {
    		oDate.setTime(nGanttEndTime);
    		oDate.setHours(23,59,59,999);
    	}
    	
//  	console.debug("s oDate:"+new Intl.DateTimeFormat('ko-KR').format(oDate));
//    	console.debug("s oDate HH:"+oDate.getHours());
//		console.debug("s oDate MM:"+oDate.getMinutes());
//		console.debug("s oDate SS:"+oDate.getSeconds());
//		console.debug("s oDate MI:"+oDate.getMilliseconds());
    	
    	if(fnPrevScale) {
    		iEnd = fnPrevScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
    		iToEnd = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
		} else {
			iEnd = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END);
		}
    	
//    	console.debug("iEnd:"+iEnd);
    	iWidth = iEnd - iLeft;
    	if(fnPrevScale) {
    		iWidth = iEnd - iLeft;
    		iToWidth = iToEnd - iToLeft;
    	}
		
//		console.debug("iWidth:"+iWidth);
//		var format = d3.time.format.multi([
//           [".%L", function(d) { return d.getMilliseconds(); }],
//           [":%S", function(d) { return d.getSeconds(); }],
//           ["%I:%M", function(d) { return d.getMinutes(); }],
//           ["%I %p", function(d) { return d.getHours(); }],
//           ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
//           ["%b %d", function(d) { return d.getDate() != 1; }],
//           ["%B", function(d) { return d.getMonth(); }],
//           ["%Y", function() { return true; }]
//         ]);
		var sItemId = sLineId;
		if(lineMode === window.jedo.YEAR) {
			sItemId = sLineId+"_"+oDate.getFullYear();
			sDateText = format(oDate);
			
    	} else if(lineMode === window.jedo.QUARTER) {
    		sDateText = format(oDate)+" "+nQuarter+"분기";
    		sItemId = sLineId+"_"+oDate.getFullYear()+"_"+nQuarter;
    	} else if(lineMode === window.jedo.MONTH) {
    		sDateText = format(oDate);
    		sItemId = sLineId+"_"+oDate.getFullYear()+"_"+oDate.getMonth();
    	} else if(lineMode === window.jedo.WEEK) {
    		sDateText = format(oDate);
    		sItemId = sLineId+"_"+oDate.getFullYear()+"_"+iWeekNo;
    	} else if(lineMode === window.jedo.DATE) {
    		sDateText = format(oDate);
    		sItemId = sLineId+"_"+oDate.getFullYear()+"_"+oDate.getDate();
    	} else if(lineMode === window.jedo.HOUR) {
    		sDateText = format(oDate);
    		sItemId = sLineId+"_"+window.jedo.getFomattedDate(oDate)+"_"+oDate.getHours();
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
		
		if(	lineMode === window.jedo.YEAR 		|| 
			lineMode === window.jedo.QUARTER 	|| 
			lineMode === window.jedo.MONTH 		|| 
			lineMode === window.jedo.DATE		) {
			
			oDate.setDate(oDate.getDate()+1);
	        oDate.setHours(0,0,0,1);
	        
    	} else if(lineMode === window.jedo.WEEK) {
    		
    		oDate.setDate(oDate.getDate()+1);
	        oDate.setHours(0,0,0,1);
    		
	        if(iPrevYear == oDate.getFullYear()) {
	        	iWeekNo++;
	        } else {
	        	iWeekNo = 1;
	        	iPrevYear = oDate.getFullYear();
	        }
    		
    		
    	} else if(lineMode === window.jedo.HOUR) {
    		
    		oDate.setHours(oDate.getHours()+1,0,0,1);
    		if(iPrevDate !== oDate.getDate()) {
				
				iPrevDate = oDate.getDate();
			}
    	} else {
    		throw Error("lineMode is bad");
    	}
    }
	
	svg.selectAll('rect.rectheaderLine'+indexLine).remove();
	svg.selectAll('text.textheaderLine'+indexLine).remove();
	
	if(fnPrevScale) {
		var rect = svg.select("g.ganttHeader").selectAll('rect.rectheaderLine'+indexLine)
			.data(arr)
			.enter()
			.append('rect')
			.attr('class', 'rectheaderLine'+indexLine)
			.attr('x', function(d){ return d.x; })
			.attr('y', function(d){ return d.y; })
			.attr('width', function(d){ return d.width; })
			.attr('height', function(d){ return d.height; })
			.style({
				'fill' : 'url(#headerGradient)', 
				'stroke' : 'navy', 
				'stroke-width' : 0
			}).transition().duration(1000)
			.attr('x',function(d){return d.x2;})
			.attr('width',function(d){return d.w2;});
		
		var changeFormat = null;
		var checkText = false;
		var text = svg.select("g.ganttHeader").selectAll('text.textheaderLine'+indexLine)
			.data(arr)
			.enter()
			.append('text')
			.attr('class','textheaderLine'+indexLine)
			.text(function(d){
				return d.title; 
			}).attr('x', function(d){ 
				return d.x;
			}).attr('y', function(d){ 
				return d.y + (d.height - (d.height/3));
			}).attr('width', function(d){ 
				return d.width; 
			}).attr('height', function(d){ 
				return d.height; 
			}).style({
				'fill' : 'red',
				'font-family' : "Verdana",
				'font-size' : options.header.fontSize
			}).transition().duration(1000)
			.attr('x',function(d){
				var bbox = this.getBBox();
				var t = (d.w2-bbox.width)/2;
				return d.x2+t;
			}).attr('y', function(d){ 
				var bbox = this.getBBox();
				return d.y2 + bbox.height + ((d.height-bbox.height)/3); 
			}).attr('width',function(d){return d.w2;});
		
		
	} else {
		svg.select("g.ganttHeader").selectAll('rect.rectheaderLine'+indexLine)
			.data(arr)
			.enter()
			.append('rect')
			.attr('class', 'rectheaderLine'+indexLine)
			.attr('x', function(d){ return d.x; 
			}).attr('y', function(d){ return d.y; 
			}).attr('width', function(d){ return d.width; 
			}).attr('height', function(d){ return d.height; 
			}).style({
				fill : 'url(#headerGradient)', 
				stroke : 'navy', 
				'stroke-width' : 0
			});
	
		svg.select("g.ganttHeader").selectAll('text.textheaderLine'+indexLine)
			.data(arr)
			.enter()
			.append('text')
			.attr('class','textheaderLine'+indexLine)
			.text(function(d){ return d.title; })
			.attr('x', function(d){ 
				var bbox = this.getBBox();
				//console.log(bbox);
				var t = (d.width-bbox.width)/2;
				return d.x+t; 
			}).attr('y', function(d){ 
				var bbox = this.getBBox();
				//console.log(bbox);
				//console.log("d.y:"+d.y);
				//console.log("d.height:"+d.height);
				return d.y + bbox.height + ((d.height-bbox.height)/3); 
			}).attr('width', function(d){ return d.width; })
			.attr('height', function(d){ return d.height; })
			.style({
				'fill': 'red',
				'font-family' : "Verdana",
				'font-size' : options.header.fontSize
			});
	}
	if(indexLine+1 === options.header.viewLineCount) {
		var oJedoGant = this;
		svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
			.each(function(){
				this.addEventListener("mouseup", oJedoGant.changeFnScale.bind(oJedoGant),false);
			});
	}
	console.log("e -- window.jedo.JedoGantt.prototype.setHeaderLineMode  --");
};
window.jedo.JedoGantt.prototype.changeFnScale = function(event) {
	console.log("s -- window.jedo.JedoGantt.prototype.changeFnScale  --");
	
	var nHeaderDateViewMode = this.getHeaderDateViewMode();
	if(window.jedo.HOUR < (nHeaderDateViewMode+1)) {
		console.debug("nHeaderDateViewMode["+nHeaderDateViewMode+"] is bad");
		return;
	}
	console.debug("nHeaderDateViewMode:"+(++nHeaderDateViewMode));
	
	
	this.changeHeaderDateViewMode(nHeaderDateViewMode);
	
	var svg = this.getSVG();
	var fnScale = this.getFnScale();
	var nSvgWidth = svg.attr("width");
	svg.select('rect.ganttHeaderBg').attr('width', nSvgWidth);
	svg.select('rect.ganttBodyBg').attr('width', nSvgWidth);

	var options = this.getOptions();
	var i = 0;
	var n = options.header.viewLineCount;
    for(i=0; i<n; i++) {
    	var nLineMode = nHeaderDateViewMode-(n-(i+1));
    	this.setHeaderLineMode(i, nLineMode);
    }
    this.setBodyGanttBar();
    
    
    
    
	console.log("e -- window.jedo.JedoGantt.prototype.changeFnScale  --");
};
(function($){
	$.fn.myGantt = function(options) {
		
		var oJedoGantt = new window.jedo.JedoGantt();
		
		var startGanttDate = new Date();
		var endGanttDate = new Date();
		endGanttDate.setDate(startGanttDate.getDate()+100);
		
		var defaults = {
			
			// 뷰모드 UnitDate, FitSize 
			viewMode : "FitSize",
			
			// 수정금지.
			editMode : true,
			
			
			startGanttDate : startGanttDate,
	        endGanttDate   : endGanttDate,
	        
	        // 시작주요일 : 0(일요일), 1(월요일), 
	        startWeekDay : 1,
	        
	        lineHeight : 50,
	        unitWidth : 100,
	        unitSpace : 1,
	        
	        header : {
	        	lineHeight      : 30,
	        	yearLine    	: true,
	        	quarterLine 	: true,
	        	monthLine   	: true,
	        	weekLine    	: true,
	        	dateLine    	: true,
	        	hourLine    	: false,
	        	minLine			: false,
	        	secLine			: false,
	        	milLine			: false,
	        	viewLineCount	: 3,
	        	
	        	fontSize : 13
	        },
	        
	        body : {
	        	
	        	barSpace : 5,
	        	oddLineBackground : '#f0ffff',
	        	addLineBackground : '#fffff0'
	        		
	        },
	        
	        ganttDataGridView : false,
	        ganttBodyWeekView : true,
	       
	        
	       
			// 최소 라인 높이.	       
	        minUnitHeight : 30,
	        // 최소 폭.
	        minUnitWidth : 100
		};
		
		var options = $.extend({},defaults,options);
		oJedoGantt.setOptions(options);
		
		
		var oGanttContainer = $(this);
		oGanttContainer.addClass("ganttContainer");
		//oGanttContainer.width(document.documentElement.clientWidth - 8);
		//oGanttContainer.height(document.documentElement.clientHeight - 8);
		
		console.log("document.body.clientWidth:"+document.body.clientWidth);
		console.log("document.body.clientHeight:"+document.body.clientHeight);
		console.log("document.body.offsetWidth:"+document.body.offsetWidth);
		console.log("document.body.offsetHeight:"+document.body.offsetHeight);
		console.log("document.documentElement.clientWidth:"+document.documentElement.clientWidth);
		console.log("document.documentElement.clientHeight:"+document.documentElement.clientHeight);
		console.log("document.documentElement.offsetWidth:"+document.documentElement.offsetWidth);
		console.log("document.documentElement.offsetHeight:"+document.documentElement.offsetHeight);
		console.log("oGanttContainer.width():"+oGanttContainer.width());
		console.log("this.id:"+oGanttContainer.attr("id"));
		
		var nWidth = oGanttContainer.width()-20;
		
		//$("#"+oGanttContainer.attr("id")).svg();
		var svg = d3.select("#"+oGanttContainer.attr("id")).append("svg")
					.attr("width", nWidth)
					.attr("height", (options.ganttData.length+options.header.viewLineCount)*options.lineHeight);
		oJedoGantt.setSVG(svg);
		
		var fnScale = window.jedo.getFnScale(options.startGanttDate, options.endGanttDate, 0, nWidth);
		oJedoGantt.setFnScale(fnScale);
		oJedoGantt.initHeaderDateViewMode();
		oJedoGantt.createGanttBody(oGanttContainer);
		oGanttContainer.on("scroll", function(event){
			console.log("event.id:"+$(this).attr("id"));
			console.log("scrollTop:"+$(this).scrollTop());
			svg.select('g.ganttHeader').attr('transform', 'translate(0,'+$(this).scrollTop()+')');
		});
		oJedoGantt.createGanttHeader(oGanttContainer);
		svg.node().addEventListener("mousemove",oJedoGantt.mouseMoveBar.bind(oJedoGantt),false);
		svg.node().addEventListener("mouseup",  oJedoGantt.mouseUpBar.bind(oJedoGantt),  false);
	};
})(jQuery);




