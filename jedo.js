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
	var x = d3.scale.linear()
					.domain([nSTime, nETime])
					.range([nSpx, nEpx]);
	return function (oDate, pDateScaleType){
		return x(oDate.getTime());
	};
};
window.jedo.getTime = function(oSDate, oEDate, nSpx, nEpx, xClient) {
	return ((oEDate.getTime()-oSDate.getTime())/(nEpx-nSpx))*xClient;
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
window.jedo.getTimeFormat = function(indexLine, lineMode) {
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
		format = d3.time.format("%d");
	} else if(lineMode === window.jedo.HOUR) {
		format = d3.time.format("%H");
	} else {
		throw new TypeError("lineMode["+lineMode+"] is bad");
	}
	return format;
};
window.jedo.createRectHeaderLine = function(svgGanttHeader, indexLine, lineMode, arr) {
	
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
};
window.jedo.createRectHeaderLineTransition = function(svgGanttHeader, indexLine, lineMode, arr) {
	
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
		var iWeekNo = d3.time.format("%U")(oDate);
		return sLineId+"_"+oDate.getFullYear()+"_"+iWeekNo;
	} else if(lineMode === window.jedo.DATE) {
		return sLineId+"_"+oDate.getFullYear()+"_"+oDate.getDate();
	} else if(lineMode === window.jedo.HOUR) {
		return sLineId+"_"+d3.time.format("%Y-%m-%d")(oDate)+"_"+oDate.getHours();
	} else {
		throw Error("lineMode is bad");
	}
};
window.jedo.createTextHeaderLine = function(svgGanttHeader, indexLine, lineMode, arr, options) {
	
	var format = window.jedo.getTimeFormat(indexLine, lineMode);
	svgGanttHeader.selectAll('text.textheaderLine'+indexLine)
		.data(arr)
		.enter()
		.append('text')
		.attr('class','textheaderLine'+indexLine)
		.text(function(d){ return format(d.currentDate); })
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
};
window.jedo.createTextHeaderLineTransition = function(svgGanttHeader, indexLine, lineMode, arr, options) {
	
	var format = window.jedo.getTimeFormat(indexLine, lineMode);
	svgGanttHeader.selectAll('text.textheaderLine'+indexLine)
		.data(arr)
		.enter()
		.append('text')
		.attr('class','textheaderLine'+indexLine)
		.text(function(d){
			return format(d.currentDate); 
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
};
window.jedo.setGanttBodyLine = function(svgGanttBody, fnPrevScale, arr, iX) {
	
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
			.style('fill', function(d, i){ return i%2 ? '#FFFFF0' : '#F0FFF0'; });
	}
};
window.jedo.setGanttBodyBar = function(svgGanttBody, fnPrevScale, arr, iX, oJedoGantt) {
	
	if(fnPrevScale) {
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
						
						var polyData = oJedoGantt.getMarkPoints(o.x2, o.y1, o.w2, o.h1);
						return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
					} else if(oThis.attr("id") == "endMarkGanttBar_"+o.id) {
						
						var polyData = oJedoGantt.getMarkPoints(o.x2+o.w2, o.y1, o.w2, o.h1);
						return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
					} 
					return null;
				});
		});
		
	} else {
		var aGanttBodyBar = svgGanttBody.selectAll('g.ganttBar')
							.data(arr)
							.enter()
							.append('g')
							.attr('class', 'gGanttBar')
							.attr('id', function(d){ return "gGanttBar_"+d.id})
							.attr('dataID', function(d){ return d.id})
							.attr('isParent', function(d){ return d.isParent})
							.attr('parentId', function(d){ return d.parentId})
							.attr('ganttBarHeight', function(d){ return d.ganttBarHeight});
		
		aGanttBodyBar.append("rect").attr('class', 'rectGanttBar')
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
							.attr('dataID', function(d){ return d.id});
		
		

		aGanttBodyBar.each(function(d,i){
			//console.log("d.id:"+d.id+" d.isParent:"+d.isParent);
			if(d.isParent) {
				// start Group Mark.
				var polyData = oJedoGantt.getMarkPoints(d.x1, d.y1, d.w1, d.h1);
				svgGanttBody.select("#gGanttBar_"+d.id).append("polygon")
						.attr("id", "startMarkGanttBar_"+d.id)
						.attr("class", "startMarkGanttBar")
				    	.attr("points",function(d) { 
				    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
				    	})
						.style({
							'fill': 'url(#ganttMarkGradient)', 
							'stroke': '#000000', 
							'stroke-width': 1
						})
						.attr('dataID', function(d){ return d.id});
				
				// end group Mark.
				polyData = oJedoGantt.getMarkPoints(d.x1+d.w1, d.y1, d.w1, d.h1);
				svgGanttBody.select("#gGanttBar_"+d.id).append("polygon")
						.attr("id", "endMarkGanttBar_"+d.id)
						.attr("class", "endMarkGanttBar")
				    	.attr("points",function(d) { 
				    		return polyData.map(function(d){ return [d.x,d.y].join(",");}).join(" "); 
				    	})
						.style({
							'fill': 'url(#ganttMarkGradient)', 
							'stroke': '#000000', 
							'stroke-width': 1
						})
						.attr('dataID', function(d){ return d.id});
			}
		});
	}
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

