var a=['a','b','c','d','e','f','g','h','i']
var b=a[Math.floor(a.length*Math.random())];
//console.log('b: ',b);
var c=[{href:"href1",d:"20"},{href:"href2", d: 6},{href:"href3",d:"22"},{href:"href4", d:8}]
	var d=c[Math.floor(c.length*Math.random())];
	console.log('d: ', d)
var abba=[];
c.forEach(function(el,i){
if(el.d==6)abba.unshift(el)
if(el.d !=6)abba.push(el);	
})
console.log('abba: ', abba);