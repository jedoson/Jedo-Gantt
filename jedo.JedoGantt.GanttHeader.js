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


if(!jedo.JedoGantt.hasOwnProperty("GanttHeader")) {

jedo.JedoGantt.GanttHeader = function (oJedoGantt) {
			
	Object.defineProperty(this, "jedoGantt", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: oJedoGantt
	});

};
	


}//if(!jedo.JedoGantt.hasOwnProperty("GanttHeader"))