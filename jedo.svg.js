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
if(!jedo.hasOwnProperty("svg")) {

jedo.svg = {};
Object.defineProperty(jedo.svg, "getTimeFormat", {
	get: function() {
		return function(indexLine, lineMode) {
			var format = null;
			if(lineMode === jedo.VIEW_MODE.YEAR) {
				format = d3.time.format("%Y년");
			} else if(lineMode === jedo.VIEW_MODE.QUARTER) {
				format = d3.time.format("%Y년");
				return function(oDate) {
					var nQ = jedo.getQuarter(oDate);
					return format(oDate)+"/"+nQ+"분기";
				};
			} else if(lineMode === jedo.VIEW_MODE.MONTH) {
				if(1 < indexLine) {
					format = d3.time.format("%m월");
				} else {
					format = d3.time.format("%Y년 %m월");
				}
			} else if(lineMode === jedo.VIEW_MODE.WEEK) {
				if(1 < indexLine) {
					format = d3.time.format("%U주");
				} else {
					format = d3.time.format("%Y년 %U주");
				}
			} else if(lineMode === jedo.VIEW_MODE.DATE) {
				format = d3.time.format("%d");
			} else if(lineMode === jedo.VIEW_MODE.HOUR) {
				format = d3.time.format("%H");
			} else {
				throw new TypeError("lineMode["+lineMode+"] is bad");
			}
			return format;
		};
	},
	enumerable: false,
	configurable: false
});

/*\
 * jedo.svg.createGanttDef
 [ method ]

 * JedoGantt 초기화시 호출되어 svg defs 요소를 생성.

 > Arguments

 - svg   (SVGElement) svg 루트 객체.


 = (null)  
\*/
Object.defineProperty(jedo.svg, "createGanttDef", {
	get: function() {
		return function(svg) {
			
			var defs = svg.append("defs");
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
		};
	},
	enumerable: false,
	configurable: false
});

Object.defineProperty(jedo.svg, "createGanttHeader", {
	get: function() {
		return function(svg, nSvgWidth, nSvgHeaderHeight) {
			
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
			return ganttHeader;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttHeaderBack", {
	get: function() {
		return function(svgGanttHeader, x, y, w, h) {
			
			svgGanttHeader.append('rect')
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
			var svgGanttHeaderBack = svgGanttHeader.select("rect.ganttHeaderBack");
			var node = svgGanttHeaderBack.node();
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
			return svgGanttHeaderBack;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttHeaderDebug", {
	get: function() {
		return function(svgGanttHeader, x, y, w, h) {
			
			svgGanttHeader.append('rect')
						.attr('class', 'ganttHeaderDebug')
						.attr('x', x)
						.attr('y', y)
						.attr('width', w)
						.attr('height', h)
						.style({
							'fill': 'red',
						    'stroke': 'navy',
						    'stroke-width': 0
						});
			var ganttHeaderDebug = svgGanttHeader.select("rect.ganttHeaderDebug");
			var node = ganttHeaderDebug.node();
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
			return ganttHeaderDebug;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createRectHeaderLine", {
	get: function() {
		return function(svgGanttHeader, indexLine, lineMode, arr) {
			
			svgGanttHeader.selectAll('rect.rectheaderLine'+indexLine)
				.data(arr)
				.enter()
				.append('rect')
				.attr('class', 'rectheaderLine'+indexLine)
				.attr('id', function(d){ return d.itemId; })
				.attr('ndx', function(d, i){ return i; })
				.attr('x', function(d){ return d.x; })
				.attr('y', function(d){ return d.y; })
				.attr('width', function(d){ return d.width; })
				.attr('height', function(d){ return d.height; })
				.style({
					fill : 'url(#headerGradient)', 
					stroke : 'navy', 
					'stroke-width' : 0
				});
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createRectHeaderLineTransition", {
	get: function() {
		return function(svgGanttHeader, indexLine, lineMode, arr) {
			
			var count = 0;
			var deferred = $.Deferred();
			svgGanttHeader.selectAll('rect.rectheaderLine'+indexLine)
				.data(arr)
				.enter()
				.append('rect')
				.attr('class', 'rectheaderLine'+indexLine)
				.attr('id', function(d){ return d.itemId; })
				.attr('ndx', function(d, i){ return i; })
				.attr('x', function(d){ return d.x; })
				.attr('y', function(d){ return d.y; })
				.attr('width', function(d){ return d.width; })
				.attr('height', function(d){ return d.height; })
				.style({
					'fill' : 'url(#headerGradient)', 
					'stroke' : 'navy', 
					'stroke-width' : 0 })
				.transition().duration(1000)
				.attr('x',function(d){return d.x2; })
				.attr('width',function(d){ return d.w2; })
				.each("end", function(){
					if(arr.length == ++count) {
						deferred.resolve();
					}
				});
			return deferred.promise();
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createTextHeaderLine", {
	get: function() {
		return function(svgGanttHeader, indexLine, lineMode, arr, options) {
			
			var format = jedo.svg.getTimeFormat(indexLine, lineMode);
			svgGanttHeader.selectAll('text.textheaderLine'+indexLine)
				.data(arr)
				.enter()
				.append('text')
				.attr('class','textheaderLine'+indexLine)
				.attr('id', function(d){ return d.itemId+"T"; })
				.attr('ndx', function(d, i){ return i; })
				.text(function(d){ return format(d.currentDate); })
				.attr('x', function(d){ 
					var bbox = this.getBBox();
					//console.log(bbox);
					var t = (d.width-bbox.width)/2;
					return d.x+t; })
				.attr('y', function(d){ 
					var bbox = this.getBBox();
					//console.log(bbox);
					//console.log("d.y:"+d.y);
					//console.log("d.height:"+d.height);
					return d.y + bbox.height + ((d.height-bbox.height)/3); })
				.attr('width', function(d){ return d.width; })
				.attr('height', function(d){ return d.height; })
				.style({
					'fill': 'red',
					'font-family' : "Verdana",
					'font-size' : options.header.fontSize
				});
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createTextHeaderLineTransition", {
	get: function() {
		return function(svgGanttHeader, indexLine, lineMode, arr, options) {
			
			var count = 0;
			var deferred = $.Deferred();
			var format = jedo.svg.getTimeFormat(indexLine, lineMode);
			svgGanttHeader.selectAll('text.textheaderLine'+indexLine)
				.data(arr)
				.enter()
				.append('text')
				.attr('class','textheaderLine'+indexLine)
				.attr('id', function(d){ return d.itemId+"T"; })
				.attr('ndx', function(d, i){ return i; })
				.text(function(d){
					return format(d.currentDate); })
				.attr('x', function(d){ 
					return d.x; })
				.attr('y', function(d){ 
					return d.y + (d.height - (d.height/3)); })
				.attr('width', function(d){ 
					return d.width; })
				.attr('height', function(d){ 
					return d.height; })
				.style({
					'fill' : 'red',
					'font-family' : "Verdana",
					'font-size' : options.header.fontSize })
				.transition().duration(1000)
				.attr('x',function(d){
					var bbox = this.getBBox();
					var t = (d.w2-bbox.width)/2;
					return d.x2+t; })
				.attr('y', function(d){ 
					var bbox = this.getBBox();
					return d.y2 + bbox.height + ((d.height-bbox.height)/3); })
				.attr('width',function(d){
						return d.w2; })
				.each("end",function(){
					if(arr.length == ++count) {
						deferred.resolve();
					}
				});
			return deferred.promise();
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttBody", {
	get: function() {
		return function(svg, nSvgHeaderHeight, nSvgWidth, nSvgBodyHeight) {
			
			var ganttBody = svg.append('g').attr('class', 'ganttBody');
			ganttBody.append('rect')
				.attr('class', 'ganttBodyBg')
				.attr('x', 1)
				.attr('y', nSvgHeaderHeight+1)
				.attr('width', nSvgWidth)
				.attr('height', nSvgBodyHeight)
				.style({
					'fill': '#FFFFF0',
				    'stroke': 'navy',
				    'stroke-width': 0
				});
			return ganttBody;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "setGanttBodyLine", {
	get: function() {
		return function(svgGanttBody, fnPrevScale, arr, iX) {
			
			if(fnPrevScale) {
				svgGanttBody.selectAll('rect.ganttBodyLine').attr('width', iX);
			} else {
				svgGanttBody.selectAll('rect.ganttBodyLine')
					.data(arr)
					.enter()
					.append('rect')
					.attr('class', 'ganttBodyLine')
					.attr('x', 0)
					.attr('y', function(d){ return d.lineY; })
					.attr('width', iX)
					.attr('height', function(d){ return d.lineHeight; })
					.style('fill', function(d, i){ return i%2 ? '#FFFFF0' : '#F0FFF0'; })
					.style('opacity', 0.7);
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttBodyBar", {
	get: function() {
		return function(svgGanttBody, arr) {
			
			return svgGanttBody.selectAll('g.ganttBar')
								.data(arr)
								.enter()
								.append('g')
								.attr('class', 'gGanttBar')
								.attr('id', function(d){ return "gGanttBar_"+d.id;})
								.attr('dataID', function(d){ return d.id;})
								.attr('dataIndex', function(d,i){ return i;})
								.attr('isParent', function(d){ return d.isParent;})
								.attr('parentId', function(d){ return d.parentId;})
								.attr('ganttBarHeight', function(d){ return d.ganttBarHeight;});
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttMainBar", {
	get: function() {
		return function(svgGanttBodyBar) {
			
			svgGanttBodyBar.append("rect").attr('class', 'rectGanttBar')
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
						'fill': 'url(#ganttBarGradient)', 
						'stroke': '#ff69b4', 
						'stroke-width': 0
					})
					.attr('dataID', function(d){ return d.id; })
					.attr('dataIndex', function(d,i){ return i; });
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttStartMark", {
	get: function() {
		return function(svgGanttBody, id, x, y, w, h) {
			
			var polyData = jedo.JedoGantt.getMarkPoints(x, y, w, h);
			svgGanttBody.select("#gGanttBar_"+id).append("polygon")
					.attr("id", "startMarkGanttBar_"+id)
					.attr("class", "startMarkGanttBar")
			    	.attr("points",function(d) { 
			    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
			    	})
					.style({
						'fill': 'url(#ganttMarkGradient)', 
						'stroke': '#000000', 
						'stroke-width': 1
					})
					.attr('dataID', function(d){ return d.id; })
					.attr('dataIndex', function(d,i){ return i; });
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "createGanttEndMark", {
	get: function() {
		return function(svgGanttBody, id, x, y, w, h) {
			
			var polyData = jedo.JedoGantt.getMarkPoints(x, y, w, h);
			svgGanttBody.select("#gGanttBar_"+id).append("polygon")
					.attr("id", "endMarkGanttBar_"+id)
					.attr("class", "endMarkGanttBar")
					.attr("points",function(d) { 
						return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
					})
					.style({
						'fill': 'url(#ganttMarkGradient)', 
						'stroke': '#000000', 
						'stroke-width': 1
					})
					.attr('dataID', function(d){ return d.id; })
					.attr('dataIndex', function(d,i){ return i; });
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "changeGanttBodyBar", {
	get: function() {
		return function(svgGanttBody, arr) {
			
			var count = 0;
			var deferred = $.Deferred();
			
			try {
				arr.forEach(function(o,i){
					svgGanttBody.selectAll("#rectGanttBar_"+o.id+", #startMarkGanttBar_"+o.id+", #endMarkGanttBar_"+o.id)
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
								
								var polyData = jedo.JedoGantt.getMarkPoints(o.x2, o.y1, o.w2, o.h1);
								return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
							} else if(oThis.attr("id") == "endMarkGanttBar_"+o.id) {
								
								var polyData = jedo.JedoGantt.getMarkPoints(o.x2+o.w2, o.y1, o.w2, o.h1);
								return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
							} 
							return null;
						})
						.each("end",function(){
							if(arr.length == ++count) {
								deferred.resolve();
							}
						});
				});
				
			} finally {
				return deferred.promise();
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "setGanttBodyBar", {
	get: function() {
		return function(svgGanttBody, fnPrevScale, arr, iX, oJedoGantt) {
			
			var count = 0;
			var deferred = $.Deferred();
			if(fnPrevScale) {
				var promise = jedo.svg.changeGanttBodyBar(svgGanttBody, arr);
				$.when(promise).done(function(result){
					deferred.resolve(result);
				});
			} else {
				var svgGanttBodyBar = jedo.svg.createGanttBodyBar(svgGanttBody, arr);
				jedo.svg.createGanttMainBar(svgGanttBodyBar);
				svgGanttBodyBar.each(function(d,i){
					//console.log("d.id:"+d.id+" d.isParent:"+d.isParent);
					if(d.isParent) {
						// start Group Mark.
						jedo.svg.createGanttStartMark(svgGanttBody, d.id, d.x1, d.y1, d.w1, d.h1);
						// end group Mark.
						jedo.svg.createGanttEndMark(svgGanttBody, d.id, d.x1+d.w1, d.y1, d.w1, d.h1);
					}
				});
				deferred.resolve();
			}
			return deferred.promise();
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "appendGanttWidth", {
	get: function() {
		return function(svg, nAppendWidth) {
			
			var nSvgToWidth = parseInt(svg.attr("width"),10)+nAppendWidth;
			svg.attr("width", nSvgToWidth);
			svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg, rect.ganttBodyLine').attr('width',nSvgToWidth);
			return nSvgToWidth;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "insertGanttWidth", {
	get: function() {
		return function(svg, nInsertWidth) {
			
			var nSvgToWidth = parseInt(svg.attr("width"),10)+nInsertWidth;
			svg.attr("width", nSvgToWidth);
			svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg, rect.ganttBodyLine').attr('width',nSvgToWidth);
			jedo.svg.moveGanttObject(svg, nInsertWidth);
			return nSvgToWidth;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "moveGanttObject", {
	get: function() {
		return function(svg, nMoveWidth) {
			svg.selectAll('rect[class^="rectheaderLine"], text[class^="textheaderLine"],  rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar')
				.attr("x", function(){
					if(this.nodeName == "rect" || this.nodeName == "text") {
						return nMoveWidth+parseInt(this.getAttribute("x"));
					}})
				.attr("points", function(){
					if(this.nodeName == "polygon") {
						var sPoints = this.getAttribute("points");
						var points = sPoints.split(" ").map(function(s){ return s.split(","); });
						points[0][0] = parseInt(points[0][0]) + nMoveWidth;
						points[1][0] = parseInt(points[1][0]) + nMoveWidth;
						points[2][0] = parseInt(points[2][0]) + nMoveWidth;
						points[3][0] = parseInt(points[3][0]) + nMoveWidth;
						points[4][0] = parseInt(points[4][0]) + nMoveWidth;
						return points.map(function(a){ return a[0]+","+a[1]; }).reduce(
								function(previousValue, currentValue, index, array) {
							  return previousValue + " " + currentValue;
						});
					}
				});
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.svg, "appendHeaderLine", {
	get: function() {
		
		return function(svgGanttHeader, options, headerDatas, indexLine, lineMode, nSvgWidth) {
			svgGanttHeader.selectAll('rect.newrectheaderLine')
			.data(headerDatas)
			.enter()
			.append('rect')
			.attr('class', 'rectheaderLine'+indexLine)
			.attr('id', function(d){ return d.itemId; })
			.attr('ndx', function(d, i){ return i; })
			.attr('x', function(d){
				return nSvgWidth+d.x; })
			.attr('y', function(d){ return d.y; })
			.attr('width', function(d){ return d.width; })
			.attr('height', function(d){ return d.height; })
			.style({
				fill : 'url(#headerGradient)', //'#DA70D6', 
				stroke : 'navy', 
				'stroke-width' : 0 });
		
		var format = jedo.svg.getTimeFormat(indexLine, lineMode);
		svgGanttHeader.selectAll('text.newtextheaderLine')
			.data(headerDatas)
			.enter()
			.append('text')
			.attr('class','textheaderLine'+indexLine)
			.attr('id', function(d){ return d.itemId+"T"; })
			.attr('ndx', function(d, i){ return i; })
			.text(function(d){ return format(d.currentDate); })
			.attr('x', function(d){ 
				var bbox = this.getBBox();
				//console.log(bbox);
				var t = (d.width-bbox.width)/2;
				return nSvgWidth+d.x+t; })
			.attr('y', function(d){ 
				var bbox = this.getBBox();
				return d.y + bbox.height + ((d.height-bbox.height)/3); })
			.attr('width', function(d){ return d.width; })
			.attr('height', function(d){ return d.height; })
			.style({
				'fill': 'blue',
				'font-family' : "Verdana",
				'font-size' : options.header.fontSize });
			
		}
	},
	enumerable: false,
	configurable: false
});






}//if(!window.hasOwnProperty("jedo")) {

