const port=3000;
const Koa=require('koa');
const db_url='postgres://globik:null@localhost:5432/test';
var PS=require('pg-pubsub');
var app=new Koa();
var ps=new PS(db_url);
ps.addChannel('events', function (msg){console.log('msg: ', msg);});
app.listen(port);
console.log('port: ', port);
