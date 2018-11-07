!function(e){function t(n){if(a[n])return a[n].exports;var r=a[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var a={};t.m=e,t.c=a,t.d=function(e,a,n){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,a){e.exports=a(1)},function(e,t,a){"use strict";var n=a(2),r=function(e){return e&&e.__esModule?e:{default:e}}(n),i=document.querySelector('[data-module="calendar"]');new r.default(i)},function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=function(){function e(t){n(this,e),this.elem=t,this.setVariables(),this.renderCalendar(),this.bindEvents()}return r(e,[{key:"setVariables",value:function(){this.weekStarts=parseInt(this.elem.dataset.weekStarts,10)||0,this.months=window.dcMonthList||["January","February","March","April","May","June","July","August","September","October","November","December"],this.days=window.dcDayList||[{abbr:"S",day:"Sunday"},{abbr:"M",day:"Monday"},{abbr:"T",day:"Tuesday"},{abbr:"W",day:"Wednesday"},{abbr:"T",day:"Thursday"},{abbr:"F",day:"Friday"},{abbr:"S",day:"Saturday"}];for(var e=0;e<this.weekStarts;e++)this.days.push(this.days.shift());this.today=new Date,this.eventList=window.dcEventList||[],this.language=this.elem.dataset.language?JSON.parse(this.elem.dataset.language):{prev:"Previous Month",next:"Next Month"},this.month=this.elem.dataset.month?this.elem.dataset.month:(new Date).getMonth()+1,this.year=this.elem.dataset.year?this.elem.dataset.year:(new Date).getFullYear(),this.day=Number.isInteger(parseInt(this.elem.dataset.day,10))?this.elem.dataset.day:null,this.ariaLive=this.elem.querySelector("[aria-live]")}},{key:"renderCalendar",value:function(){this.calendar=document.createElement("table"),this.calendar.classList.add("calendar"),this.calHeading=document.createElement("caption"),this.calHeading.classList.add("calender__caption"),this.calHead=document.createElement("thead"),this.calBody=document.createElement("tbody"),this.calendar.appendChild(this.calHeading),this.calendar.appendChild(this.calHead),this.calendar.appendChild(this.calBody),this.renderCaption(),this.renderHead(),this.renderDays(),this.elem.appendChild(this.calendar)}},{key:"renderCaption",value:function(){var e=document.createElement("div");this.prevMonth=this.renderButton("calendar__prev","prev",this.language.prev),this.nextMonth=this.renderButton("calendar__next","next",this.language.next),this.headingText=document.createElement("span"),this.headingText.classList.add("calender__caption__text"),this.setCaptionText(),e.appendChild(this.prevMonth),e.appendChild(this.headingText),e.appendChild(this.nextMonth),this.calHeading.appendChild(e)}},{key:"renderButton",value:function(e,t,a){var n=document.createElement("button");return n.classList.add(e),n.dataset.action=t,n.setAttribute("aria-label",a),n}},{key:"setCaptionText",value:function(){this.headingText.textContent=this.months[this.month-1]+" "+this.year}},{key:"renderHead",value:function(){var e="<tr>";this.days.forEach(function(t){e+='<th scope="col" class="calendar__weekday"><span aria-label="'+t.day+'">'+t.abbr+"</span></th>"}),e+="</tr>",this.calHead.innerHTML=e}},{key:"renderDays",value:function(){for(var e=1,t=1,a=this.daysInMonth(this.year,this.month),n=this.daysInMonth(this.year,this.month-1),r=this.dayOfWeek(this.year,this.month,1),i=Math.ceil((a+r)/7),s=new URLSearchParams(window.location.search),h="",d=0;d<i;d++){h+="<tr>";for(var o=0;o<7;o++){var l=this.year+"-"+this.month+"-"+e,c=this.year+"-"+this.month+"-"+this.day,u=this.today.getFullYear()+"-"+(this.today.getMonth()+1)+"-"+this.today.getDate();if(h+='<td class="calendar__day">',0===d&&o<r){var y=n-r+o+1;h+=this.returnDayNum(y,"-lastmonth")}else if(e>a)h+=this.returnDayNum(t,"-nextmonth"),t++;else{if(this.eventList&&this.eventList.indexOf(l)>=0){var p=new URLSearchParams;s.has("chp_chapter_number")&&p.set("chp_chapter_number",s.get("chp_chapter_number")),p.set("date",l);var m="";m+=u===l?" -today":"",m+=c===l?" -selected":"",h+='<a href="'+location.href.split("?")[0]+"?"+p.toString()+'" class="calendar__day__number -upcoming '+m+'">'+e+"</a>"}else h+=u===l?this.returnDayNum(e,"-today"):this.returnDayNum(e);e++}h+="</td>"}h+="</tr>"}this.calBody.innerHTML=h}},{key:"bindEvents",value:function(){this.prevMonth.addEventListener("click",this.changeMonth.bind(this)),this.nextMonth.addEventListener("click",this.changeMonth.bind(this))}},{key:"changeMonth",value:function(e){e.preventDefault();var t="next"===e.currentTarget.dataset.action?1:-1,a=new Date(this.year,parseInt(this.month,10)+t,0);this.month=a.getMonth()+1,this.year=a.getFullYear(),this.setCaptionText(),this.renderDays(),this.ariaLive.textContent=this.months[this.month-1]+" "+this.year}},{key:"returnDayNum",value:function(e,t){return'<div class="calendar__day__number '+t+'">'+e+"</div>"}},{key:"daysInMonth",value:function(e,t){return new Date(e,t,0).getDate()}},{key:"dayOfWeek",value:function(e,t,a){return new Date(t+"/"+a+"/"+e).getDay()-this.weekStarts}}]),e}();t.default=i}]);
//# sourceMappingURL=index.js.map