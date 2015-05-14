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

 * JedoGantt 초기화 함수(처음실행시 한번만 실행됨.)

 > Arguments

 - nSvgWidth   (number) SVG 화면폭.


 = (function) function of returned 
\*/
Object.defineProperty(jedo.JedoGantt.prototype, "initJedoGantt", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.initJedoGantt -- ");
			
			jedo.svg.createGanttDef(_svg);
			
			var nSvgWidth = _svg.attr('width');
			var nSvgHeight = _svg.attr('height');
			
			// ------------------------------------------------------------------------------------------- //
			// jedo.gantt 설정.
			Object.defineProperty(jedo.gantt, "VIEW_WIDTH", {
				enumerable: false,
				configurable: false,
				writable: false,
				value: parseInt(nSvgWidth)
			});
			
			// ------------------------------------------------------------------------------------------- //

		    var oFnScale = jedo.getFnScale(_options.startGanttDate, _options.endGanttDate, 0, nSvgWidth);
		    var nDateViewMode = jedo.JedoGantt.getDateViewMode(_options, oFnScale);

		    _settingConfig.setSettingGanttData(
		    		new jedo.JedoGantt.SettingGanttData(
		    				nDateViewMode, nSvgWidth, nSvgWidth, 
		    				new Date(_options.startGanttDate.getTime()),
		    				new Date(_options.endGanttDate.getTime())
		    			));
		    _settingConfig.pushGanttWidth(nSvgWidth);
		    
		    var nSvgBodyHeight = _options.lineHeight*_options.ganttData.length;
			var nSvgHeaderHeight = _options.header.lineHeight*_options.header.viewLineCount;

			jedo.svg.createGanttBody(_svg, nSvgHeaderHeight, nSvgWidth, nSvgBodyHeight);
			jedo.svg.createGanttHeader(_svg, nSvgWidth, nSvgHeaderHeight);

			$.when(	_oJedoGantt.changeGanttBodyViewMode(), 
					_oJedoGantt.changeGanttHeaderViewMode())
					.done(function(){
						_oGanttContainer.on("scroll", _oJedoGantt.onScrollTimeFixedElement.bind(_oJedoGantt));
						_oGanttContainer.on("scroll", _oJedoGantt.onScrollGanttContainer.bind(_oJedoGantt));
						_svg.node().addEventListener("mousemove",_oJedoGantt.onMouseMoveBar.bind(_oJedoGantt),false);
						_svg.node().addEventListener("mouseup",  _oJedoGantt.onMouseUpBar.bind(_oJedoGantt),  false);
					});
			//console.log("e -- jedo.JedoGantt.prototype.initJedoGantt -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttViewMode", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		
		return function(svgPoint, nToDateViewMode, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			//console.log("nDateViewMode:"+jedo.JedoGantt.getViewModeString(nDateViewMode));
			//console.log("now this.dateViewMode:"+this.dateViewMode);
			
			var deferred = $.Deferred();
			try {
				if(jedo.VIEW_MODE.MIL < nToDateViewMode) {
					console.debug("nHeaderDateViewMode["+nToDateViewMode+"] is bad");
					deferred.resolve();
				} else {
					_svg.transition().duration(1000).delay(100).attr('width',nSvgToWidth);
					_svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg').attr('width',nSvgToWidth);
					var nSvgWidth = _settingConfig.svgWidth;
					var bDataViewMode = _settingConfig.isGanttData(nToDateViewMode, nSvgWidth, nSvgToWidth);
					if(!bDataViewMode) {

						
						/*
						 * 보여지진 시작 시간값과 마지막 시간값을 조정할 필요가 있을거 같다.
						 */
						_settingConfig.setSettingGanttData(
								new jedo.JedoGantt.SettingGanttData(
										nToDateViewMode, nSvgWidth, nSvgToWidth, 
										new Date(_settingConfig.dateViewStart.getTime()),
					    				new Date(_settingConfig.dateViewEnd.getTime())
									));
					} else {
						_settingConfig.changePrevDateViewMode();
					}
					$.when( _oJedoGantt.changeGanttBodyViewMode(), 
							_oJedoGantt.changeGanttHeaderViewMode())
							.done(function(){
						deferred.resolve();
					});
				}
				//console.log("e -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			} finally {
				return deferred.promise();
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttHeaderViewMode", {
	get: function() {
		
		var _oJedoGantt = this;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		
		var nHeaderLineCount = _options.header.viewLineCount;
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
			
			var deferred = $.Deferred();
			var _arrDeferred = [];
			var _arrPromise = [];
			var oJedoWorker = {};
			
			try {
				var nDataViewMode = _oJedoGantt.settingConfig.dateViewMode;
				
				for(var i=0; i<nHeaderLineCount; i++) {
					_arrDeferred[i] = $.Deferred();
					var nLineMode = nDataViewMode-(nHeaderLineCount-(i+1));
					//console.log("nLineMode:"+jedo.JedoGantt.getViewModeString(nLineMode));
					var arr = _oJedoGantt.settingConfig.getGanttHeaderData(i, nLineMode);
					if(arr == null) {
						
						oJedoWorker["jedoWorker"+i] = new Worker("jedo.JedoWorker.js");
				    	oJedoWorker["jedoWorker"+i].postMessage({
				    		"cmd": "SettingHeaderGanttData",
				    		"options": _options,
				    		"dateViewStart": _settingConfig.dateViewStart,
							"dateViewEnd": _settingConfig.dateViewEnd,
				    		"indexLine": i,
				    		"lineMode": nLineMode,
				    		"nPrevWidth": _settingConfig.svgPrevWidth,
				    		"nToWidth": _settingConfig.svgWidth
				    	});
				    	oJedoWorker["jedoWorker"+i].addEventListener("message", function(event){
				    		switch(event.data.cmd) {
				    		case "SettingHeaderGanttData":
				    			_oJedoGantt.settingConfig.setGanttHeaderData(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
				    			var promise = _oJedoGantt.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
				    			$.when(promise).done(function(){
				    				_arrDeferred[event.data.indexLine].resolve();
				    			});
				    			break;
				    		} 
				    	}, false);
					} else {
						$.when(_oJedoGantt.setHeaderLineMode(i, nLineMode, arr)).done(function(idx){
							_arrDeferred[idx].resolve();
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
Object.defineProperty(jedo.JedoGantt.prototype, "setHeaderLineMode", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var _viewLineCount = _options.header.viewLineCount;
		
		return function(indexLine, lineMode, arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
			//console.log("indexLine:"+indexLine+" lineMode:"+jedo.JedoGantt.getViewModeString(lineMode));
			//console.log("_options.header.viewLineCount["+_viewLineCount+"]");
			
			var deferred = $.Deferred();
			try {
				_svg.selectAll('rect.rectheaderLine'+indexLine+', '+'text.textheaderLine'+indexLine).remove();
				
				if(_settingConfig.fnPrevScale) {
					$.when(	jedo.svg.createRectHeaderLineTransition(_svgGanttHeader, indexLine, lineMode, arr), 
							jedo.svg.createTextHeaderLineTransition(_svgGanttHeader, indexLine, lineMode, arr, _options))
							.done(function(){
						deferred.resolve(indexLine);
					});
				} else {
					jedo.svg.createRectHeaderLine(_svgGanttHeader, indexLine, lineMode, arr);
					jedo.svg.createTextHeaderLine(_svgGanttHeader, indexLine, lineMode, arr, _options);
					deferred.resolve(indexLine);
				}
				_svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
					.each(function(){
						if(indexLine+1 === _viewLineCount) {
							this.addEventListener("mouseup", function(event){
								_oJedoGantt.onMouseUpGanttHeader.call(_oJedoGantt, event);
							}, false);
						} 
						this.addEventListener("mouseover", function(event){
							d3.select(this).style({'stroke-width':2});
						},false);
						this.addEventListener("mouseout", function(event){
							d3.select(this).style({'stroke-width':0});
						},false);
					});
				
				//console.log("e -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
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
		
		
		var _oJedoGantt = this;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
			//console.debug("nSvgToWidth:"+nSvgToWidth);
			
			var deferred = $.Deferred();
			
			try {
				if(!_settingConfig.ganttBodyData) {
					var jedoWorker = new Worker("jedo.JedoWorker.js");
					jedoWorker.postMessage({
						"cmd": "SettingBodyGanttBarData",
						"options": _options,
						"dateViewStart": _settingConfig.dateViewStart,
						"dateViewEnd": _settingConfig.dateViewEnd,
						"nPrevWidth": _settingConfig.svgPrevWidth,
						"nToWidth": _settingConfig.svgWidth
					});
					jedoWorker.addEventListener("message", function(event){
						switch(event.data.cmd) {
						case "SettingBodyGanttBarData":
							//console.log("s -- message - jedoWorker.SettingBodyGanttBarData --- ");
							_settingConfig.ganttBodyData = event.data.ganttBodyBarDatas;
							$.when(_oJedoGantt.setBodyGanttBar(event.data.ganttBodyBarDatas)).done(function(){
								deferred.resolve();
							});
							//console.log("e -- message - jedoWorker.SettingBodyGanttBarData --- ");
							break;
						} 
					}, false);
				} else {
					this.setBodyGanttBar(_settingConfig.ganttBodyData);
					deferred.resolve();
				}
				//console.log("e -- jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
			} finally {
				return deferred.promise();
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "createGanttHeaderBack", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
			_svg.select("rect.ganttHeaderBack").remove();
			var lH = _options.header.lineHeight;
			var x = (lH/5);
			var y = (lH/5);
			var w = (lH/5)*3;
			var h = (lH/5)*3;
			jedo.svg.createGanttHeaderBack(_svg.select("g.ganttHeader"), x, y, w, h)
				.node().addEventListener("mousedown", _oJedoGantt.onMouseDownChangePrevViewMode.bind(_oJedoGantt), false);
			
			//console.log("e -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "setBodyGanttBar", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _svgGanttBody = _svg.select('g.ganttBody');
		
		return function(arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setBodyGanttBar  --");
			
			var deferred = $.Deferred();
			
			try {
				var iX = _settingConfig.fnScale(_options.endGanttDate, jedo.DATE_SCALE_TYPE_END);
				jedo.svg.setGanttBodyLine(_svgGanttBody, _settingConfig.fnPrevScale, arr, iX);
				$.when(jedo.svg.setGanttBodyBar(_svgGanttBody, _settingConfig.fnPrevScale, arr, iX, this)).done(function(){
					deferred.resolve();
				});
				if(!_settingConfig.fnPrevScale) {
					
					_svgGanttBody.selectAll("rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar")
						.each(function(){
							this.addEventListener("mouseover", _oJedoGantt.onMouseOverGanttBar.bind(_oJedoGantt), false);
							this.addEventListener("mousedown", _oJedoGantt.onMouseDownGanttBar.bind(_oJedoGantt), false);
						});
					
					_svg.selectAll('rect.ganttBodyLine').each(function(){
						this.addEventListener("mousedown", _oJedoGantt.onMouseDownGanttLine.bind(_oJedoGantt), false);
						this.addEventListener("mousemove", _oJedoGantt.onMouseMoveGanttLine.bind(_oJedoGantt), false);
						this.addEventListener("mouseup", _oJedoGantt.onMouseUpGanttLine.bind(_oJedoGantt), false);
					});
				}
				
				//console.log("e -- jedo.JedoGantt.prototype.setBodyGanttBar  --");
			} finally {
				return deferred.promise();
			}
			
			
		};
	},
	enumerable: false,
	configurable: false
});
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
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		var nETime = _options.endGanttDate.getTime();
		var nSTime = _options.startGanttDate.getTime();
		var nVTime = nETime - nSTime;
		var _H_VIEW_BOX = _svg.attr("height");
		
		return function (nSvgToWidth, oClickDate, nClientX) {
			//console.log("s -- jedo.JedoGantt.prototype.changeScrollGanttContainer  --");
			//console.log("nSvgToWidth["+nSvgToWidth+"] oClickDate["+oClickDate.toISOString()+"] nClientX["+nClientX+"]");

			var nTime = oClickDate.getTime()-nSTime;
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					
					var w = _svg.attr("width");
					var nClickX = (w/nVTime)*nTime;
					var nTScroll = nClickX - nClientX;
					_oGanttContainer.scrollLeft(nTScroll);
					//console.log("nTScroll["+nTScroll+"] nClickX["+nClickX+"] w["+w+"] nVTime["+nVTime+"] nTime["+nTime+"]");
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
Object.defineProperty(jedo.JedoGantt.prototype, "appendLastViewDate", {
	get: function() {
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var nHeaderLineCount = _options.header.viewLineCount;
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.appendLastViewDate -- ");
			
			var deferred = $.Deferred();
			
			try {
				//console.log("_settingConfig.dateViewStart["+_settingConfig.dateViewStart.toISOString()+"] _settingConfig.dateViewEnd["+_settingConfig.dateViewEnd.toISOString()+"]")
				var nSTime = _settingConfig.dateViewStart.getTime();
				var nETime = _settingConfig.dateViewEnd.getTime();
				var nWTime = _settingConfig.fnTime(jedo.gantt.VIEW_WIDTH).getTime() - nSTime;
				var dateViewStart = new Date(nETime);
				dateViewStart.setSeconds(dateViewStart.getSeconds()+1, 0);
				var dateViewEnd = new Date(nETime+nWTime);
				
				var nSvgToWidth = _settingConfig.svgWidth+jedo.gantt.VIEW_WIDTH;
				_svg.attr("width", nSvgToWidth);
				_svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg, rect.ganttBodyLine').attr('width',nSvgToWidth);
				
				var _arrDeferred = [];
				var _arrPromise = [];
				var oJedoWorker = {};
				
				var nSvgWidth = _settingConfig.svgWidth;
				
				var nDataViewMode = _settingConfig.dateViewMode;
				for(var i=0; i<nHeaderLineCount; i++) {
					
					_arrDeferred[i] = $.Deferred();
					
					var nLineMode = nDataViewMode-(nHeaderLineCount-(i+1));
					oJedoWorker["jedoWorker"+i] = new Worker("jedo.JedoWorker.js");
			    	oJedoWorker["jedoWorker"+i].postMessage({
			    		"cmd": "SettingAddHeaderGanttData",
			    		"options": _options,
			    		"dateViewStart": dateViewStart,
						"dateViewEnd": dateViewEnd,
			    		"indexLine": i,
			    		"lineMode": nLineMode,
			    		"nToWidth": jedo.gantt.VIEW_WIDTH
			    	});
			    	oJedoWorker["jedoWorker"+i].addEventListener("message", function(event){
			    		switch(event.data.cmd) {
			    		case "SettingAddHeaderGanttData":
			    			//console.log("s -- jedo.JedoGantt.prototype.addViewDate - SettingAddHeaderGanttData -- ");
			    			
			    			var indexLine = event.data.indexLine;
			    			var lineMode = event.data.lineMode;
			    			var headerDatas = event.data.ganttHeaderDatas;
			    			
			    			var itemId = event.data.ganttHeaderDatas[0].itemId;
			    			var svgRectHeader = _svgGanttHeader.select('#'+itemId);
			    			var svgTextHeader = _svgGanttHeader.select('#'+itemId+"T");
			    			//console.log("itemId["+itemId+"] svgRectHeader.size():"+svgRectHeader.size());
			    			if(0 < svgRectHeader.size()) {
			    				var elm = event.data.ganttHeaderDatas.shift();
			    				
			    				var x1 = parseInt(svgRectHeader.attr('x'),10);
			    				var w1 = parseInt(svgRectHeader.attr('width'),10);
			    				var x2 = nSvgWidth+parseInt(elm.x,10);
			    				var w2 = parseInt(elm.width,10);
			    				var w  = (x2+w2)-x1;
			    				svgRectHeader.attr('width', w);
			    				
			    				if(0 < svgTextHeader.size()) {
				    				svgTextHeader.attr('width', w)
				    					.attr('x', function(d){ 
					    					var bbox = this.getBBox();
					    					var t = (w-bbox.width)/2;
					    					return x1+t; 
				    					});
				    			}
			    			}
			    			jedo.svg.appendHeaderLine(_svgGanttHeader, _options, headerDatas, indexLine, lineMode, nSvgWidth);
			    			
			    			var sSelect = event.data.ganttHeaderDatas.map(function(o){
				    			return "#"+o.itemId+", #"+o.itemId+"T";
				    		}).join(", ");
			    			var svgHeaderLine = _svgGanttHeader.selectAll(sSelect);
			    			svgHeaderLine.each(function(){
								this.addEventListener("mouseup", function(event){
									_oJedoGantt.onMouseUpGanttHeader.call(_oJedoGantt, event);
								}, false);
								this.addEventListener("mouseover", function(){
									d3.select(this).style({'stroke-width':2});
								}, false);
								this.addEventListener("mouseout", function(){
									d3.select(this).style({'stroke-width':0});
								}, false);
							});
			    			
			    			_arrDeferred[indexLine].resolve();
			    			
			    			//console.log("e -- jedo.JedoGantt.prototype.addViewDate - SettingAddHeaderGanttData -- ");
			    			break;
			    		} 
			    	}, false);
			    	
			    	_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();
			    	
				} // for(var i=0; i<nHeaderLineCount; i++) {
				
				$.when.apply($, _arrPromise).done(function(){
					_settingConfig.changeViewData(nSvgToWidth, new Date(_settingConfig.dateViewStart.getTime()), dateViewEnd);
					deferred.resolve();
				});
				
				
				//console.log("e -- jedo.JedoGantt.prototype.appendLastViewDate -- ");
			} finally {
				return deferred.promise();
			}
		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "appendFirstViewDate", {
	get: function() {
		
		var _bNowWorking = false;
		
		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);
		
		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var nHeaderLineCount = _options.header.viewLineCount;
		
		return function() {
			console.log("s -- jedo.JedoGantt.prototype.appendFirstViewDate -- ");
			
			var deferred = $.Deferred();
			try {
				var nSTime = _settingConfig.dateViewStart.getTime();
				var nETime = _settingConfig.dateViewEnd.getTime();
				var nWTime = _settingConfig.fnTime(jedo.gantt.VIEW_WIDTH).getTime() - nSTime;
				var dateViewStart = new Date(nSTime-nWTime);
				var dateViewEnd = new Date(nSTime);
				dateViewEnd.setSeconds(dateViewEnd.getSeconds()-1, 0);
				
				var nSvgToWidth = _settingConfig.svgWidth+jedo.gantt.VIEW_WIDTH;
				jedo.svg.changeGanttWidth(_svg, nSvgToWidth);
				_oGanttContainer.scrollLeft(jedo.gantt.VIEW_WIDTH);
				
				var _arrDeferred = [];
				var _arrPromise = [];
				var oJedoWorker = {};
				
				var nSvgWidth = parseInt(_settingConfig.svgWidth,10);
				//console.log("nSvgToWidth["+nSvgToWidth+"] nSvgWidth["+nSvgWidth+"]");
				var nDataViewMode = _settingConfig.dateViewMode;
				for(var i=0; i<nHeaderLineCount; i++) {
					
					_arrDeferred[i] = $.Deferred();
					
					var nLineMode = nDataViewMode-(nHeaderLineCount-(i+1));
					oJedoWorker["jedoWorker"+i] = new Worker("jedo.JedoWorker.js");
			    	oJedoWorker["jedoWorker"+i].postMessage({
			    		"cmd": "SettingAddHeaderGanttData",
			    		"options": _options,
			    		"dateViewStart": dateViewStart,
						"dateViewEnd": dateViewEnd,
			    		"indexLine": i,
			    		"lineMode": nLineMode,
			    		"nToWidth": jedo.gantt.VIEW_WIDTH
			    	});
			    	oJedoWorker["jedoWorker"+i].addEventListener("message", function(event){
			    		switch(event.data.cmd) {
			    		case "SettingAddHeaderGanttData":
			    			//console.log("s -- jedo.JedoGantt.prototype.addViewDate - SettingAddHeaderGanttData -- ");
			    			
			    			var indexLine = event.data.indexLine;
			    			var lineMode = event.data.lineMode;
			    			var headerDatas = event.data.ganttHeaderDatas;
			    			
			    			var o = headerDatas[headerDatas.length-1];
			    			var itemId = o.itemId;
			    			var svgRectHeader = _svgGanttHeader.select('#'+itemId);
			    			var svgTextHeader = _svgGanttHeader.select('#'+itemId+"T");
			    			//console.log("itemId["+itemId+"] svgRectHeader.size():"+svgRectHeader.size());
			    			
			    			
			    			if(0 < svgRectHeader.size()) {
			    				var elm = headerDatas.pop();
			    				//console.log("elm.itemId["+elm.itemId+"] elm.x["+elm.x+"]");
			    				
			    				var ndx = parseInt(svgRectHeader.attr('ndx'),10)+1;
			    				var x1 = parseInt(svgRectHeader.attr('x'),10);
			    				var w1 = parseInt(svgRectHeader.attr('width'),10);
			    				var x2 = parseInt(elm.x,10);
			    				var w2 = parseInt(elm.width,10);
			    				var w  = w1+w2;
			    				
			    				svgRectHeader.attr('x', x2);
			    				
			    				var className = svgRectHeader.attr("class");
			    				var sSelect = "rect."+className+"[ndx='"+ndx+"']";
			    				//console.log("sSelect["+sSelect+"]");
			    				var nextSvgRectHeader = _svgGanttHeader.select(sSelect);
			    				//console.log("nextSvgRectHeader.size()["+nextSvgRectHeader.size()+"] "+nextSvgRectHeader.attr("id"));
			    				if(0 < nextSvgRectHeader.size()) {
			    					var nx = nextSvgRectHeader.attr('x');
			    					var nw = nx-x2-1;
			    					svgRectHeader.attr('width', nw);
			    				}
			    				//console.log(" VIEW_WIDTH["+jedo.gantt.VIEW_WIDTH+"] ndx["+ndx+"] x["+x2+"] w["+w+"]");
			    				if(0 < svgTextHeader.size()) {
			    					
			    					nw = svgRectHeader.attr('width');
				    				svgTextHeader.attr('width', nw)
				    					.attr('x', function(d){ 
					    					var bbox = this.getBBox();
					    					var t = (nw-bbox.width)/2;
					    					return x1+t; 
				    					});
				    			}
			    			}
			    			
			    			jedo.svg.appendHeaderLine(_svgGanttHeader, _options, headerDatas, indexLine, lineMode, 0);
			    			
			    			
			    			_svgGanttHeader.selectAll(headerDatas.map(function(o){
					    			return "#"+o.itemId+", #"+o.itemId+"T";
					    		}).join(", ")).each(function(){
									this.addEventListener("mouseup", function(event){
										_oJedoGantt.onMouseUpGanttHeader.call(_oJedoGantt, event);
									}, false);
									this.addEventListener("mouseover", function(){
										d3.select(this).style({'stroke-width':2});
									}, false);
									this.addEventListener("mouseout", function(){
										d3.select(this).style({'stroke-width':0});
									}, false);
								});
			    			
			    			_arrDeferred[indexLine].resolve();
			    			
			    			//console.log("e -- jedo.JedoGantt.prototype.addViewDate - SettingAddHeaderGanttData -- ");
			    			break;
			    		} 
			    	}, false);
			    	
			    	_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();
			    	
				} // for(var i=0; i<nHeaderLineCount; i++) {
				
				$.when.apply($, _arrPromise).done(function(){
					//console.log("s -- appendFirstViewDate _arrPromise -- ");
					_settingConfig.changeViewData(nSvgToWidth, dateViewStart, new Date(_settingConfig.dateViewEnd.getTime()));
					deferred.resolve();
					//console.log("e -- appendFirstViewDate _arrPromise -- ");
					
					
					console.log("complete -- jedo.JedoGantt.prototype.appendFirstViewDate -- ");
				});
				console.log("e -- jedo.JedoGantt.prototype.appendFirstViewDate -- ");
			} finally {
				_bNowWorking = false;
				return deferred.promise();
			}
		}
	},
	enumerable: false,
	configurable: false
});


}//if(!jedo.hasOwnProperty("JedoGantt")) {

