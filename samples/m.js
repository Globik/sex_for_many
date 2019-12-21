var moment=require('moment');
var l=moment().subtract(19,'days').calendar();
console.log(l);
var d='2019-12-20 06:41:18.683334-05';
var a=moment(d).format('YYYY-MM-DD hh:mm');
console.log('a: ', a);
var b=moment(d,"YYYYMMDD").fromNow();
console.log('b: ', b);
var c=new Date(d);
console.log('c: ',c);
var e=c.getFullYear();
console.log('e: ',e);
var f=c.getMonth();
console.log('f: ',f+1);
var g=c.getDate();
console.log('g: ',g);
var h=c.getHours();
console.log('h: ',h);
var i=c.getMinutes();
console.log('i: ',i);
var s_data=function(d){
var e_g=c.getFullYear();
var f_g=c.getMonth();
var g_g=c.getDate();
var h_g=c.getHours();
var i_g=c.getMinutes();
return e_c+'-'+f_g+'-'+g_g+' '+h_g+':'+i_g;
}
console.log('data: ',s_data(d));
