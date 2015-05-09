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

if(!jedo.JedoGantt.prototype.hasOwnProperty("onMouseDownChangePrevViewMode")) {


/*\
 * jedo.JedoGantt.prototype.changeScrollGanttContainer
 [ method ]

 * 화면모드가 변경시 화면폭이 변경된다, 
 * 화면폭변경 이벤트를 주어 사용자가 클릭한 시점의 시간위치값과 화면이 변경된 후의 시간위치값이 같게한다.

 > Arguments

 - nSvgToWidth   (number) 최종 SVG폭
 - nClickPer     (number) 클릭시 시간위치 백분률
 - nClientX      (number) 클릭시 보여지는 시간위치의 펙셀위치값.(X스크롤값 제외).


 = (function) function of returned 
\*/
Object.defineProperty(jedo.JedoGantt.prototype, "changeScrollGanttContainer", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _oGanttContainer = $(this.ganttContainer);
		
		return function (nSvgToWidth, nClickPer, nClientX) {
			//console.log("s -- jedo.JedoGantt.prototype.changeScrollGanttContainer  --");
			//console.log("nSvgToWidth["+nSvgToWidth+"] nClickPer["+nClickPer+"] nClientX["+nClientX+"]");
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var w = _svg.attr("width");
					var nToTimePx = (w*nClickPer)/100;
					var nTScroll = nToTimePx - nClientX;
					_oGanttContainer.scrollLeft(nTScroll);
					if((nSvgToWidth-5) < w) {
						observer.disconnect();
					}
				});
			});
			observer.observe(this.svg.node(), { 
			    attributes: true,
			    attributeFilter: ["width"],
			    attributeOldValue: false,
			    childList: false
			});
			//console.log("e -- jedo.JedoGantt.prototype.changeScrollGanttContainer  --");
		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownChangePrevViewMode", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseDownChangePrevViewMode  --");

			var svgPoint = jedo.JedoGantt.getSVGCursorPoint(_svg, event.clientX, event.clientY);
			var nSvgWidth = _svg.attr("width");
			var nClickPer = (svgPoint.x*100)/nSvgWidth;

			var nToDataViewMode = jedo.JedoGantt.getZoomOutViewMode(_settingConfig.dateViewMode);
			var nSvgToWidth = _settingConfig.dateViewModeSvgPrevWidth;
			var nPrevScrollLeft = _settingConfig.prevScrollLeft;
			var oPrevViewStartDate = _settingConfig.prevViewStartDate;
			_settingConfig.popGanttWidth();
			
			//_oJedoGantt.changeScrollGanttContainer(nSvgToWidth, _settingConfig.clickPer, _settingConfig.viewX);
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var w = _svg.attr("width");
					var nToTimePx = (w*nClickPer)/100;
					//var nTScroll = nToTimePx - nClientX;
					//_oGanttContainer.scrollLeft(nTScroll);
					if((nSvgToWidth-5) < w) {
						observer.disconnect();
						_oGanttContainer.scrollLeft(nPrevScrollLeft);
					}
				});
			});
			observer.observe(this.svg.node(), { 
			    attributes: true,
			    attributeFilter: ["width"],
			    attributeOldValue: false,
			    childList: false
			});
			var promise = _oJedoGantt.changeGanttViewMode(svgPoint, nToDataViewMode, nSvgToWidth);
			
//			console.log("e -- jedo.JedoGantt.prototype.onMouseDownChangePrevViewMode  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseOverGanttBar", {
	get: function() {
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseOverGanttBar  --");
//			console.debug("id:"+event.target.getAttribute("id"));
//			console.debug("class:"+event.target.getAttribute("class"));
			
			var sDataID = event.target.getAttribute("dataID");
			//console.debug("dataID:"+event.target.getAttribute("dataID"));
			d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID).each(function(){
				if(this.getAttribute("class") == "rectGanttBar") {
					d3.select(this).style({'cursor':'pointer'});
				} else {
					d3.select(this).style({'cursor':'col-resize'});
				}
			});
//			console.log("e -- jedo.JedoGantt.prototype.onMouseOverGanttBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownGanttBar", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseDownGanttBar  --");
//			console.log("event.type:"+event.type+" clientX:"+event.clientX+" x:"+event.x+" clientY:"+event.clientY+" y:"+event.y);
		//	
			_oJedoGantt.clearCapturedGanttBar();
			
			var oTarget = d3.select(event.target);
			var sDataID = oTarget.attr("dataID");
			var gGanttBar = d3.select("#gGanttBar_"+sDataID);
			var dataIndex = gGanttBar.attr("dataIndex");
			
			var sClass = event.target.getAttribute("class");
			var capturedMode;
			if(sClass == "startMarkGanttBar") {
				
				capturedMode = jedo.CAPTURED_MODE.LEFT_CHANGE;
			} else if(sClass == "rectGanttBar") {
				
				capturedMode = jedo.CAPTURED_MODE.MOVE_CHANGE;
			} else if(sClass == "endMarkGanttBar") {
				
				capturedMode = jedo.CAPTURED_MODE.RIGHT_CHANGE;
			} else {
				throw new TypeError("event.target class["+sClass+"] is bad");
			}
			d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID).each(function(){
				d3.select(this).style({'stroke-width':2});
			});
			var svgPoint = jedo.JedoGantt.getSVGCursorPoint(_svg, event.clientX, event.clientY);
			_oJedoGantt.capturedGanttBar = new jedo.CapturedGanttBar(svgPoint, capturedMode, sDataID, dataIndex);
			
//			console.log("e -- jedo.JedoGantt.prototype.onMouseDownGanttBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpBar", {
	get: function() {
		
		var _oJedoGantt = this;
		
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseUpBar  --");
			_oJedoGantt.clearCapturedGanttBar();
//			console.log("e -- jedo.JedoGantt.prototype.onMouseUpBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseMoveBar", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		
		var bh = _options.ganttBarHeight;
		var unitSpace = _options.unitSpace;
		
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseMoveBar  --");
			//console.log("event.type:"+event.type+" clientX:"+event.clientX+" clientY:"+event.clientY+" y:"+event.y);
			//console.debug("which:"+event.which);
			
			var capturedGanttBar = _oJedoGantt.capturedGanttBar;
			if(capturedGanttBar) {
				var svgPoint = jedo.JedoGantt.getSVGCursorPoint(_svg, event.clientX, event.clientY);
			    
				
				var capturedMode = capturedGanttBar.capturedMode;
				var capturedDataID = capturedGanttBar.capturedDataID;
				var capturedSvgPointX = capturedGanttBar.svgPoint.x;
				
				var gGanttBar = d3.select("#gGanttBar_"+capturedDataID);
				var oRectGanttBar = d3.select("#rectGanttBar_"+capturedDataID);
				
				var x = parseInt(oRectGanttBar.attr("x"));
				var y = parseInt(oRectGanttBar.attr("y"));
				var w = parseInt(oRectGanttBar.attr("width"));
				var h = parseInt(oRectGanttBar.attr("height"));
				//console.log("x["+x+"], y["+y+"], w["+w+"], h["+h+"]");
				
				if(capturedMode === jedo.CAPTURED_MODE.LEFT_CHANGE) {
					
					var nx = parseInt(svgPoint.x);
					var mx = parseInt(capturedSvgPointX) - nx;
					var nw = w+mx;
					nw = nw < unitSpace ? unitSpace : nw;
					oRectGanttBar.attr("x", nx);
					oRectGanttBar.attr("width", nw);
					var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+capturedDataID);
					if(oStartMarkGanttBar) {
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx, y, bh, bh);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						oStartMarkGanttBar.attr("points", points);
					}
					
				} else if(capturedMode === jedo.CAPTURED_MODE.MOVE_CHANGE) {
					
					var sx = parseInt(svgPoint.x);
					var mx = parseInt(capturedSvgPointX) - sx;
					var nx = x-mx;
					oRectGanttBar.attr("x", nx);
					var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+capturedDataID);
					if(oStartMarkGanttBar) {
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx, y, bh, bh);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						oStartMarkGanttBar.attr("points", points);
					}
					var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+capturedDataID);
					if(oEndMarkGanttBar) {
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx+w, y, bh, bh);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						oEndMarkGanttBar.attr("points", points);
					}
				} else if(capturedMode === jedo.CAPTURED_MODE.RIGHT_CHANGE) {
					
					var mx = parseInt(svgPoint.x) - parseInt(capturedSvgPointX);
					var nw = w+mx;
					nw = nw < unitSpace ? unitSpace : nw;
					oRectGanttBar.attr("width", nw);
					var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+capturedDataID);
					if(oEndMarkGanttBar) {
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(x+nw, y, bh, bh);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						oEndMarkGanttBar.attr("points", points);
					}
				} else {
					throw new Error("capturedMode is bad");
				}
				_oJedoGantt.capturedGanttBar.svgPoint = svgPoint;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseMoveBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpGanttHeader", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(this.ganttContainer);
		
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseUpGanttHeader  --");
			
			var svgPoint = jedo.JedoGantt.getSVGCursorPoint(_svg, event.clientX, event.clientY);
			var nClickPer = (svgPoint.x*100)/_svg.attr("width");
			//console.log("nClickPer["+nClickPer+"]");
			
			
			var nToDateViewMode = jedo.JedoGantt.getZoomInViewMode(_settingConfig.dateViewMode);
			var nSvgToWidth = jedo.JedoGantt.getChangeSvgWidth(nToDateViewMode, _settingConfig.fnScale, _options, _svg);
			_settingConfig.pushGanttWidth(nSvgToWidth);
			
			var promise = _oJedoGantt.changeGanttViewMode(svgPoint, nToDateViewMode, nSvgToWidth);
			_oJedoGantt.changeScrollGanttContainer(nSvgToWidth, nClickPer, event.clientX);
			
			//console.log("e -- jedo.JedoGantt.prototype.onMouseUpGanttHeader  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownGanttLine", {
	get: function() {
		
		var _oJedoGantt = this;
		
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseDownGanttLine  --");
			
			if(event.button == 0) {
				_oJedoGantt.scrollSVG = {
						clientX: event.clientX,
						clientY: event.clientY
				};
			}
			
			//console.log("e -- jedo.JedoGantt.prototype.onMouseDownGanttLine  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseMoveGanttLine", {
	get: function() {
		
		var _oJedoGantt = this;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseMoveGanttLine  --");
			if(_oJedoGantt.scrollSVG) {
				//console.log("event.button:"+event.button);
				
				var scrollLeft = _oGanttContainer.scrollLeft();
				_oGanttContainer.scrollLeft(scrollLeft+_oJedoGantt.scrollSVG.clientX - event.clientX);
				var scrollTop = _oGanttContainer.scrollTop();
				_oGanttContainer.scrollTop(scrollTop+_oJedoGantt.scrollSVG.clientY - event.clientY);
				
				_oJedoGantt.scrollSVG.clientX = event.clientX;
				_oJedoGantt.scrollSVG.clientY = event.clientY;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseMoveGanttLine  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpGanttLine", {
	get: function() {
		
		var _oJedoGantt = this;
		
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseUpGanttLine  --");
			if(event.button == 0) {
				_oJedoGantt.scrollSVG = null;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseUpGanttLine  --");
		};
	},
	enumerable: false,
	configurable: false
});









}//if(!jedo.JedoGantt.hasOwnProperty("mouseOverGanttBar")) {

