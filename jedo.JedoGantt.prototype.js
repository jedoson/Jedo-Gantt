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

if(!jedo.JedoGantt.prototype.hasOwnProperty("initJedoGantt")) {

/*\
 * jedo.JedoGantt.prototype.initJedoGantt
 [ method ]

 * JedoGantt 초기화 함수

 > Arguments

 - nSvgWidth   (number) SVG 화면폭.


 = (function) function of returned 
\*/
Object.defineProperty(jedo.JedoGantt.prototype, "initJedoGantt", {
	get: function() {
		return function(nSvgWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.initJedoGantt -- ");
			
			jedo.svg.createGanttDef(this.svg);
			
		    var oFnScale = jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, nSvgWidth);
		    var nDateViewMode = jedo.JedoGantt.getDateViewMode(this.options, oFnScale);
		    //console.log("sDateViewMode:"+jedo.JedoGantt.getViewModeString(nDateViewMode));
		    this.setSettingGanttData(new jedo.JedoGantt.SettingGanttData(nDateViewMode, 0, nSvgWidth, oFnScale));
		    //console.log("nDateViewMode["+nDateViewMode+"] nSvgToWidth["+nSvgWidth+"]");
			
			var options = this.options;
			var nSvgWidth = this.svg.attr('width');
			var nSvgHeight = this.svg.attr('height');
			var nSvgHeaderHeight = options.header.lineHeight*options.header.viewLineCount;
			var nSvgBodyHeight = options.lineHeight*options.ganttData.length;
			
			
			this.pushGanttWidth(nSvgWidth);
			
			jedo.svg.createGanttBody(this.svg, nSvgHeaderHeight, nSvgWidth, nSvgBodyHeight);
			jedo.svg.createGanttHeader(this.svg, nSvgWidth, nSvgHeaderHeight);
			
			var promise1 = this.changeGanttBodyViewMode(nSvgWidth, nSvgWidth);
			var promise2 = this.changeGanttHeaderViewMode(nSvgWidth, nSvgWidth);

			var svg = this.svg;
			var oJedoGantt = this;
			var oGanttContainer = $(this.ganttContainer);
			$.when(promise1, promise2).done(function(){
				oGanttContainer.on("scroll", function(event){
					svg.select('g.ganttHeader').attr('transform', 'translate(0,'+$(this).scrollTop()+')');
					svg.select('rect.ganttHeaderBack').attr('transform', 'translate('+$(this).scrollLeft()+',0)');
				});
				svg.node().addEventListener("mousemove",oJedoGantt.onMouseMoveBar.bind(oJedoGantt),false);
				svg.node().addEventListener("mouseup",  oJedoGantt.onMouseUpBar.bind(oJedoGantt),  false);
			});
			
			//console.log("e -- jedo.JedoGantt.prototype.initJedoGantt -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttViewMode", {
	get: function() {
		return function(svgPoint, nDateViewMode, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			//console.log("nDateViewMode:"+jedo.JedoGantt.getViewModeString(nDateViewMode));
			//console.log("now this.dateViewMode:"+this.dateViewMode);
			
			var deferred = $.Deferred();
			
			if(jedo.VIEW_MODE.MIL < nDateViewMode) {
				console.debug("nHeaderDateViewMode["+nDateViewMode+"] is bad");
				deferred.resolve();
				return deferred.promise();
			}
			
			try {
				
				var nSvgWidth = this.svg.attr("width");
				var bDataViewMode = this.isGanttData(nDateViewMode, nSvgWidth, nSvgToWidth);
				//console.log("bDataViewMode:"+bDataViewMode);
				//console.log("nDateViewMode["+nDateViewMode+"]");
				if(!bDataViewMode) {
					var oFnScale = jedo.getFnScale(this.options.startGanttDate, this.options.endGanttDate, 0, nSvgToWidth);
					this.setSettingGanttData(new jedo.JedoGantt.SettingGanttData(nDateViewMode, nSvgWidth, nSvgToWidth, oFnScale));
				} else {
					this.changePrevDateViewMode();
				}
				//this.svg.attr("width", nSvgToWidth);
				//this.svg.select('rect.ganttHeaderBg').attr('width', nSvgToWidth);
				//this.svg.select('rect.ganttBodyBg').attr('width', nSvgToWidth);
				
				
				this.svg.transition().duration(1000)
					.attr('width',function(d, i, a){
						return nSvgToWidth;
					});
				this.svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg')
					.transition().duration(1000)
					.attr('width',function(d){
						return nSvgToWidth;
					});
				//console.log("nDateViewMode["+nDateViewMode+"] nSvgWidth["+nSvgWidth+"] nSvgToWidth["+nSvgToWidth+"]");
				
				var promise1 = this.changeGanttBodyViewMode(nSvgWidth, nSvgToWidth);
				var promise2 = this.changeGanttHeaderViewMode(nSvgWidth, nSvgToWidth);
				promise2.then(null, null, function(o){
					deferred.notify(o);
				});
				$.when(promise1, promise2).done(function(){
					deferred.resolve();
				});
				return deferred.promise();
			} finally {
				
				//console.log("e -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttHeaderViewMode", {
	get: function() {
		return function(nSvgWidth, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
			
			var deferred = $.Deferred();
			var _arrDeferred = [];
			var _arrPromise = [];
			
			var oJedoWorker = {};
			var _oJedoGantt = this;
			var i = 0;
			
			try {
				var nHeaderLineCount = this.options.header.viewLineCount;
				for(i=0; i<nHeaderLineCount; i++) {
					_arrDeferred[i] = $.Deferred();
					var nLineMode = this.dateViewMode-(nHeaderLineCount-(i+1));
					//console.log("nLineMode:"+jedo.JedoGantt.getViewModeString(nLineMode));
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
				    			var promise = _oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
				    			promise.then(null, null, function(o){
				    				deferred.notify(o);
				    			});
				    			$.when(promise).done(function(){
				    				_arrDeferred[event.data.indexLine].resolve();
				    			});
				    			break;
				    		} 
				    	}, false);
					} else {
						var promise = _oJedoGantt.setHeaderLineMode(i, nLineMode, arr);
						$.when(promise).done(function(){
							_arrDeferred[i].resolve();
						});
					}
					_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();
				}
				
				$.when.apply($, _arrPromise).done(function(){
					_oJedoGantt.createGanttHeaderBack();
					deferred.resolve();
				});
				
				//console.log("e -- jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
			} catch (e) {
				
				deferred.reject(e);
				
			} finally {
				return deferred.promise();
			}
			
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttBodyViewMode", {
	get: function() {
		return function(nSvgWidth, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
			//console.debug("nSvgToWidth:"+nSvgToWidth);
			var deferred = $.Deferred();
			if(!this.ganttBodyData) {
				var jedoWorker = new Worker("jedo.JedoWorker.js");
				jedoWorker.postMessage({
					"cmd": "SettingBodyGanttBarData",
					"options": this.options,
					"startGanttDate": this.options.startGanttDate,
					"endGanttDate": this.options.endGanttDate,
					"nPrevWidth": nSvgWidth,
					"nToWidth": nSvgToWidth
				});
				var _oJedoGantt = this;
				jedoWorker.addEventListener("message", function(event){
					switch(event.data.cmd) {
					case "SettingBodyGanttBarData":
						//console.log("s -- message - jedoWorker.SettingBodyGanttBarData --- ");
						_oJedoGantt.ganttBodyData = event.data.ganttBodyBarDatas;
						$.when(_oJedoGantt.setBodyGanttBar(event.data.ganttBodyBarDatas)).done(function(){
							deferred.resolve();
						});
						//console.log("e -- message - jedoWorker.SettingBodyGanttBarData --- ");
						break;
					} 
				}, false);
			} else {
				this.setBodyGanttBar(this.ganttBodyData);
				deferred.resolve();
			}
			return deferred.promise();
			//console.log("e -- jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "createGanttHeaderBack", {
	get: function() {
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
			this.svg.select("rect.ganttHeaderBack").remove();
			var lH = this.options.header.lineHeight;
			var x = (lH/5);
			var y = (lH/5);
			var w = (lH/5)*3;
			var h = (lH/5)*3;
			var svgGanttHeaderBack = jedo.svg.createGanttHeaderBack(this.svg.select("g.ganttHeader"), x, y, w, h);
			var oJedoGantt = this;
			svgGanttHeaderBack.node().addEventListener("mousedown", oJedoGantt.onMouseDownChangePrevViewMode.bind(oJedoGantt), false);
			
			//console.log("e -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "setBodyGanttBar", {
	get: function() {
		return function(arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setBodyGanttBar  --");
			
			var deferred = $.Deferred();
			var iX = this.fnScale(this.options.endGanttDate, jedo.DATE_SCALE_TYPE_END);
			jedo.svg.setGanttBodyLine(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX);
			var promise = jedo.svg.setGanttBodyBar(this.svg.select('g.ganttBody'), this.fnPrevScale, arr, iX, this);
			$.when(promise).done(function(){
				deferred.resolve();
			});
			
			if(!this.fnPrevScale) {
				var oJedoGantt = this;
				this.svg.select('g.ganttBody').selectAll("rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar")
					.each(function(){
						this.addEventListener("mouseover", oJedoGantt.onMouseOverGanttBar.bind(oJedoGantt), false);
						//this.addEventListener("mouseout",  oJedoGantt.mouseOutBar.bind(oJedoGantt),  false);
						this.addEventListener("mousedown", oJedoGantt.onMouseDownGanttBar.bind(oJedoGantt), false);
					});
				
				this.svg.selectAll('rect.ganttBodyLine').each(function(){
					this.addEventListener("mousedown", oJedoGantt.onMouseDownGanttLine.bind(oJedoGantt), false);
					this.addEventListener("mousemove", oJedoGantt.onMouseMoveGanttLine.bind(oJedoGantt), false);
					this.addEventListener("mouseup", oJedoGantt.onMouseUpGanttLine.bind(oJedoGantt), false);
				});
			}
			
			return deferred.promise();
			//console.log("e -- jedo.JedoGantt.prototype.setBodyGanttBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "setHeaderLineMode", {
	get: function() {
		return function(indexLine, lineMode, arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
			//console.log("indexLine:"+indexLine+" lineMode:"+jedo.JedoGantt.getViewModeString(lineMode));
			
			var deferred = $.Deferred();
			
			this.svg.selectAll('rect.rectheaderLine'+indexLine+', '+'text.textheaderLine'+indexLine).remove();
			
			var svgGanttHeader = this.svg.select("g.ganttHeader");
			if(this.fnPrevScale) {
				
				var promise1 = jedo.svg.createRectHeaderLineTransition(svgGanttHeader, indexLine, lineMode, arr);
				var promise2 = jedo.svg.createTextHeaderLineTransition(svgGanttHeader, indexLine, lineMode, arr, this.options);
				promise2.then(null, null, function(o){
					deferred.notify(o);
				});
				$.when(promise1, promise2).done(function(){
					deferred.resolve();
				});
				
			} else {
				
				jedo.svg.createRectHeaderLine(svgGanttHeader, indexLine, lineMode, arr);
				jedo.svg.createTextHeaderLine(svgGanttHeader, indexLine, lineMode, arr, this.options);
				
				deferred.resolve();
			}

			var oJedoGant = this;
			var options = this.options;
			this.svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
				.each(function(){
					if(indexLine+1 === options.header.viewLineCount) {
						this.addEventListener("mouseup", oJedoGant.onMouseUpGanttHeader.bind(oJedoGant),false);
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
			return deferred.promise();
			//console.log("e -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
		};
	},
	enumerable: false,
	configurable: false
});









}//if(!jedo.hasOwnProperty("JedoGantt")) {

