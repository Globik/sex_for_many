var fs=require('fs');
var {spawn}=require('child_process');
var a=[
"globi",
"-f", "./sql/ads.sql",
"-f","./sql/blog.sql",
"-f","./sql/buser.sql",
"-f","./sql/chat.sql",
"-f","./sql/cladr.sql",
"-f","./sql/obi.sql",
"-f","./sql/prim_adr.sql",
"-f","./sql/reklama.sql",
"-f","./sql/vroom.sql",
"-f","./sql/reset.sql",
"-f","./sql/token_order.sql",
"-f","./sql/token_transfer.sql",
"-f","./sql/token_payout.sql",
"-f","./sql/bitaps_tmp.sql",
"-f","./sql/tokens_buy.sql"
]
//const  ls=spawn('/usr/local/pgsql/bin/psql',a);
const ls=spawn('psql', a)
ls.stderr.on('data', data=>{console.log(data.toString())})
ls.stdout.on('data', data=>{console.log(data.toString());})
ls.on('exit',function(code){console.log("exit: ",code)})
