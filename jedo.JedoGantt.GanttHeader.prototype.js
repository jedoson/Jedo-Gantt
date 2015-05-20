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

if(!jedo.JedoGantt.GanttHeader.prototype.hasOwnProperty("initGanttHeader")) {

Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "initGanttHeader", {
	get: function(){
		
		
		return function() {
			
			
			
			
			
		};
	
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "changeGanttHeaderViewMode", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
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
				var nDataViewMode = _settingConfig.dateViewMode;

				for(var i=0; i<nHeaderLineCount; i++) {
					_arrDeferred[i] = $.Deferred();
					var nLineMode = nDataViewMode-(nHeaderLineCount-(i+1));
					//console.log("nLineMode:"+jedo.JedoGantt.getViewModeString(nLineMode));
					var arr = _settingConfig.getGanttHeaderData(i, nLineMode);
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
				    			_settingConfig.setGanttHeaderData(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
				    			var promise = _oGanttHeader.setHeaderLineMode(event.data.indexLine, event.data.lineMode, event.data.ganttHeaderDatas);
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
					_arrPromise.push(_arrDeferred[i].promise());
				}
				$.when.apply($, _arrPromise).done(function(){
					_oJedoGantt.createGanttHeaderBack();
					deferred.resolve();
				});

				//console.log("e -- jedo.JedoGantt.prototype.changeGanttHeaderViewMode -- ");
			} finally {
				return deferred.promise();
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "setHeaderLineMode", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
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
							jedo.svg.createTextHeaderLineTransition(_svgGanttHeader, indexLine, lineMode, arr, _options)).done(function(){
						deferred.resolve(indexLine);
					});
				} else {
					jedo.svg.createRectHeaderLine(_svgGanttHeader, indexLine, lineMode, arr);
					jedo.svg.createTextHeaderLine(_svgGanttHeader, indexLine, lineMode, arr, _options);
					deferred.resolve(indexLine);
				}
				_oGanttHeader.setGanttHeaderEvent(
					indexLine,
					_svg.selectAll('rect.rectheaderLine'+indexLine+', text.textheaderLine'+indexLine)
				);

				//console.log("e -- jedo.JedoGantt.prototype.setHeaderLineMode  --");
			} finally {
				return deferred.promise();
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "onMouseUpGanttHeader", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function(event) {
			if(event.ctrlKey) {
				console.log("s -- jedo.JedoGantt.prototype.onMouseUpGanttHeader event.ctrlKey["+event.ctrlKey+"]  --");

				var svgPoint = jedo.JedoGantt.getSVGCursorPoint(_svg, event.clientX, event.clientY);
				//var nClickPer = (svgPoint.x*100)/_settingConfig.svgWidth;
				//console.log("nClickPer["+nClickPer+"]");
				var oClickDate = _settingConfig.fnTime(svgPoint.x);
				console.log("oClickDate["+oClickDate.toISOString()+"]");

				var nToDateViewMode = jedo.JedoGantt.getZoomInViewMode(_settingConfig.dateViewMode);
				//console.log("dateViewMode["+_settingConfig.dateViewModeString+"] nToDateViewMode["+jedo.VIEW_MODE.toString(nToDateViewMode)+"]");
				var nSvgToWidth = jedo.JedoGantt.getChangeSvgWidth(nToDateViewMode, _settingConfig, _options, _svg);
				console.log("svgWidth["+_settingConfig.svgWidth+"] nSvgToWidth["+nSvgToWidth+"]");
				_settingConfig.pushGanttWidth(nSvgToWidth);

				var promise = _oJedoGantt.changeGanttViewMode(svgPoint, nToDateViewMode, nSvgToWidth);
				_oJedoGantt.changeScrollGanttContainer(nSvgToWidth, oClickDate, event.clientX);

				console.log("e -- jedo.JedoGantt.prototype.onMouseUpGanttHeader  --");
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "onMouseDownGanttHeader", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function(event) {
			console.log("event.target["+event.target.getAttribute("id")+"]  event.currentTarget["+event.currentTarget.getAttribute("id")+"]");
			var svgElement = _svg.select("#"+event.target.getAttribute("id"));
			if(svgElement) {

				console.log("svgElement["+svgElement.node().getAttribute("id")+"] dreag");

				var drag = d3.behavior.drag()
						.on("dragstart", function() {




					    })
					    .on("drag", function() {

					      console.log("d3.event.sourceEvent.pageX["+d3.event.sourceEvent.pageX+"] d3.event.sourceEvent.pageY["+d3.event.sourceEvent.pageY+"]");
					      svgElement.attr("x", d3.event.sourceEvent.pageX).attr("y", d3.event.sourceEvent.pageY);


					    });
				svgElement.call(drag);
			}
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "appendLastViewDate", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var nHeaderLineCount = _options.header.viewLineCount;

		return function() {
			console.log("s -- jedo.JedoGantt.prototype.appendLastViewDate -- ");

			var deferred = $.Deferred();
			try {
				//console.log("_settingConfig.dateViewStart["+_settingConfig.dateViewStart.toISOString()+"] _settingConfig.dateViewEnd["+_settingConfig.dateViewEnd.toISOString()+"]");
				var nSTime = _settingConfig.dateViewStart.getTime();
				var nETime = _settingConfig.dateViewEnd.getTime();
				var nWTime = _settingConfig.fnTime(jedo.gantt.APPEND_VIEW_WIDTH).getTime() - nSTime;
				var dateViewStart = new Date(nETime);
				dateViewStart.setMilliseconds(dateViewStart.getMilliseconds()+1);
				var dateViewEnd = new Date(nETime+nWTime);

				var nSvgWidth = _settingConfig.svgWidth;
				var nSvgToWidth = jedo.svg.appendGanttWidth(_svg, jedo.gantt.APPEND_VIEW_WIDTH);



				var _arrDeferred = [];
				var _arrPromise = [];
				var oJedoWorker = {};

				var _arrHeaderDatas = [];


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
			    		"nToWidth": jedo.gantt.APPEND_VIEW_WIDTH
			    	});
			    	oJedoWorker["jedoWorker"+i].addEventListener("message", function(event){
			    		switch(event.data.cmd) {
			    		case "SettingAddHeaderGanttData":

			    			var indexLine = event.data.indexLine;
			    			var lineMode = event.data.lineMode;
			    			var headerDatas = event.data.ganttHeaderDatas;

			    			//console.log("s -- SettingAddHeaderGanttData indexLine["+indexLine+"] -- ");

			    			var itemId = headerDatas[0].itemId;
			    			var svgRectHeader = _svgGanttHeader.select('#'+itemId);
			    			if(0 < svgRectHeader.size()) {
			    				var elm = headerDatas.shift();

			    				var x1 = parseInt(svgRectHeader.attr('x'),10);
			    				var w1 = parseInt(svgRectHeader.attr('width'),10);
			    				var x2 = nSvgWidth+parseInt(elm.x,10);
			    				var w2 = parseInt(elm.width,10);
			    				var w  = (x2+w2)-x1;
			    				svgRectHeader.attr('width', w);
			    				console.log("1  indexLine["+indexLine+"] w["+w+"]");

								var svgTextHeader = _svgGanttHeader.select('#'+itemId+"T");
			    				if(0 < svgTextHeader.size()) {
				    				svgTextHeader.attr('width', w)
				    					.attr('x', function(d){
					    					var bbox = this.getBBox();
					    					var t = (w-bbox.width)/2;
					    					return x1+t;
				    					});
				    			}
			    			} else {
			    				/*
			    				var arrGanttHeaderData = _settingConfig.getGanttHeaderData(indexLine, lineMode);
			    				var oHeaderData = arrGanttHeaderData[arrGanttHeaderData.length-1];

			    				svgRectHeader = _svgGanttHeader.select('#'+oHeaderData.itemId);
			    				console.log(oHeaderData.itemId+" svgRectHeader.size():"+svgRectHeader.size());
			    				var x1 = parseInt(svgRectHeader.attr('x'),10);
			    				var w1 = parseInt(svgRectHeader.attr('width'),10);
			    				var x2 = nSvgWidth+parseInt(headerDatas[0].x,10);
			    				var w2 = parseInt(headerDatas[0].width,10);
			    				var w  = x2 - x1 - 2;
			    				svgRectHeader.attr('width', w);
			    				console.log("2  indexLine["+indexLine+"] w["+w+"]");
			    				*/
			    			}
			    			jedo.svg.appendHeaderLine(_svgGanttHeader, _options, headerDatas, indexLine, lineMode, nSvgWidth);

							_oGanttHeader.setGanttHeaderEvent(
								indexLine,
								_svgGanttHeader.selectAll(headerDatas.map(function(o){
									return "#"+o.itemId+", #"+o.itemId+"T";
								}))
							);

							_arrHeaderDatas.push({
								indexLine: indexLine,
								viewMode: lineMode,
								datas: headerDatas
							});
			    			_arrDeferred[indexLine].resolve();

			    			//console.log("e -- SettingAddHeaderGanttData indexLine["+indexLine+"] -- ");
			    			break;
			    		}
			    	}, false);

			    	_arrPromise.push(_arrDeferred[i].promise());

				} // for(var i=0; i<nHeaderLineCount; i++) {

				$.when.apply($, _arrPromise).done(function(){
					console.log("s -- appendLastViewDate done -- ");
					_settingConfig.changeViewData(nSvgToWidth, new Date(_settingConfig.dateViewStart.getTime()), dateViewEnd, _arrHeaderDatas);
					deferred.resolve();
					console.log("e -- appendLastViewDate done -- ");
				});


				console.log("e -- jedo.JedoGantt.GanttHeader.prototype.appendLastViewDate -- ");
			} finally {
				return deferred.promise();
			}
		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "appendFirstViewDate", {
	get: function() {

		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var nHeaderLineCount = _options.header.viewLineCount;

		return function() {
			console.log("s -- jedo.JedoGantt.GanttHeader.prototype.appendFirstViewDate -- ");

			var deferred = $.Deferred();
			try {
				var nSTime = _settingConfig.dateViewStart.getTime();
				var nETime = _settingConfig.dateViewEnd.getTime();
				var nWTime = _settingConfig.fnTime(jedo.gantt.APPEND_VIEW_WIDTH).getTime() - nSTime;
				var dateViewStart = new Date(nSTime-nWTime);
				var dateViewEnd = new Date(nSTime);
				dateViewEnd.setSeconds(dateViewEnd.getSeconds()-1, 0);

				var nSvgToWidth = jedo.svg.insertGanttWidth(_svg, jedo.gantt.APPEND_VIEW_WIDTH);

				_oGanttContainer.scrollLeft(jedo.gantt.APPEND_VIEW_WIDTH);

				var _arrDeferred = [];
				var _arrPromise = [];
				var oJedoWorker = {};

				var _arrHeaderDatas = [];

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
			    		"nToWidth": jedo.gantt.APPEND_VIEW_WIDTH
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
			    				var nextSvgRectHeader = _svgGanttHeader.select("rect."+className+"[ndx='"+ndx+"']");
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

							_oGanttHeader.setGanttHeaderEvent(
								indexLine,
								_svgGanttHeader.selectAll(headerDatas.map(function(o){
									return "#"+o.itemId+", #"+o.itemId+"T";
								}))
							);

							_arrHeaderDatas.push({
								indexLine: indexLine,
								viewMode: lineMode,
								datas: headerDatas
							});

			    			_arrDeferred[indexLine].resolve();

			    			//console.log("e -- jedo.JedoGantt.prototype.addViewDate - SettingAddHeaderGanttData -- ");
			    			break;
			    		}
			    	}, false);

			    	_arrPromise[_arrPromise.length] = _arrDeferred[i].promise();

				} // for(var i=0; i<nHeaderLineCount; i++) {

				$.when.apply($, _arrPromise).done(function(){
					_settingConfig.changeViewData(nSvgToWidth, dateViewStart, new Date(_settingConfig.dateViewEnd.getTime()), _arrHeaderDatas);
					deferred.resolve();
				});
				//console.log("e -- jedo.JedoGantt.GanttHeader.prototype.appendFirstViewDate -- ");
			} finally {
				return deferred.promise();
			}
		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttHeader.prototype, "setGanttHeaderEvent", {
	get: function() {
		
		var _oGanttHeader = this;
		var _oJedoGantt = _oGanttHeader.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _svgGanttHeader = _svg.select("g.ganttHeader");
		var _options = _oJedoGantt.options;
		var nHeaderLineCount = _options.header.viewLineCount;
		
		return function(indexLine, svgHeaders) {
			svgHeaders.each(function(){
				if(indexLine+1 === nHeaderLineCount) {
					this.addEventListener("mouseup", function(event){
						_oGanttHeader.onMouseUpGanttHeader.call(_oGanttHeader, event);
					}, false);
				}
				this.addEventListener("mouseover", function(){
					d3.select(this).style({'stroke-width':2});
				}, false);
				this.addEventListener("mouseout", function(){
					d3.select(this).style({'stroke-width':0});
				}, false);
			});
		}
	},
	enumerable: false,
	configurable: false
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}//if(!jedo.JedoGantt.GanttHeader.prototype.hasOwnProperty("initGanttHeader")) {