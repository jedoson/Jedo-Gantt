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
			
		    var oFnScale = jedo.getFnScale(_options.startGanttDate, _options.endGanttDate, 0, nSvgWidth);
		    var oFnTime = jedo.getFnTime(_options.startGanttDate, _options.endGanttDate, 0, nSvgWidth);
		    var nDateViewMode = jedo.JedoGantt.getDateViewMode(_options, oFnScale);

		    _settingConfig.setSettingGanttData(new jedo.JedoGantt.SettingGanttData(nDateViewMode, 0, nSvgWidth, oFnScale, oFnTime));

		    var nSvgBodyHeight = _options.lineHeight*_options.ganttData.length;
			var nSvgHeaderHeight = _options.header.lineHeight*_options.header.viewLineCount;
			
			_settingConfig.pushGanttWidth(nSvgWidth);
			
			jedo.svg.createGanttBody(_svg, nSvgHeaderHeight, nSvgWidth, nSvgBodyHeight);
			jedo.svg.createGanttHeader(_svg, nSvgWidth, nSvgHeaderHeight);
			
			
			var fnFormat = d3.time.format("%Y-%m-%d %H:%M:%S-%L");
			$.when(	_oJedoGantt.changeGanttBodyViewMode(nSvgWidth, nSvgWidth), 
					_oJedoGantt.changeGanttHeaderViewMode(nSvgWidth, nSvgWidth))
					.done(function(){
						_oGanttContainer.on("scroll", function(event){
							//console.log("s -- jedo.JedoGantt.prototype.initJedoGantt scroll -- ");
							
							var nST = _oGanttContainer.scrollTop();
							var nSL = _oGanttContainer.scrollLeft();

							_svg.select('g.ganttHeader').attr('transform', 'translate(0,'+nST+')');
							_svg.select('rect.ganttHeaderBack').attr('transform', 'translate('+nSL+',0)');
							
							var oDate = _settingConfig.fnTime(nSL);

							_settingConfig.scrollLeft = nSL;
							_settingConfig.viewStartDate = oDate;
							
							//console.log("e -- jedo.JedoGantt.prototype.initJedoGantt scroll -- ");
						});
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
		
		var svg = this.svg;
		var nSvgWidth = this.svg.attr("width");
		
		var options = this.options;
		var settingConfig = this.settingConfig;
		
		return function(svgPoint, nToDateViewMode, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			//console.log("nDateViewMode:"+jedo.JedoGantt.getViewModeString(nDateViewMode));
			//console.log("now this.dateViewMode:"+this.dateViewMode);
			
			var deferred = $.Deferred();
			
			if(jedo.VIEW_MODE.MIL < nToDateViewMode) {
				console.debug("nHeaderDateViewMode["+nToDateViewMode+"] is bad");
				deferred.resolve();
				return deferred.promise();
			}
			
			try {
				
				
				var bDataViewMode = settingConfig.isGanttData(nToDateViewMode, nSvgWidth, nSvgToWidth);
				if(!bDataViewMode) {
					var oFnScale = jedo.getFnScale(options.startGanttDate, options.endGanttDate, 0, nSvgToWidth);
					var oFnTime = jedo.getFnTime(options.startGanttDate, options.endGanttDate, 0, nSvgToWidth);
					settingConfig.setSettingGanttData(new jedo.JedoGantt.SettingGanttData(nToDateViewMode, nSvgWidth, nSvgToWidth, oFnScale, oFnTime));
				} else {
					settingConfig.changePrevDateViewMode();
				}

				svg.transition().duration(1000)
					.attr('width',function(d, i, a){
						return nSvgToWidth;
					});
				svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg')
					.transition().duration(1000)
					.attr('width',function(d){
						return nSvgToWidth;
					});
				$.when( this.changeGanttBodyViewMode(nSvgWidth, nSvgToWidth), 
						this.changeGanttHeaderViewMode(nSvgWidth, nSvgToWidth)).done(function(){
					deferred.resolve();
				});
				
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
		var nDataViewMode = this.settingConfig.dateViewMode;
		var nHeaderLineCount = this.options.header.viewLineCount;
		
		return function(nSvgWidth, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
			
			var deferred = $.Deferred();
			var _arrDeferred = [];
			var _arrPromise = [];
			var oJedoWorker = {};
			
			try {
				for(var i=0; i<nHeaderLineCount; i++) {
					_arrDeferred[i] = $.Deferred();
					var nLineMode = nDataViewMode-(nHeaderLineCount-(i+1));
					//console.log("nLineMode:"+jedo.JedoGantt.getViewModeString(nLineMode));
					var arr = this.settingConfig.getGanttHeaderData(i, nLineMode);
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
Object.defineProperty(jedo.JedoGantt.prototype, "changeGanttBodyViewMode", {
	get: function() {
		
		
		var _oJedoGantt = this;
		var _options = this.options;
		var _settingConfig = this.settingConfig;
		
		return function(nSvgWidth, nSvgToWidth) {
			//console.log("s -- jedo.JedoGantt.prototype.changeGanttBodyViewMode -- ");
			//console.debug("nSvgToWidth:"+nSvgToWidth);
			
			var deferred = $.Deferred();
			
			try {
				if(!_settingConfig.ganttBodyData) {
					var jedoWorker = new Worker("jedo.JedoWorker.js");
					jedoWorker.postMessage({
						"cmd": "SettingBodyGanttBarData",
						"options": _options,
						"startGanttDate": _options.startGanttDate,
						"endGanttDate": _options.endGanttDate,
						"nPrevWidth": nSvgWidth,
						"nToWidth": nSvgToWidth
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
		
		var _svg = this.svg;
		var _options = this.options;
		var _oJedoGantt = this;
		
		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
			_svg.select("rect.ganttHeaderBack").remove();
			var lH = _options.header.lineHeight;
			var x = (lH/5);
			var y = (lH/5);
			var w = (lH/5)*3;
			var h = (lH/5)*3;
			var svgGanttHeaderBack = jedo.svg.createGanttHeaderBack(_svg.select("g.ganttHeader"), x, y, w, h);
			
			svgGanttHeaderBack.node().addEventListener("mousedown", _oJedoGantt.onMouseDownChangePrevViewMode.bind(_oJedoGantt), false);
			
			//console.log("e -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "setBodyGanttBar", {
	get: function() {
		
		var _svg = this.svg;
		var _options = this.options;
		var _oJedoGantt = this;
		var _settingConfig = this.settingConfig;
		var _svgGanttBody = this.svg.select('g.ganttBody');
		
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
Object.defineProperty(jedo.JedoGantt.prototype, "setHeaderLineMode", {
	get: function() {
		
		var _svg = this.svg;
		var _oJedoGant = this;
		var _options = this.options;
		var _settingConfig = this.settingConfig;
		var _svgGanttHeader = this.svg.select("g.ganttHeader");
		
		return function(indexLine, lineMode, arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
			//console.log("indexLine:"+indexLine+" lineMode:"+jedo.JedoGantt.getViewModeString(lineMode));
			
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
						if(indexLine+1 === _options.header.viewLineCount) {
							this.addEventListener("mouseup", _oJedoGant.onMouseUpGanttHeader.bind(_oJedoGant),false);
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









}//if(!jedo.hasOwnProperty("JedoGantt")) {

