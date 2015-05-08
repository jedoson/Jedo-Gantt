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

if(!jedo.JedoGantt.prototype.hasOwnProperty("onMouseOverGanttBar")) {

Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownChangePrevViewMode", {
	get: function() {
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseDownChangePrevViewMode  --");

			var oGanttContainer = $(this.ganttContainer);
			var svgPoint	= jedo.JedoGantt.getSVGCursorPoint(this.svg, event);
			var nSvgWidth = this.svg.attr("width");
			var nClickPer = (svgPoint.x*100)/nSvgWidth;
			//console.log("nClickPer["+nClickPer+"]");
			var nClientX = event.clientX;
			var nDataViewMode = jedo.JedoGantt.getZoomOutViewMode(this.dateViewMode);
			var nSvgToWidth = this.dateViewModeSvgPrevWidth;
			this.popGanttWidth();
			//console.log("nSvgToWidth:"+nSvgToWidth);
			var promise = this.changeGanttViewMode(svgPoint, nDataViewMode, nSvgToWidth);
			
			var _jedoGantt = this;
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var w = _jedoGantt.svg.attr("width");
					var nToTimePx = (w*nClickPer)/100;
					var nTScroll = nToTimePx - nClientX;
					oGanttContainer.scrollLeft(nTScroll);
					if(nSvgToWidth == w) {
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
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseDownGanttBar  --");
//			console.log("event.type:"+event.type+" clientX:"+event.clientX+" x:"+event.x+" clientY:"+event.clientY+" y:"+event.y);
		//	
			this.clearCapturedGanttBar();
			
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
			var svgPoint = jedo.JedoGantt.getSVGCursorPoint(this.svg, event);
			this.capturedGanttBar = new jedo.CapturedGanttBar(svgPoint, capturedMode, sDataID, dataIndex);
			
//			console.log("e -- jedo.JedoGantt.prototype.onMouseDownGanttBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpBar", {
	get: function() {
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseUpBar  --");
			this.clearCapturedGanttBar();
//			console.log("e -- jedo.JedoGantt.prototype.onMouseUpBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseMoveBar", {
	get: function() {
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseMoveBar  --");
			//console.log("event.type:"+event.type+" clientX:"+event.clientX+" clientY:"+event.clientY+" y:"+event.y);
			//console.debug("which:"+event.which);
			
			if(this.capturedGanttBar) {
				//console.log("this.capturedGanttBar.capturedDataID:"+this.capturedGanttBar.capturedDataID);
				var svgPoint = jedo.JedoGantt.getSVGCursorPoint(this.svg, event);
			    //console.debug("svg mouse at"+ " x:" + svgPoint.x +" y:" +svgPoint.y);
			    
				var gGanttBar = d3.select("#gGanttBar_"+this.capturedGanttBar.capturedDataID);
				var oRectGanttBar = d3.select("#rectGanttBar_"+this.capturedGanttBar.capturedDataID);
				
				
				
				var x = parseInt(oRectGanttBar.attr("x"));
				var y = parseInt(oRectGanttBar.attr("y"));
				var w = parseInt(oRectGanttBar.attr("width"));
				var h = parseInt(oRectGanttBar.attr("height"));
				//console.log("x["+x+"], y["+y+"], w["+w+"], h["+h+"]");
				
				if(this.capturedGanttBar.capturedMode === jedo.CAPTURED_MODE.LEFT_CHANGE) {
					
					var nx = parseInt(svgPoint.x);
					var mx = parseInt(this.capturedGanttBar.svgPoint.x) - nx;
					var nw = w+mx;
					nw = nw < this.options.unitSpace ? this.options.unitSpace : nw;
					oRectGanttBar.attr("x", nx);
					oRectGanttBar.attr("width", nw);
					var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+this.capturedGanttBar.capturedDataID);
					if(oStartMarkGanttBar) {
						
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx, y, this.options.ganttBarHeight, this.options.ganttBarHeight);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						//console.log("points:"+points);
						oStartMarkGanttBar.attr("points", points);
					}
					
				} else if(this.capturedGanttBar.capturedMode === jedo.CAPTURED_MODE.MOVE_CHANGE) {
					
					var sx = parseInt(svgPoint.x);
					var mx = parseInt(this.capturedGanttBar.svgPoint.x) - sx;
					var nx = x-mx;
					oRectGanttBar.attr("x", nx);
					
					var oStartMarkGanttBar = d3.select("#startMarkGanttBar_"+this.capturedGanttBar.capturedDataID);
					if(oStartMarkGanttBar) {
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx, y, this.options.ganttBarHeight, this.options.ganttBarHeight);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						//console.log("points:"+points);
						oStartMarkGanttBar.attr("points", points);
					}
					var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+this.capturedGanttBar.capturedDataID);
					if(oEndMarkGanttBar) {
						
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(nx+w, y, this.options.ganttBarHeight, this.options.ganttBarHeight);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						//console.log("points:"+points);
						oEndMarkGanttBar.attr("points", points);
					}
				} else if(this.capturedGanttBar.capturedMode === jedo.CAPTURED_MODE.RIGHT_CHANGE) {
					
					var mx = parseInt(svgPoint.x) - parseInt(this.capturedGanttBar.svgPoint.x);
					var nw = w+mx;
					nw = nw < this.options.unitSpace ? this.options.unitSpace : nw;
					oRectGanttBar.attr("width", nw);
					var oEndMarkGanttBar = d3.select("#endMarkGanttBar_"+this.capturedGanttBar.capturedDataID);
					if(oEndMarkGanttBar) {
						
						var arrMarkPoints = jedo.JedoGantt.getMarkPoints(x+nw, y, this.options.ganttBarHeight, this.options.ganttBarHeight);
						var points = arrMarkPoints.map(function(p){ return [p.x, p.y].join(",");}).join(" ");
						//console.log("points:"+points);
						oEndMarkGanttBar.attr("points", points);
					}
				}
				this.capturedGanttBar.svgPoint = svgPoint;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseMoveBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpGanttHeader", {
	get: function() {
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseUpGanttHeader  --");
			
			var oGanttContainer = $(this.ganttContainer);
			var nSvgWidth = this.svg.attr("width");
			var svgPoint = jedo.JedoGantt.getSVGCursorPoint(this.svg, event);
			var nClickPer = (svgPoint.x*100)/nSvgWidth;
			//console.log("nClickPer["+nClickPer+"]");
			
			var nClientX = event.clientX;
			var nDateViewMode = jedo.JedoGantt.getZoomInViewMode(this.dateViewMode);
			var nSvgToWidth = jedo.JedoGantt.getChangeSvgWidth(nDateViewMode, this.fnScale, this.options, this.svg);
			this.pushGanttWidth(nSvgToWidth);
			var promise = this.changeGanttViewMode(svgPoint, nDateViewMode, nSvgToWidth);
			
			var _jedoGantt = this;
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var w = _jedoGantt.svg.attr("width");
					var nToTimePx = (w*nClickPer)/100;
					var nTScroll = nToTimePx - nClientX;
					oGanttContainer.scrollLeft(nTScroll);
					if(nSvgToWidth == w) {
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
			//console.log("e -- jedo.JedoGantt.prototype.onMouseUpGanttHeader  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownGanttLine", {
	get: function() {
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseDownGanttLine  --");
			
			if(event.button == 0) {
				this.scrollSVG = {
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
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseMoveGanttLine  --");
			if(this.scrollSVG) {
				//console.log("event.button:"+event.button);
				
				var oGanttContainer = $(this.ganttContainer);
				var scrollLeft = oGanttContainer.scrollLeft();
				oGanttContainer.scrollLeft(scrollLeft+this.scrollSVG.clientX - event.clientX);
				var scrollTop = oGanttContainer.scrollTop();
				oGanttContainer.scrollTop(scrollTop+this.scrollSVG.clientY - event.clientY);
				
				this.scrollSVG.clientX = event.clientX;
				this.scrollSVG.clientY = event.clientY;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseMoveGanttLine  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onMouseUpGanttLine", {
	get: function() {
		return function(event) {
			//console.log("s -- jedo.JedoGantt.prototype.onMouseUpGanttLine  --");
			if(event.button == 0) {
				this.scrollSVG = null;
			}
			//console.log("e -- jedo.JedoGantt.prototype.onMouseUpGanttLine  --");
		};
	},
	enumerable: false,
	configurable: false
});









}//if(!jedo.JedoGantt.hasOwnProperty("mouseOverGanttBar")) {

