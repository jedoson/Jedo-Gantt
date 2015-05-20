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

if(!jedo.JedoGantt.GanttBody.prototype.hasOwnProperty("initGanttBody")) {

Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "initGanttBody", {
	get: function(){
		
		
		return function() {
			
			
			
			
			
		};
	
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "changeGanttBodyViewMode", {
	get: function() {

		var _oGanttBody = this;
		var _oJedoGantt = _oGanttBody.jedoGantt;
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
							var bodyBarDatas = event.data.ganttBodyBarDatas;
							_settingConfig.ganttBodyData = bodyBarDatas;
							$.when(_oGanttBody.setBodyGanttBar(bodyBarDatas)).done(function(){
								deferred.resolve();
							});
							//console.log("e -- message - jedoWorker.SettingBodyGanttBarData --- ");
							break;
						}
					}, false);
				} else {
					_oGanttBody.setBodyGanttBar(_settingConfig.ganttBodyData);
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
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "setBodyGanttBar", {
	get: function() {

		var _oGanttBody = this;
		var _oJedoGantt = _oGanttBody.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _svgGanttBody = _svg.select('g.ganttBody');

		return function(arr) {
			//console.log("s -- jedo.JedoGantt.prototype.setBodyGanttBar  --");

			var deferred = $.Deferred();
			try {
				var iX = _settingConfig.fnScale(_options.endGanttDate, jedo.DATE_SCALE_TYPE_END);
				if(_settingConfig.fnPrevScale) {
					_svgGanttBody.selectAll('rect.ganttBodyLine').attr('width', iX);
				} else {
					jedo.svg.createGanttBodyLine(_svgGanttBody, arr, iX);
				}
				$.when(jedo.svg.setGanttBodyBar(_svgGanttBody, _settingConfig.fnPrevScale, arr, iX)).done(function(){
					deferred.resolve();
				});
				if(!_settingConfig.fnPrevScale) {

					_svgGanttBody.selectAll("rect.rectGanttBar, polygon.startMarkGanttBar, polygon.endMarkGanttBar")
						.each(function(){
							this.addEventListener("mouseover", _oGanttBody.onMouseOverGanttBar.bind(_oGanttBody), false);
							this.addEventListener("mousedown", _oGanttBody.onMouseDownGanttBar.bind(_oGanttBody), false);
					});
					_svg.node().addEventListener("mousemove",_oGanttBody.onMouseMoveBar.bind(_oGanttBody),false);
					_svg.node().addEventListener("mouseup",  _oGanttBody.onMouseUpBar.bind(_oGanttBody),  false);
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
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "onMouseOverGanttBar", {
	get: function() {
		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseOverGanttBar  --");
//			console.debug("id:"+event.target.getAttribute("id"));
//			console.debug("class:"+event.target.getAttribute("class"));

			var sDataID = event.target.getAttribute("dataID");
			//console.debug("dataID:"+event.target.getAttribute("dataID"));
			d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID)
			.each(function(){
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
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "onMouseDownGanttBar", {
	get: function() {

		var _oGanttBody = this;
		var _oJedoGantt = _oGanttBody.jedoGantt;
		var _svg = _oJedoGantt.svg;

		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseDownGanttBar  --");
//			console.log("event.type:"+event.type+" clientX:"+event.clientX+" x:"+event.x+" clientY:"+event.clientY+" y:"+event.y);

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
			d3.selectAll("#rectGanttBar_"+sDataID+", #startMarkGanttBar_"+sDataID+", #endMarkGanttBar_"+sDataID)
			.each(function(){
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
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "onMouseUpBar", {
	get: function() {

		var _oGanttBody = this;
		var _oJedoGantt = _oGanttBody.jedoGantt;

		return function(event) {
//			console.log("s -- jedo.JedoGantt.prototype.onMouseUpBar  --");
			_oJedoGantt.clearCapturedGanttBar();
//			console.log("e -- jedo.JedoGantt.prototype.onMouseUpBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.GanttBody.prototype, "onMouseMoveBar", {
	get: function() {

		var _oGanttBody = this;
		var _oJedoGantt = _oGanttBody.jedoGantt;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;

		var bh = _options.ganttBarHeight;
		var unitSpace = _options.unitSpace;

		return function(event) {
			//console.log("s -- jedo.JedoGantt.GanttBody.prototype.onMouseMoveBar  --");
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
			//console.log("e -- jedo.JedoGantt.GanttBody.prototype.onMouseMoveBar  --");
		};
	},
	enumerable: false,
	configurable: false
});
	
	
}//if(!jedo.JedoGantt.GanttBody.prototype.hasOwnProperty("initGanttBody")) {

