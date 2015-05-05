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
(function($){
	$.fn.jedoGantt = function(options) {
		
		
		var startGanttDate = new Date();
		var endGanttDate = new Date();
		endGanttDate.setDate(startGanttDate.getDate()+100);
		
		var defaults = {
			
			// 뷰모드 UnitDate, FitSize 
			viewMode : "FitSize",
			
			// 수정금지.
			editMode : true,
			
			
			startGanttDate : startGanttDate,
	        endGanttDate   : endGanttDate,
	        
	        // 시작주요일 : 0(일요일), 1(월요일), 
	        startWeekDay : 1,
	        
	        lineHeight : 50,
	        unitWidth : 100,
	        unitSpace : 1,
	        
	        header : {
	        	lineHeight      : 30,
	        	yearLine    	: true,
	        	quarterLine 	: true,
	        	monthLine   	: true,
	        	weekLine    	: true,
	        	dateLine    	: true,
	        	hourLine    	: false,
	        	minLine			: false,
	        	secLine			: false,
	        	milLine			: false,
	        	viewLineCount	: 3,
	        	
	        	fontSize : 13
	        },
	        
	        body : {
	        	
	        	barSpace : 5,
	        	oddLineBackground : '#f0ffff',
	        	addLineBackground : '#fffff0'
	        		
	        },
	        
	        ganttDataGridView : false,
	        ganttBodyWeekView : true,
	       
	        
	       
			// 최소 라인 높이.	       
	        minUnitHeight : 30,
	        // 최소 폭.
	        minUnitWidth : 100
		};
		
		var options = $.extend({},defaults,options);
		
		var oGanttContainer = $(this);
		oGanttContainer.addClass("ganttContainer");
		oGanttContainer.width(document.documentElement.clientWidth - 5);
		oGanttContainer.height(document.documentElement.clientHeight - 5);

		var nWidth = oGanttContainer.width()-17;
		var svg = Snap(nWidth, (options.ganttData.length+options.header.viewLineCount)*options.lineHeight).attr({
			id: oGanttContainer.attr("id")+"_SVG"
		});
		oGanttContainer.append(svg.node);
		
		var oJedoGantt = new window.jedo.JedoGantt(options, this);
		oJedoGantt.initJedoGantt(nWidth);
		oGanttContainer.on("scroll", function(event){
			svg.select('g.ganttHeader').transform('T0,'+$(this).scrollTop());
			svg.select('rect.ganttHeaderBack').transform('T'+$(this).scrollLeft()+',0');
		});
		
		svg.node.addEventListener("mousemove",oJedoGantt.mouseMoveBar.bind(oJedoGantt),false);
		svg.node.addEventListener("mouseup",  oJedoGantt.mouseUpBar.bind(oJedoGantt),  false);
		

	};
})(jQuery);



