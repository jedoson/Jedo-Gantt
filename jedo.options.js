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
if(!jedo.hasOwnProperty("options")) {
	
jedo.options = {
		
		// 뷰모드 UnitDate, FitSize 
		viewMode : "FitSize",
		
		// 수정금지.
		editMode : true,
		
		
		startGanttDate : new Date(Date.UTC(2013, 0, 1)),
        endGanttDate   : new Date(Date.UTC(2014, 3, 15)),
        
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
       
        
        ganttBarHeight: 40,
        
       
		// 최소 라인 높이.	       
        minUnitHeight : 30,
        // 최소 폭.
        minUnitWidth : 100
	};

} // if(!jedo.hasOwnProperty("options")) {


