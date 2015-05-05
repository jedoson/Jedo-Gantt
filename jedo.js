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
if(!window.hasOwnProperty("jedo")) {

window.jedo = {};
Object.defineProperty(window, "jedo", {
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "YEAR", {
	get: function() {
		return 1;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "QUARTER", {
	get: function() {
		return 2;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "MONTH", {
	get: function() {
		return 3;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "WEEK", {
	get: function() {
		return 4;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "DATE", {
	get: function() {
		return 5;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "HOUR", {
	get: function() {
		return 6;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "MIN", {
	get: function() {
		return 7;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "SEC", {
	get: function() {
		return 8;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "MIL", {
	get: function() {
		return 8;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "DATE_SCALE_TYPE_START", {
	get: function() {
		return 21;
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(window.jedo, "DATE_SCALE_TYPE_END", {
	get: function() {
		return 22;
	},
	enumerable: false,
	configurable: false
});
window.jedo.getViewModeString = function(nViewMode) {
	if(nViewMode === window.jedo.YEAR)		return "window.jedo.YEAR";
	if(nViewMode === window.jedo.QUARTER)	return "window.jedo.QUARTER";
	if(nViewMode === window.jedo.MONTH)		return "window.jedo.MONTH";
	if(nViewMode === window.jedo.WEEK)		return "window.jedo.WEEK";
	if(nViewMode === window.jedo.DATE)		return "window.jedo.DATE";
	if(nViewMode === window.jedo.HOUR)		return "window.jedo.HOUR";
	if(nViewMode === window.jedo.MIN)		return "window.jedo.MIN";
	if(nViewMode === window.jedo.SEC)		return "window.jedo.SEC";
	if(nViewMode === window.jedo.MIL)		return "window.jedo.MIL";
	throw new Error("window.jedo.getViewModeString nViewMode is bad");
};
window.jedo.getZoomInViewMode = function(nViewMode) {
	if(nViewMode === window.jedo.YEAR)		return window.jedo.QUARTER;
	if(nViewMode === window.jedo.QUARTER)	return window.jedo.MONTH;
	if(nViewMode === window.jedo.MONTH)		return window.jedo.WEEK;
	if(nViewMode === window.jedo.WEEK)		return window.jedo.DATE;
	if(nViewMode === window.jedo.DATE)		return window.jedo.HOUR;
	if(nViewMode === window.jedo.HOUR)		return window.jedo.MIN;
	if(nViewMode === window.jedo.MIN)		return window.jedo.SEC;
	if(nViewMode === window.jedo.SEC)		return window.jedo.MIL;
	throw new Error("window.jedo.getZoomInViewMode nViewMode is bad");
};
window.jedo.getZoomOutViewMode = function(nViewMode) {
	if(nViewMode === window.jedo.QUARTER)	return window.jedo.YEAR;
	if(nViewMode === window.jedo.MONTH)		return window.jedo.QUARTER;
	if(nViewMode === window.jedo.WEEK)		return window.jedo.MONTH;
	if(nViewMode === window.jedo.DATE)		return window.jedo.WEEK;
	if(nViewMode === window.jedo.HOUR)		return window.jedo.DATE;
	if(nViewMode === window.jedo.MIN)		return window.jedo.HOUR;
	if(nViewMode === window.jedo.SEC)		return window.jedo.MIN;
	if(nViewMode === window.jedo.MIL)		return window.jedo.SEC;
	throw new Error("window.jedo.getZoomOutViewMode nViewMode is bad");
};
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
window.jedo.getFnScale = function(oSDate, oEDate, nSpx, nEpx) {
	var nSTime = oSDate.getTime();
	var nETime = oEDate.getTime();
	var nTime = nETime - nSTime;
	var nPx = nEpx - nSpx;
	return function (oDate, pDateScaleType){
		return (oDate.getTime()*nPx)/nTime;
	};
};
window.jedo.getTime = function(oSDate, oEDate, nSpx, nEpx, xClient) {
	return ((oEDate.getTime()-oSDate.getTime())/(nEpx-nSpx))*xClient;
};
window.jedo.getSVGCursorPoint = function(svgNode, event) {
	var pt = svgNode.createSVGPoint();
	pt.x = event.clientX; 
	pt.y = event.clientY;
    var a = svgNode.getScreenCTM();
    //console.debug("offset based on svg"+ " x:" + a.e +" y:" + a.f);
    var b = a.inverse();
    return pt.matrixTransform(b);
};
window.jedo.getMarkPoints = function(iX, iY, iW, iH) {
	var mH = (iH/5)*3;
	var mT = iH/3;
	//console.log("iX:%i, iY:%i, iW:%i, iH:%i ",iX, iY, iW, iH);
	return [ { "x": parseInt(iX-mT,10), "y": parseInt(iY,10)},  
             { "x": parseInt(iX+mT,10), "y": parseInt(iY,10)},
             { "x": parseInt(iX+mT,10), "y": parseInt(iY+mH,10)}, 
             { "x": parseInt(iX,10),  	"y": parseInt(iY+iH,10)},
             { "x": parseInt(iX-mT,10),	"y": parseInt(iY+mH,10)}
           ];
};
window.jedo.getMarkPointsArr = function(iX, iY, iW, iH) {
	var mH = (iH/5)*3;
	var mT = iH/3;
	//console.log("iX:%i, iY:%i, iW:%i, iH:%i ",iX, iY, iW, iH);
	return [ parseInt(iX-mT,10), parseInt(iY,10),  
             parseInt(iX+mT,10), parseInt(iY,10),
             parseInt(iX+mT,10), parseInt(iY+mH,10), 
             parseInt(iX,10),  	 parseInt(iY+iH,10),
             parseInt(iX-mT,10), parseInt(iY+mH,10)
           ];
};
window.jedo.getTimeFormat = function(indexLine, lineMode) {
	if(lineMode === window.jedo.YEAR) {
		return function(oDate) {
			return Snap.format("{year}년", {
				year: oDate.getFullYear()
			});
		};
	} else if(lineMode === window.jedo.QUARTER) {
		return function(oDate) {
			return Snap.format("{year}년/{quarter}분기", {
				year: oDate.getFullYear(),
				quarter: window.jedo.getQuarter(oDate)
			});
		};
	} else if(lineMode === window.jedo.MONTH) {
		if(1 < indexLine) {
			return function(oDate) {
				return Snap.format("{month}월", {
					month: oDate.getMonth()+1
				});
			};
		} else {
			return function(oDate) {
				return Snap.format("{year}년/{month}월", {
					year: oDate.getFullYear(),
					month: oDate.getMonth()+1
				});
			};
		}
	} else if(lineMode === window.jedo.WEEK) {
		if(1 < indexLine) {
			return function(oDate) {
				var nDate = new Date();
				nDate.setTime(oDate.getTime());
				nDate.setMonth(0);
				nDate.setDate(1);
				nDate.setHours(0,0,1);
				return Snap.format("{week}주", {
					week: parseInt((oDate.getTime()-nDate.getTime())/(1000*60*60*24*7),10)
				});
			};
		} else {
			return function(oDate) {
				var nDate = new Date();
				nDate.setTime(oDate.getTime());
				nDate.setMonth(0);
				nDate.setDate(1);
				nDate.setHours(0,0,1);
				return Snap.format("{year}년/{week}주", {
					year: oDate.getFullYear(),
					week: parseInt((oDate.getTime()-nDate.getTime())/(1000*60*60*24*7),10)
				});
			};
		}
	} else if(lineMode === window.jedo.DATE) {
		return function(oDate) {
			return Snap.format("{date}", {
				date: oDate.getDate()
			});
		};
	} else if(lineMode === window.jedo.HOUR) {
		return function(oDate) {
			return Snap.format("{hour}", {
				hour: oDate.getHours()
			});
		};
	} else {
		throw new TypeError("lineMode["+lineMode+"] is bad");
	}
};
window.jedo.getDateViewMode = function(options, oFnScale) {
	//console.log("s -- window.jedo.getDateViewMode -- ");

	var oDate = new Date();
	oDate.setTime(options.startGanttDate.getTime());
	oDate.setMonth(0);
	oDate.setDate(1);
	oDate.setHours(0,0,0,0);
	var iSPos = oFnScale(oDate);
	
	oDate.setHours(23,59,59,999);
	var iWidth = oFnScale(oDate) - iSPos;
	//console.debug("One Date["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		return window.jedo.DATE;
	}
	
	
	oDate.setDate(7);
	iWidth = oFnScale(oDate) - iSPos;
	//console.debug("One Week["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		return window.jedo.WEEK;
	}
	
	
	oDate.setMonth(oDate.getMonth()+1);
	oDate.setDate(0);
	iWidth = oFnScale(oDate) - iSPos;
	//console.debug("One Month["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		return window.jedo.MONTH;
	}
	
	oDate.setTime(this.options.startGanttDate.getTime());
	oDate.setMonth(3);
	oDate.setDate(0);
	iWidth = oFnScale(oDate) - iSPos;
	//console.debug("One Quarter["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		return window.jedo.QUARTER;
	}
	
	oDate.setMonth(12, 0);
	iWidth = oFnScale(oDate) - iSPos;
	//console.debug("One Year["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
	if(options.unitWidth <= iWidth) {
		return window.jedo.YEAR;
	} 

	throw new Error("getDateViewMode dateViewMode Not define");
	//console.log("e -- window.jedo.getDateViewMode -- ");
};
window.jedo.getChangeSvgWidth = function(nDateViewMode, fnScale, options, svg) {
	//console.log("s -- window.jedo.JedoGantt.prototype.getChangeSvgWidth -- ");
	
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
	switch (nDateViewMode) {
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
			break;
		case window.jedo.HOUR :    // 시간
			//console.debug("window.jedo.HOUR -- DATE["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours());
			oDate.setHours(oDate.getHours()+1,59,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" Width:"+iWidth);
			iWidth = iWidth == 0 ? 1 : iWidth;
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change HOUR["+window.jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" nWidth:"+nWidth);
			}
			break;
		case window.jedo.MIN :     // 분
			oDate.setMinutes(oDate.getMinutes()+1,59,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIN["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change MIN["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			break;
		case window.jedo.SEC :     // 초
			oDate.setSeconds(oDate.getSeconds()+1,999);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One SEC["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change SEC["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			break;
		case window.jedo.MIL :     // 밀리초
			oDate.setMilliseconds(oDate.getMilliseconds()+1);
			iWidth = fnScale(oDate, window.jedo.DATE_SCALE_TYPE_END) - iSPos;
			//console.debug("One MIL["+window.jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(iWidth < options.unitWidth) {
				nWidth = ( xWidth / iWidth ) * options.unitWidth;
				//console.debug("change MIL["+window.jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
			}
			break;
		default :
			throw new TypeError("Param nDateViewMode["+nDateViewMode+"] is Bad");
	}
	return nWidth;
	//console.log("e -- window.jedo.JedoGantt.prototype.getChangeSvgWidth -- ");
};
window.jedo.createRectHeaderLine = function(svgGanttHeader, indexLine, lineMode, arr) {
	//console.log("svgGanttHeader:"+svgGanttHeader);
	/*
	svgGanttHeader.selectAll('rect.rectheaderLine'+indexLine)
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
	*/
	arr.forEach(function(o, i){
		svgGanttHeader.rect(o.x, o.y, o.width, o.height).attr({
			'class': 'rectheaderLine'+indexLine,
			fill : 'url(#headerGradient)', 
			stroke : 'navy', 
			'stroke-width' : 0
		});
	});
};
window.jedo.createRectHeaderLineTransition = function(svgGanttHeader, indexLine, lineMode, arr) {
	/*
	svgGanttHeader.selectAll('rect.rectheaderLine'+indexLine)
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
	*/
	arr.forEach(function(o, i){
		svgGanttHeader.rect(o.x, o.y, o.width, o.height).attr({
			'class': 'rectheaderLine'+indexLine,
			fill : 'url(#headerGradient)', 
			stroke : 'navy', 
			'stroke-width' : 0
		}).animate({
			x: o.x2,
			width: o.w2
		},1000);
	});
};
window.jedo.getHeaderItemID = function(lineMode, sLineId, oDate) {
	if(lineMode === window.jedo.YEAR) {
		return sLineId+"_"+oDate.getFullYear();
	} else if(lineMode === window.jedo.QUARTER) {
		var nQuarter = window.jedo.getQuarter(oDate);
		return sLineId+"_"+oDate.getFullYear()+"_"+nQuarter;
	} else if(lineMode === window.jedo.MONTH) {
		return sLineId+"_"+oDate.getFullYear()+"_"+oDate.getMonth();
	} else if(lineMode === window.jedo.WEEK) {
		var nDate = new Date();
		nDate.setTime(oDate.getTime());
		nDate.setMonth(0);
		nDate.setDate(1);
		nDate.setHours(0,0,1);
		var iWeekNo = parseInt((oDate.getTime()-nDate.getTime())/(1000*60*60*24*7),10);
		return sLineId+"_"+oDate.getFullYear()+"_"+iWeekNo;
	} else if(lineMode === window.jedo.DATE) {
		return sLineId+"_"+oDate.getFullYear()+"_"+oDate.getDate();
	} else if(lineMode === window.jedo.HOUR) {
		var y = oDate.getFullYear();
		var m = oDate.getMonth()+1;
		var d = oDate.getDate();
		return sLineId+"_"+y+m+d+"_"+oDate.getHours();
	} else {
		throw Error("lineMode is bad");
	}
};
window.jedo.createTextHeaderLine = function(svgGanttHeader, indexLine, lineMode, arr, options) {
	
	var format = window.jedo.getTimeFormat(indexLine, lineMode);
	arr.forEach(function(o, i){
		
		var elem = svgGanttHeader.text(o.x, o.y, format(o.currentDate)).attr({
			'class': 'textheaderLine'+indexLine,
			'fill': 'red',
			'font-family': "Verdana",
			'font-size': options.header.fontSize
		});
		var bbox = elem.getBBox();
		elem.attr({
			x: o.x + (o.width-bbox.width)/2,
			y: o.y + bbox.height + ((o.height-bbox.height)/3)
		});
	});
	
};
window.jedo.createTextHeaderLineTransition = function(svgGanttHeader, indexLine, lineMode, arr, options) {
	
	var format = window.jedo.getTimeFormat(indexLine, lineMode);
	arr.forEach(function(o, i){
		var elem = svgGanttHeader.text(o.x, o.y, format(o.currentDate)).attr({
			'fill': 'red',
			'font-family' : "Verdana",
			'font-size' : options.header.fontSize
		});
		var bbox = elem.getBBox();
		elem.attr({
			x: o.x + (o.width-bbox.width)/2,
			y: o.y + bbox.height + ((o.height-bbox.height)/3)
		}).animate({
			x: o.x2+(o.w2-bbox.width)/2,
			y: o.y2 + bbox.height + ((o.height-bbox.height)/3)
		},1000);
	});
};
window.jedo.setGanttBodyLine = function(svgGanttBody, fnPrevScale, arr, iX) {
	console.log("s -- window.jedo.setGanttBodyLine -------------------------");
	console.log("arr.length:"+arr.length);
	console.log("iX:"+iX);
	if(fnPrevScale) {
		console.log("fnPrevScale is in");
		svgGanttBody.selectAll('rect.ganttBodyLine').attr({'width': iX});
	} else {
		arr.forEach(function(o,i){
			//console.log("i:%i, x:%i, y:%i, w:%i, h:%i", i, o.x, o.y, iX, o.lineHeight);
			var elem = svgGanttBody.rect(0, o.lineY, iX, o.lineHeight).attr({
				'class': 'ganttBodyLine',
				'fill': i%2 ? '#FFFFF0' : '#F0FFF0'
			});
		});
	}
	console.log("e -- window.jedo.setGanttBodyLine -------------------------");
};
window.jedo.setGanttBodyBar = function(svgGanttBody, fnPrevScale, arr, iX, oJedoGantt) {
	console.log("s -- window.jedo.setGanttBodyBar -------------------------");
	if(fnPrevScale) {
		arr.forEach(function(o,i){
			try {
				svgGanttBody.select("#rectGanttBar_"+o.id)
				.animate({
					x: o.x2,
					width: o.w2
				},1000);
			} catch(e) {
				console.log("error-rectGanttBar:"+e.message);
			}
			/*
			if(o.isParent) {
				try {
					svgGanttBody.select("#startMarkGanttBar_"+o.id)
						.animate({
							'points': window.jedo.getMarkPoints(o.x2, o.y1, o.w2, o.h1).map(function(d){ return [d.x,d.y].join(",");}).join(" ")
						},1000);
				} catch(e) {
					console.log("error-startMarkGanttBar:"+e.message);
				}
				try {
					svgGanttBody.selectAll("#endMarkGanttBar_"+o.id)
						.animate({
							'points': window.jedo.getMarkPoints(o.x2+o.w2, o.y1, o.w2, o.h1).map(function(d){ return [d.x,d.y].join(",");}).join(" ")
						},1000);
				} catch(e) {
					console.log("error-endMarkGanttBar:"+e.message);
				}
			}
			*/
		});
		
	} else {
		
		var arrG = [];
		arr.forEach(function(o,i){
			var elem = svgGanttBody.rect(o.x1, o.y1, o.w1, o.isParent?(o.h1/3)*2:o.h1).attr({
				'id': "rectGanttBar_"+o.id,
				'fill': 'url(#ganttBarGradient)', 
				'stroke': '#ff69b4', 
				'stroke-width': 0
			});
			if(o.isParent) {
				
				
				var sMGB = svgGanttBody.polygon(window.jedo.getMarkPointsArr(o.x1, o.y1, o.w1, o.h1)).attr({
					"id": "startMarkGanttBar_"+o.id,
					"class": "startMarkGanttBar",
					'fill': 'url(#ganttMarkGradient)', 
					'stroke': '#000000', 
					'stroke-width': 1,
					'dataID': o.id
				});
				
				var eMGB = svgGanttBody.polygon(window.jedo.getMarkPointsArr(o.x1+o.w1, o.y1, o.w1, o.h1)).attr({
					"id": "endMarkGanttBar_"+o.id,
					"class": "endMarkGanttBar",
					'fill': 'url(#ganttMarkGradient)', 
					'stroke': '#000000', 
					'stroke-width': 1,
					'dataID': o.id
				});
				
				svgGanttBody.group(elem, sMGB, eMGB).attr({
					id: "gGanttBar_"+o.id,
					'class': 'gGanttBar',
					'dataID': o.id,
					'dataIndex': i,
					'isParent': o.isParent,
					'parentId': o.parentId,
					'ganttBarHeight': o.ganttBarHeight
				});
				
				
			} else {
				svgGanttBody.group(elem).attr({
					id: "gGanttBar_"+o.id,
					'class': 'gGanttBar',
					'dataID': o.id,
					'dataIndex': i,
					'isParent': o.isParent,
					'parentId': o.parentId,
					'ganttBarHeight': o.ganttBarHeight
				});
			}
			
		});
		
	}//if(fnPrevScale) {
	console.log("e -- window.jedo.setGanttBodyBar -------------------------");
};
window.jedo.createWebWorker = function (sourceFile){
	var requests = {}, // 키는 요청 ID이고, 값은 디퍼드다.
		requestId = 0, // 각 메시지의 전송마다 하나씩 증가한다.
		worker = new Worker(sourceFile),
		sendJob = function(method, payload){
			var deferred = $.Deferred(),
			id = requestId++;
			requests[id] = deferred;
			worker.postMessage({
				method: method,
				payload: payload,
				requestId: id
			});
			return deferred.promise();
		},
		handleResponse = function(response){
			var deferred, id;
			if (response.hasOwnProperty('requestId')){
				id = response.requestId;
				if (requests.hasOwnProperty(id)){
					deferred = requests[id];
					delete requests[id];
					if (response.hasOwnProperty('result')){
						deferred.resolve(response.result);
					}
					else {
						deferred.reject(response.error);
					}
				}
			} else {
				// 웹 워커의 요청하지 않은 메시지. ④
				if (response.type === 'log'){
					console.log('워커의 응답:', response.message);
				}
				else {
					console.log('Unknown message from worker:', response);
				}
			}
		};
	worker.addEventListener('message', function(event){
		handleResponse(event.data);
	});
	return {
		add: function(a, b){
			return sendJob('add', [a, b]); },
		ping: function(){
			return sendJob('ping');
		}
	};
};









}//if(!window.hasOwnProperty("jedo")) {

