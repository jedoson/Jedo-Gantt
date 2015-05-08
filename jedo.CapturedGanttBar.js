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

if(!jedo.hasOwnProperty("CapturedGanttBar")) {
	
jedo.CapturedGanttBar = function (svgPoint, capturedMode, capturedDataID, capturedIndex) {
	
	Object.defineProperty(this, "svgPoint", {
		get: function() {
			return svgPoint;
		},
		set: function(p) {
			svgPoint = null;
			svgPoint = p;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "capturedMode", {
		get: function() {
			return capturedMode;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(this, "capturedDataID", {
		get: function() {
			return capturedDataID;
		},
		enumerable: false,
		configurable: false
	});
	
	Object.defineProperty(this, "capturedIndex", {
		get: function() {
			return capturedIndex;
		},
		enumerable: false,
		configurable: false
	});
	
	
	var _clearCapturedGanttBar = function() {
		d3.selectAll("#rectGanttBar_"+this.capturedDataID+", #startMarkGanttBar_"+this.capturedDataID+", #endMarkGanttBar_"+this.capturedDataID)
			.each(function(){
				d3.select(this).style({'cursor':'default'});
				if(this.getAttribute("class") == "rectGanttBar") {
					d3.select(this).style({'stroke-width':0});
				} else {
					d3.select(this).style({'stroke-width':1});
				}
			});
	};
	Object.defineProperty(this, "clearCapturedGanttBar", {
		get: function() {
			return _clearCapturedGanttBar;
		},
		enumerable: false,
		configurable: false
	});
	
};


}//if(!jedo.hasOwnProperty("CapturedGanttBar")) {

