var express=require('express');
var path=require('path');
var app=express();
//var nano=require('nanomsg');
//var sub=nano.socket('pair');
//var adr='ipc:///tmp/janus.ipc';

app.set('port',3000);
app.use(express.static('html'));
var server=app.listen(app.get('port'),function(){
var port=server.address().port;
console.log("soll on port: ",port);
});
/*
sub.connect(adr);
sub.on('data',function(d){console.log('data: ',d.toString())})
setTimeout(function(){sub.send('a');},2000);
*/
