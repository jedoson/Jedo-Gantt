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
		//endGanttDate.setDate(startGanttDate.getDate()+100);
		
		var options = $.extend({},jedo.options,options);
		
		var oGanttContainer = $(this);
		oGanttContainer.addClass("ganttContainer");
		oGanttContainer.width(document.documentElement.clientWidth - 5);
		oGanttContainer.height(document.documentElement.clientHeight - 5);

		var svg = d3.select("#"+oGanttContainer.attr("id")).append("svg")
					.attr("width", oGanttContainer.width()-17)
					.attr("height", (options.ganttData.length+options.header.viewLineCount)*options.lineHeight);
		var oJedoGantt = new window.jedo.JedoGantt(options, this, svg);
		oJedoGantt.initJedoGantt();
		
	};
})(jQuery);



