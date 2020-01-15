var fs=require('fs');
var {spawn}=require('child_process');
var a=[
"test",
"-f", "./sql/ads.sql",
"-f","./sql/blog.sql",
"-f","./sql/buser.sql",
"-f","./sql/chat.sql",
"-f","./sql/cladr.sql",
"-f","./sql/obi.sql",
"-f","./sql/prim_adr.sql",
"-f","./sql/profile.sql",
"-f","./sql/reklama.sql",
"-f","./sql/room.sql"
]
var ls=spawn('/usr/local/pgsql/bin/psql',a);
ls.stderr.on('data',data=>{console.log(data.toString())})
ls.stdout.on('data',data=>{console.log(data.toString());})
/*
 [ 'ads.sql',
  'blog.sql',
  'buser.sql',
  'chat.sql',
  'cladr.sql',
  'obi.sql',
  'prim_adr.sql',
  'profile.sql',
  'reklama.sql',
  'room.sql' ]
  */ 
