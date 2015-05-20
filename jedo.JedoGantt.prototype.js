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

			var nSvgWidth = parseInt(_svg.attr('width'),10);
			var nSvgHeight = parseInt(_svg.attr('height'),10);

			// ------------------------------------------------------------------------------------------- //
			// jedo.gantt 설정.

			/**
			 * 화면의폭.
			 */
			Object.defineProperty(jedo.gantt, "VIEW_WIDTH", {
				enumerable: false,
				configurable: false,
				writable: false,
				value: nSvgWidth
			});


			/**
			 * 화면의 최대폭.
			 */
			Object.defineProperty(jedo.gantt, "MAX_VIEW_WIDTH", {
				enumerable: false,
				configurable: false,
				writable: false,
				value: nSvgWidth*15
			});

			/**
			 * 기간추가시 추가할 화면의 폭.
			 */
			Object.defineProperty(jedo.gantt, "APPEND_VIEW_WIDTH", {
				enumerable: false,
				configurable: false,
				writable: false,
				value: nSvgWidth*2
			});

			// ------------------------------------------------------------------------------------------- //
			
			
			
			
			
			
			_oJedoGantt.ganttHeader.initGanttHeader();
			_oJedoGantt.ganttBody.initGanttBody();
			
			
			
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

			$.when(	_oJedoGantt.ganttBody.changeGanttBodyViewMode(),
					_oJedoGantt.ganttHeader.changeGanttHeaderViewMode())
			.done(function(){

				_oGanttContainer.on("scroll", _oJedoGantt.onScrollTimeFixedElement.bind(_oJedoGantt));
				_oGanttContainer.on("scroll", _oJedoGantt.onScrollGanttContainer.bind(_oJedoGantt));
				
				_svg.selectAll('rect.ganttBodyLine').each(function(){
					this.addEventListener("mousedown", _oJedoGantt.onMouseDownGanttLine.bind(_oJedoGantt), false);
					this.addEventListener("mousemove", _oJedoGantt.onMouseMoveGanttLine.bind(_oJedoGantt), false);
					this.addEventListener("mouseup", _oJedoGantt.onMouseUpGanttLine.bind(_oJedoGantt), false);
				});
						
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
			console.log("s -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
			//console.log("nDateViewMode:"+jedo.JedoGantt.getViewModeString(nDateViewMode));
			//console.log("now this.dateViewMode:"+this.dateViewMode);

			var currentSettingGanttData = _settingConfig.currentSettingGanttData;

			var deferred = $.Deferred();
			try {
				if(jedo.VIEW_MODE.MIL < nToDateViewMode) {
					console.debug("nHeaderDateViewMode["+nToDateViewMode+"] is bad");
					deferred.resolve();
				} else {
					_svg.transition().duration(1000).delay(100).attr('width',nSvgToWidth);
					_svg.selectAll('rect.ganttHeaderBg, rect.ganttBodyBg').attr('width',nSvgToWidth);
					var nSvgWidth = _settingConfig.svgWidth;

					if(_settingConfig.isGanttData(nToDateViewMode, nSvgWidth, nSvgToWidth)) {

						_settingConfig.changePrevDateViewMode();
					} else {
						_settingConfig.setSettingGanttData(
							new jedo.JedoGantt.SettingGanttData(
									nToDateViewMode, nSvgWidth, nSvgToWidth,
									new Date(_settingConfig.dateViewStart.getTime()),
				    				new Date(_settingConfig.dateViewEnd.getTime())
								));
					}
					$.when( _oJedoGantt.ganttBody.changeGanttBodyViewMode(),
							_oJedoGantt.ganttHeader.changeGanttHeaderViewMode()).done(function(){
						deferred.resolve();
					});
				}
				console.log("e -- jedo.JedoGantt.prototype.changeGanttViewMode -- ");
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
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function() {
			//console.log("s -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
			var lH = _options.header.lineHeight;
			var x = (lH/5);
			var y = (lH/5);
			var w = (lH/5)*3;
			var h = (lH/5)*3;
			if(d3.select("#svgBackRight").size() == 0) {
				$.when(jedo.svg.createGanttHeaderBack(_oGanttContainer, x, y, w, h))
					.done(function(oResolve){
					//console.log("s -- svgRightBack - jedo.JedoGantt.prototype.createGanttHeaderBack");
					if(oResolve.result == "error") {
						alert(oResolve.message);
					} else {
						oResolve.node.addEventListener("mousedown", _oJedoGantt.onMouseDownChangePrevViewMode.bind(_oJedoGantt), false);
					}
					//console.log("e -- svgRightBack - jedo.JedoGantt.prototype.createGanttHeaderBack");
				});
			}
			_svg.select("rect.ganttHeaderDebug").remove();
			jedo.svg.createGanttHeaderDebug(_svg.select("g.ganttHeader"), x+w+w, y, w, h)
				.node().addEventListener("mousedown", _oJedoGantt.onMouseDownHeaderDebug.bind(_oJedoGantt), false);
			//console.log("e -- jedo.JedoGantt.prototype.createGanttHeaderBack -- ");
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

		return function (nSvgToWidth, oClickDate, nClientX) {
			//console.log("s -- jedo.JedoGantt.prototype.changeScrollGanttContainer  --");

			var nSTime = _settingConfig.dateViewStart.getTime();
			var nETime = _settingConfig.dateViewEnd.getTime();
			var nVTime = nETime - nSTime;
			var _H_VIEW_BOX = _svg.attr("height");
			var nScrollLeft = _oGanttContainer.scrollLeft();
			//console.log("nSvgToWidth["+nSvgToWidth+"] oClickDate["+oClickDate.toISOString()+"] nClientX["+nClientX+"]");
			//console.log("dateViewStart["+_settingConfig.dateViewStart.toISOString()+"] ");
			//console.log("dateViewEnd["+_settingConfig.dateViewEnd.toISOString()+"] ");

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
			observer.observe(_svg.node(), {
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

	

Object.defineProperty(jedo.JedoGantt.prototype, "onScrollTimeFixedElement", {
	get: function() {

		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function(event){
			var nST = _oGanttContainer.scrollTop();
			var nSL = _oGanttContainer.scrollLeft();
			var sLeft = (parseInt(nSL,10)+10)+"px";
			var nX = parseInt(nSL,10)+50;
			_svg.select('g.ganttHeader').attr('transform', 'translate(0,'+nST+')');
			d3.select('#svgBackRight').style('left', sLeft);
			_svg.select('rect.ganttHeaderDebug').attr('x', nX);
		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "onScrollGanttContainer", {
	get: function() {

		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _options = _oJedoGantt.options;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		var bFnWorking = false;
		var promise = null;
		return function(event){

			if(promise == null) {
				var nSvgWidth = parseInt(_svg.attr("width"),10);
				if(nSvgWidth < (jedo.gantt.VIEW_WIDTH + 50)) return;

				if(bFnWorking) return;
				bFnWorking = true;
				//console.log("s -- jedo.JedoGantt.prototype.onScrollGanttContainer scroll -- ");
				try {
					var nST = _oGanttContainer.scrollTop();
					var nSL = _oGanttContainer.scrollLeft();

					var dateScrollLeft = _settingConfig.fnTime(nSL);
					//console.log("dateScrollLeft["+dateScrollLeft.toISOString()+"]");

					_settingConfig.scrollLeft = nSL;
					_settingConfig.viewStartDate = dateScrollLeft;

					var nSumScroll = jedo.gantt.VIEW_WIDTH+nSL;
					//console.log("nSumScroll["+nSumScroll+"] _settingConfig.svgWidth["+_settingConfig.svgWidth+"]");

					// 사용자가 스크롤 하여 최우측으로 이동
					if(nSvgWidth+10 < jedo.gantt.MAX_VIEW_WIDTH) {
						/*
						if(nSL === 0) {
							_oGanttContainer.scrollLeft(jedo.gantt.APPEND_VIEW_WIDTH);
							promise = _oJedoGantt.appendFirstViewDate();
						} else if(_settingConfig.svgWidth < (nSumScroll+10)) {
							promise = _oJedoGantt.appendLastViewDate();
						}
						*/
						if(promise) {
							$.when(promise).done(function(){
								setTimeout(function(){
									promise = null;
									console.log("end -- jedo.JedoGantt.prototype.onScrollGanttContainer scroll -- ");
								}, 1000);
							});
						}
					}
				} finally {
					bFnWorking = false;
				}
			} else {
				event.stopPropagation();
				event.preventDefault();
			}
			//console.log("e -- jedo.JedoGantt.prototype.onScrollGanttContainer scroll -- ");
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
			var nSvgWidth = parseInt(_svg.attr("width"),10);
			var nClickPer = (svgPoint.x*100)/nSvgWidth;

			var nToDataViewMode = jedo.JedoGantt.getZoomOutViewMode(_settingConfig.dateViewMode);
			var nSvgToWidth = _settingConfig.popGanttWidth();
			var nPrevScrollLeft = _settingConfig.prevScrollLeft;
			var oPrevViewStartDate = _settingConfig.prevViewStartDate;

			//_oJedoGantt.changeScrollGanttContainer(nSvgToWidth, _settingConfig.clickPer, _settingConfig.viewX);
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var w = parseInt(_svg.attr("width"),10);
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

Object.defineProperty(jedo.JedoGantt.prototype, "onMouseDownHeaderDebug", {
	get: function() {

		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function(event) {

			var svgElement = _svg.select(event.currentTarget);
			if(svgElement) {
				var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {

					console.log("Headerline2_Y2014_W6 "+svgElement.attr("id")+" svgElement.width["+svgElement.attr("width")+"]");

					});
				});
				observer.observe(svgElement.node(), {
				    attributes: true,
				    attributeFilter: ["width"],
				    attributeOldValue: false,
				    childList: false
				});
			}

		}
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt.prototype, "debugObject", {
	get: function() {

		var _oJedoGantt = this;
		var _svg = _oJedoGantt.svg;
		var _settingConfig = _oJedoGantt.settingConfig;
		var _oGanttContainer = $(_oJedoGantt.ganttContainer);

		return function(sSvgElementId) {

			var svgElement = _svg.select("#"+sSvgElementId);
			if(svgElement) {
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {

						console.log(svgElement.attr("id")+" svgElement.width["+svgElement.attr("width")+"]");

					});
				});
				observer.observe(svgElement.node(), {
				    attributes: true,
				    attributeFilter: ["width"],
				    attributeOldValue: false,
				    childList: false
				});
			}

		}
	},
	enumerable: false,
	configurable: false
});


	
	
	
	
	
	
	
	
	
	

}//if(!jedo.hasOwnProperty("JedoGantt")) {
