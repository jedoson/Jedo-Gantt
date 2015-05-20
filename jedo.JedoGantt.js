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


if(!jedo.hasOwnProperty("JedoGantt")) {

		
jedo.JedoGantt = function (options, ganttContainer, svg) {

	Object.defineProperty(this, "options", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: options
	});

	Object.defineProperty(this, "ganttContainer", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: ganttContainer
	});

	Object.defineProperty(this, "svg", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: svg
	});

	// -------------------------------------------------------------------------------------//

	Object.defineProperty(this, "ganttHeader", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: new jedo.JedoGantt.GanttHeader(this)
	});
	
	Object.defineProperty(this, "ganttBody", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: new jedo.JedoGantt.GanttBody(this)
	});
	
	
	
	Object.defineProperty(this, "settingConfig", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: new jedo.JedoGantt.SettingConfig()
	});

	
	
	

	// -------------------------------------------------------------------------------------//

	var _capturedGanttBar = null;
	Object.defineProperty(this, "capturedGanttBar", {
		get: function() {
			return _capturedGanttBar;
		},
		set: function(ganttBar) {
			_capturedGanttBar = ganttBar;
		},
		enumerable: false,
		configurable: false
	});


	Object.defineProperty(this, "clearCapturedGanttBar", {
		get: function() {
			return function() {
				if(_capturedGanttBar) {
					_capturedGanttBar.clearCapturedGanttBar();
				}
				_capturedGanttBar = null;
			};
		},
		enumerable: false,
		configurable: false
	});

	// -------------------------------------------------------------------------------------//
};
	
	
	
Object.defineProperty(jedo.JedoGantt, "getGanttDataKeyString", {
	get: function() {
		return function(nViewMode, nSvgPrevWidth, nSvgWidth) {
			//console.log("nViewMode["+nViewMode+"] nSvgPrevWidth["+nSvgPrevWidth+"] nSvgWidth["+nSvgWidth+"]");
			return nViewMode+"-"+nSvgPrevWidth+"-"+nSvgWidth;
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getViewModeString", {
	get: function() {
		return function(nViewMode) {
			if(nViewMode === jedo.VIEW_MODE.YEAR)		return "jedo.VIEW_MODE.YEAR";
			if(nViewMode === jedo.VIEW_MODE.QUARTER)	return "jedo.VIEW_MODE.QUARTER";
			if(nViewMode === jedo.VIEW_MODE.MONTH)		return "jedo.VIEW_MODE.MONTH";
			if(nViewMode === jedo.VIEW_MODE.WEEK)		return "jedo.VIEW_MODE.WEEK";
			if(nViewMode === jedo.VIEW_MODE.DATE)		return "jedo.VIEW_MODE.DATE";
			if(nViewMode === jedo.VIEW_MODE.HOUR)		return "jedo.VIEW_MODE.HOUR";
			if(nViewMode === jedo.VIEW_MODE.MIN)		return "jedo.VIEW_MODE.MIN";
			if(nViewMode === jedo.VIEW_MODE.SEC)		return "jedo.VIEW_MODE.SEC";
			if(nViewMode === jedo.VIEW_MODE.MIL)		return "jedo.VIEW_MODE.MIL";
			throw new Error("jedo.getViewModeString nViewMode is bad");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getZoomInViewMode", {
	get: function() {
		return function(nViewMode) {
			if(nViewMode === jedo.VIEW_MODE.YEAR)		return jedo.VIEW_MODE.QUARTER;
			if(nViewMode === jedo.VIEW_MODE.QUARTER)	return jedo.VIEW_MODE.MONTH;
			if(nViewMode === jedo.VIEW_MODE.MONTH)		return jedo.VIEW_MODE.WEEK;
			if(nViewMode === jedo.VIEW_MODE.WEEK)		return jedo.VIEW_MODE.DATE;
			if(nViewMode === jedo.VIEW_MODE.DATE)		return jedo.VIEW_MODE.HOUR;
			if(nViewMode === jedo.VIEW_MODE.HOUR)		return jedo.VIEW_MODE.MIN;
			if(nViewMode === jedo.VIEW_MODE.MIN)		return jedo.VIEW_MODE.SEC;
			if(nViewMode === jedo.VIEW_MODE.SEC)		return jedo.VIEW_MODE.MIL;
			throw new Error("jedo.JedoGantt.getZoomInViewMode nViewMode is bad");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getZoomOutViewMode", {
	get: function() {
		return function(nViewMode) {
			if(nViewMode === jedo.VIEW_MODE.QUARTER)	return jedo.VIEW_MODE.YEAR;
			if(nViewMode === jedo.VIEW_MODE.MONTH)		return jedo.VIEW_MODE.QUARTER;
			if(nViewMode === jedo.VIEW_MODE.WEEK)		return jedo.VIEW_MODE.MONTH;
			if(nViewMode === jedo.VIEW_MODE.DATE)		return jedo.VIEW_MODE.WEEK;
			if(nViewMode === jedo.VIEW_MODE.HOUR)		return jedo.VIEW_MODE.DATE;
			if(nViewMode === jedo.VIEW_MODE.MIN)		return jedo.VIEW_MODE.HOUR;
			if(nViewMode === jedo.VIEW_MODE.SEC)		return jedo.VIEW_MODE.MIN;
			if(nViewMode === jedo.VIEW_MODE.MIL)		return jedo.VIEW_MODE.SEC;
			throw new Error("jedo.JedoGantt.getZoomOutViewMode nViewMode is bad");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getChangeSvgWidth", {
	get: function() {
		return function(nToDateViewMode, settingConfig, options, svg) {
			//console.log("s -- jedo.JedoGantt.prototype.getChangeSvgWidth -- ");

			var xWidth = svg.attr('width');
			var xHeight = svg.attr('height');

			var oDate = new Date();
			oDate.setTime(settingConfig.dateViewStart.getTime());
			oDate.setMonth(0);
			oDate.setDate(1);
			oDate.setHours(0,0,0,0);
			var iSPos = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_START);

			var iWidth = 0;
			var nWidth = xWidth;
			switch (nToDateViewMode) {
				case jedo.VIEW_MODE.YEAR :    // Year
			    	oDate.setMonth(12);
			    	oDate.setDate(0);
			    	oDate.setHours(23,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One YEAR["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change YEAR["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.QUARTER : // 분기
					var nQuarter = jedo.JedoGantt.getQuarter(oDate);
			    	var nMonth = nQuarter*3;
			    	oDate.setMonth(nMonth);
			    	oDate.setDate(0);
			    	oDate.setHours(23,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One QUARTER["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change QUARTER["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.MONTH :   // 월
					oDate.setMonth(oDate.getMonth()+1);
					oDate.setDate(0);
					oDate.setHours(23,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One MONTH["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change MONTH["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.WEEK :    // 주
					oDate.setDate(7);
					oDate.setHours(23,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One Week["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change Week["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.DATE :    // 일
					oDate.setDate(oDate.getDate()+1);
					oDate.setHours(23,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One DATE["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change DATE["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.HOUR :    // 시간
					//console.debug("jedo.HOUR -- DATE["+jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours());
					oDate.setHours(oDate.getHours()+1,59,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One HOUR["+jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" Width:"+iWidth);
					iWidth = iWidth == 0 ? 1 : iWidth;
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change HOUR["+jedo.getFomattedDate(oDate)+"]h:"+oDate.getHours()+" nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.MIN :     // 분
					oDate.setMinutes(oDate.getMinutes()+1,59,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One MIN["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change MIN["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.SEC :     // 초
					oDate.setSeconds(oDate.getSeconds()+1,999);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One SEC["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change SEC["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				case jedo.VIEW_MODE.MIL :     // 밀리초
					oDate.setMilliseconds(oDate.getMilliseconds()+1);
					iWidth = settingConfig.fnScale(oDate, jedo.DATE_SCALE_TYPE_END) - iSPos;
					//console.debug("One MIL["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
					if(iWidth < options.unitWidth) {
						nWidth = ( xWidth / iWidth ) * options.unitWidth;
						//console.debug("change MIL["+jedo.getFomattedDate(oDate)+"] nWidth:"+nWidth);
					}
					break;
				default :
					throw new TypeError("Param nToDateViewMode["+nToDateViewMode+"] is Bad");
			}
			return nWidth;
			//console.log("e -- jedo.JedoGantt.prototype.getChangeSvgWidth -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getDateViewMode", {
	get: function() {
		return function(options, oFnScale) {
			//console.log("s -- jedo.JedoGantt.getDateViewMode -- ");

			var oDate = new Date();
			oDate.setTime(options.startGanttDate.getTime());
			oDate.setMonth(0);
			oDate.setDate(1);
			oDate.setHours(0,0,0,0);
			var iSPos = oFnScale(oDate);

			oDate.setHours(23,59,59,999);
			var iWidth = oFnScale(oDate) - iSPos;
			//console.debug("One Date["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(options.unitWidth <= iWidth) {
				return jedo.VIEW_MODE.DATE;
			}


			oDate.setDate(7);
			iWidth = oFnScale(oDate) - iSPos;
			//console.debug("One Week["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(options.unitWidth <= iWidth) {
				return jedo.VIEW_MODE.WEEK;
			}


			oDate.setMonth(oDate.getMonth()+1);
			oDate.setDate(0);
			iWidth = oFnScale(oDate) - iSPos;
			//console.debug("One Month["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(options.unitWidth <= iWidth) {
				return jedo.VIEW_MODE.MONTH;
			}

			oDate.setTime(options.startGanttDate.getTime());
			oDate.setMonth(3);
			oDate.setDate(0);
			iWidth = oFnScale(oDate) - iSPos;
			//console.debug("One Quarter["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(options.unitWidth <= iWidth) {
				return jedo.VIEW_MODE.QUARTER;
			}

			oDate.setMonth(12, 0);
			iWidth = oFnScale(oDate) - iSPos;
			//console.debug("One Year["+jedo.getFomattedDate(oDate)+"] Width:"+iWidth);
			if(options.unitWidth <= iWidth) {
				return jedo.VIEW_MODE.YEAR;
			}

			throw new Error("getDateViewMode dateViewMode Not define");
			//console.log("e -- jedo.JedoGantt.getDateViewMode -- ");
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getSVGCursorPoint", {
	get: function() {
		return function(svg, clientX, clientY) {
			var pt = svg.node().createSVGPoint();
			pt.x = clientX;
			pt.y = clientY;
		    var a = svg.node().getScreenCTM();
		    var b = a.inverse();
		    return pt.matrixTransform(b);
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "getMarkPoints", {
	get: function() {
		return function(iX, iY, iW, iH) {
			var mH = (iH/5)*3;
			var mT = iH/3;
			return [ { "x": iX-mT,  "y": iY},
		             { "x": iX+mT,  "y": iY},
		             { "x": iX+mT,  "y": iY+mH},
		             { "x": iX,  	"y": iY+iH},
		             { "x": iX-mT,  "y": iY+mH}
		           ];
		};
	},
	enumerable: false,
	configurable: false
});
Object.defineProperty(jedo.JedoGantt, "setMouseUpGanttHeader", {
	get: function() {
		return function(event) {
			_oJedoGantt.onMouseUpGanttHeader.call(_oJedoGantt, event);
		};
	},
	enumerable: false,
	configurable: false
});














}//if(!jedo.hasOwnProperty("JedoGantt")) {
