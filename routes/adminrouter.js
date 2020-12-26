const fs=require('fs');
const util=require('util');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.2.4
const sluger=require('limax');
const axios=require('axios').default;
const readdir=util.promisify(fs.readdir);
const unlink=util.promisify(fs.unlink);
const uploader=require('huge-uploader-nodejs')
const {WELCOME}=require('../config/mail.js');
const adm=new Router();
const GMAIL="globalikslivov@gmail.com";

adm.get('/home/dashboard', authed, async ctx=>{
	ctx.body=await ctx.render('admin_dashboard',{});
});
adm.post("/home/profile/enable_btc", auth, async ctx=>{
console.log("ctx request body: ", ctx.request.body);
ctx.body={info:"ok", btc_pay:ctx.state.btc_pay}	
})
adm.post("/home/profile/btc_test", auth, async ctx=>{
console.log(ctx.request.body);
let db=ctx.db;
try{
await db.query('update prim_adr set type=$1',[ctx.state.is_test_btc]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"ok", is_test_btc:ctx.state.is_test_btc};	
})

adm.post("/home/profile/save_btc_adr", auth, async ctx=>{
console.log(ctx.request.body);
let db=ctx.db;
let {test_btc_adr,percent,test, btc_adr}=ctx.request.body;
if(test){
if(!test_btc_adr)ctx.throw(400,"No testnet bitcoin address provided!")
let vali=walletValidator.validate(test_btc_adr,'bitcoin','testnet');

if(!vali){ctx.throw(400,"Not a valid testnet bitcoin address!");}
try{
//await db.query("delete from prim_adr where type=true");
//await db.query("insert into prim_adr(adr, type) values($1, $2)",[test_btc_adr, true]);
//await db.query("delete from cladr");
}catch(e){ctx.throw(400, e);}
ctx.body={info:"ok",test_btc_adr, percent, test}	
} else{
if(!test_btc_adr)ctx.throw(400,"No test bitcoin address provided!")
let vali=walletValidator.validate(test_btc_adr,'bitcoin');

if(!vali){ctx.throw(400,"Not a valid bitcoin address!");}
try{
//await db.query("delete from prim_adr where type=false");
//await db.query("insert into prim_adr(adr, type) values($1, $2)",[test_btc_adr, false]);//await db.query("delete from cladr");
}catch(e){ctx.throw(400, e);}

ctx.body={info:"ok",test_btc_adr, percent, test}	
}
})

adm.post("/home/profile/btc_adr",auth,async ctx=>{
let {btc_adr}=ctx.request.body;
if(!btc_adr)ctx.throw(400,"no btc address provided!");
let vali=walletValidator.validate(btc_adr,'bitcoin');
if(!vali){ctx.throw(400,"Not a valid bitcoin address!");}
let db=ctx.db;
try{
await db.query('update prim_adr set adr=$1',[btc_adr]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK,saved btc address"}	
})

adm.post("/home/profile/test_btc_adr",auth,async ctx=>{
let {test_btc_adr}=ctx.request.body;
if(!test_btc_adr)ctx.throw(400,"no btc address provided!");
let vali=walletValidator.validate(test_btc_adr,'bitcoin','testnet');
if(!vali){ctx.throw(400,"Not a valid test bitcoin address!");}
let db=ctx.db;
try{
await db.query('update prim_adr set tadr=$1',[test_btc_adr]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK, saved test btc address"}	
})

adm.post("/home/profile/SET_BTC_ADDRESS",auth,async ctx=>{
console.log("HERE request body ",ctx.request.body);
ctx.body={test_btc_address:ctx.test_btc_address,btc_address:ctx.btc_address}
});

adm.post("/home/profile/set_btc_adr", auth, async ctx=>{
console.log("HERE request body ",ctx.request.body);
let test = ctx.request.body.test;
//console.log("TYPE: ", test);
if(test){
ctx.body={info:"fucker", btc_address: ctx.state.test_btc_address}
}else{
//console.log("HERE ADR ", ctx.state.btc_address,"type ",test)
ctx.body={info: "no fucker", btc_address: ctx.state.btc_address}	
}	
})
//new avatars of user
adm.get("/home/newavas", authed, async ctx=>{
let db=ctx.db;
let err;
let a;
try{
let result=await db.query('select bname, ava from profile where isava=1');
if(result.rows)a=result.rows;
//console.log('result: ',result.rows);	
}catch(e){err=e;}
ctx.body=await ctx.render('newavas',{err:err,result:a});	
})

adm.post('/api/ava-checked', auth, async ctx=>{
let {fname}=ctx.request.body;
if(!fname)ctx.throw(400,"Нет ника!");
let db=ctx.db;
try{
await db.query('update profile set isava=2 where bname=$1',[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:fname};	
});

adm.post('/api/ava-delete', auth, async ctx=>{
let {fname}=ctx.request.body;
if(!fname)ctx.throw(400,"Нет ника!");
let db=ctx.db;
try{
await db.query(`update profile set ava='', isava=0 where bname=$1`,[fname]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:fname};	
})

adm.post("/api/del_users", auth, async ctx=>{
	let db=ctx.db;let l;
	try{
		l=await db.query("delete from buser where ll < NOW() - interval '3 months'");
		console.log('l: ', l.rows);
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info: (l&&l.rows.length?"OK, users deleted!":"No users match")}
	})

adm.get("/home/newmsg", authed, async ctx=>{
let db=ctx.db;
let result;
try{
result=await db.query('select*from obi where isg=0');	
}catch(e){console.log(e);}	
ctx.body=await ctx.render('newmsg',{result:result.rows});
})
adm.post('/api/ok_msg', auth, async ctx=>{
let {id}=ctx.request.body;
if(!id)ctx.throw(400,"Нет идентификатора");
let db=ctx.db;
try{
await db.query('update obi set isg=1 where id=$1',[id]);	
}catch(e){
ctx.throw(400,e);	
}	
ctx.body={info:"OK",id:id};
})
adm.post('/api/del_msg', auth, async ctx=>{
let {id}=ctx.request.body;
	if(!id)ctx.throw(400,"Нет идентификатора");
let db=ctx.db;
try{
await db.query('delete from obi where id=$1',[id]);	
}catch(e){
ctx.throw(400,e);	
}	
ctx.body={info:"OK",id:id};
})

/* VIDEOS */

adm.post("/api/video_delete", auth, async ctx=>{
let { vid, src } = ctx.request.body;
if( !vid || !src )ctx.throw(400, "no vid or src provided");
let db = ctx.db;
try{
await db.query('delete from video where id=$1', [ vid ]);
await unlink(process.env.HOME + '/sex_for_many/public/vid/' + src);
}catch(e){ ctx.throw(400, e); }
ctx.body = { info: "OK, deleted!" }	
})

/* VIDEOFILES */

adm.get("/home/videofiles", authed, async ctx=>{
let res;
try{
res = await readdir(process.env.HOME + '/sex_for_many/public/vid');
}catch(e){ console.log(e) }
ctx.body = await ctx.render('videofiles',{ result: res });	
})

adm.post("/api/del_video_f", auth, async ctx=>{
let { src } = ctx.request.body;
if(!src) ctx.throw(400, "No src")
let db = ctx.db;
try{
await db.query('delete from video where src=$1', [ src ]);
await unlink(process.env.HOME + '/sex_for_many/public/vid/' + src);
}catch(e){
ctx.throw(400, e)	
}
ctx.body = { info: "OK, deleted!", src: src }
})

/* XIRSYS */

adm.get('/home/xirsys', authed, async ctx=>{
	console.log("URL: ", ctx.url);
	console.log("ORIGIN: ", ctx.origin);
	console.log("HOSTNAME: ", ctx.hostname);
	console.log("protocol: ", ctx.protocol);
	console.log("secure: ", ctx.secure);
ctx.body=await ctx.render('xirsys',{});	
})

adm.post('/api/get_xirsys', auth, async ctx=>{
let v;
let vsec='867f06f6-1065-11ea-a46b-0242ac110003';
let vurl="https://Globi:"+vsec+"@global.xirsys.net/_turn/alikon";
	 try{
let bod = await axios.put(vurl,{format:"urls"});
v=bod.data.v.iceServers;
console.log('status: ', bod.data.status);
console.log('statusText: ', bod.data.statusText); 
console.log('v: ', v);
}catch(e){ctx.throw(400, e);}
ctx.body={xir:v}	
})

adm.post('/api/set_xirsys', auth, async ctx=>{
	let {xir}=ctx.request.body;
	if(!xir)ctx.throw(400,"Ни одного сервера не предоставлено.");
	ctx.body={xir:ctx.state.xirsys}
	})
	
	/* PAYOUTS */
	
adm.get('/payout', authed, async ctx=>{
let db=ctx.db;
let payout;
try{
let a=await db.query('select * from buser where items > 2000 and bcard > 0');	
if(a.rows)payout=a.rows;
}catch(e){console.log(e);}
ctx.body=await ctx.render('payout',{payout:payout});	
})
adm.post("/api/payout_money",auth,async ctx=>{
let {amount,bcard,bname,email}=ctx.request.body;
console.log(ctx.request.body)
if(!amount || !bname || !email){ctx.throw(400,"No data");}
let db=ctx.db;
try{
//await db.query('insert into token_payout(tom,suma) values($1,$2::numeric)',[bname,amount]);
//await db.query('update buser set items=0 where bname=$1',[bname]);
await db.query('select on_token_payout($1,$2::numeric)', [bname,amount]);
let t=ctx.transporter;
	t.sendMail({
		from: GMAIL,
		to: email,
		subject:'Выплата',
		text: `Вам выплата ${amount} рублей от Globikon`
		}
	,(err,info)=>{
		console.log(info)
		console.log(err);
		}) 	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK"}	
})
	/* REKLAMA */
	
adm.get('/home/reklama', authed, async ctx=>{
	let db=ctx.db;
	let result;
	try{
		result=await db.query('select*from reklama where statu=1 or statu=2');
		}catch(e){
	console.log(e);	
	}
	ctx.body=await ctx.render('reklama',{result:result.rows});
	})
	adm.post("/api/fetch_folder", auth, async ctx=>{
		let {folder}=ctx.request.body;
		if(!folder)ctx.throw(400,"Папака неизвестна");
		try{
			var ab=await readdir('./public/'+folder,{});
			console.log('ab: ', ab);
			}catch(e){ctx.throw(400,e);}
		let data=await ctx.render('reklama_fold',{names:ab, path:folder});
		ctx.body={info:"ok", data: data}
		})
		
	adm.post("/api/del_foto", auth, async ctx=>{
		let {src, path}=ctx.request.body;
		if(!src ||!path)ctx.throw(400,"Нет пути!");
		try{
			await unlink("./public/"+path+"/"+src);
			}catch(e){
			ctx.throw(400, e);
			}
		ctx.body = {info: "Фото удалено!"}
		})
		
adm.post('/api/set_reklama', auth, 
		bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
		 async ctx=>{
let {zfile}=ctx.request.body.files;
let {zhref, zstart, zend, zname, ztype, zstatus, zprice, zmeta}=ctx.request.body.fields;
if(!zhref || !zstart || !zend || !zname || !ztype || !zstatus || !zprice)ctx.throw(400, "no data provided");
let db=ctx.db;
if(!zfile)ctx.throw(400,"no file provided.");
if(!zfile.name)ctx.throw(400, "no file name");
console.log('file path: ', zfile.path);
let s_s='./public/reklama/'+zfile.name;
let s='insert into reklama(src, href, anf, ed, nick, typ, price, meta, statu) values($1, $2, $3, $4, $5, $6, $7, $8, $9)';
try{
await insert_foto(zfile.path, s_s);
await db.query(s, [zfile.name, zhref, zstart, zend, zname, ztype, zprice, zmeta, zstatus])

}catch(e){
ctx.throw(400,e);
}	
ctx.body={info:"OK, saved."}
})
		
function insert_foto(path, name){
return new Promise(function(res,rej){
var readstr=fs.createReadStream(path);
var writestr=fs.createWriteStream(name);
readstr.pipe(writestr);
readstr.on('open', function(){console.log('readstr is open');})
readstr.on('close', function(){
console.log('readstr is close');
fs.unlink(path, function(e){
if(e){
console.log('readstr erri: ',e);
rej(e);
}
})
})
writestr.on('open', function(){console.log('writestr is open');})
writestr.on('close',  function(){
console.log('writestr is close');
res()
})
})
}
			
		
adm.post('/api/save_foto_blog', auth,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
 async ctx=>{
let {filew}=ctx.request.body.files;
if(!filew)ctx.throw(400,"no pic");
if(!filew.name)ctx.throw(400,"no picture");

console.log('filev.name: ', filew.name);

let s_s = './public/blog/'+filew.name;
console.log('filew.path: ', filew.path);
console.log('filew.name: ', filew.name);
try{
	await insert_foto(filew.path, s_s);
	}catch(e){
	ctx.throw(400, e);
	} 
ctx.body={info:"ok, saved",src:filew.name}				
})
/*
adm.post("/api/fetch_blog_folder", auth, async ctx=>{
		let {folder}=ctx.request.body;
		if(!folder)ctx.throw(400,"Папака неизвестна");
		try{
			var ab=await readdir('./public/'+folder,{});
			console.log('ab: ', ab);
			}catch(e){ctx.throw(400,e);}
		let data=await ctx.render('reklama_fold',{names:ab});
		ctx.body={info:"ok", data: data}
		})*/
		
adm.post("/api/save_start_reklama", auth, async ctx=>{
	let {start, id}=ctx.request.body;
	if(!start || !id){ctx.throw(400, "no strart time provided!");}
	let db=ctx.db;
	try{
		await db.query('update reklama set anf=$1 where id=$2', [start, id])
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"start time saved!"}
	});
	
	adm.post("/api/save_end_reklama", auth, async ctx=>{
	let {end, id}=ctx.request.body;
	if(!end || !id){ctx.throw(400, "no end time provided!");}
	let db=ctx.db;
	try{
		await db.query('update reklama set ed=$1 where id=$2', [end, id])
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"end time saved!"}
	});
	
	adm.post("/api/save_opt_reklama", auth, async ctx=>{
	let {opt, id}=ctx.request.body;
	if(!opt || !id){ctx.throw(400, "no status provided!");}
	let db=ctx.db;
	try{
		await db.query('update reklama set statu=$1 where id=$2', [opt, id])
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"status saved!"}
	});
	
	adm.post("/api/save_content_reklama", auth, async ctx=>{
	let {content, id}=ctx.request.body;
	if(!content || !id){ctx.throw(400, "no content provided!");}
	let db=ctx.db;
	try{
		await db.query('update reklama set meta=$1 where id=$2', [content, id])
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"Content saved!"}
	});
	
	adm.post("/api/del_reklama", auth, async ctx=>{
		let {id}=ctx.request.body;
		if(!id)ctx.throw(400, "No id");
		let db=ctx.db;
		try{
			await db.query('delete from reklama where id=$1', [id]);
			}catch(e){ctx.throw(400, e);}
		ctx.body={info: "OK, deleted!"}
		})
		
		adm.post("/api/click_reklama", async ctx=>{
			let {id}=ctx.request.body;
			if(!id){ctx.throw(400,"no id");}
			let db=ctx.db;
			try{
				await db.query("update reklama set cl=cl+1 where id=$1", [id]);
				}catch(e){ctx.throw(400, e);}
			ctx.body={info:"ok, reklama clicked"}
			})
			
			adm.post("/api/get_foto_info", auth, async ctx=>{
				let {src}=ctx.request.body;
				if(!src)ctx.trhow(400, "no src");
				let db=ctx.db;
				let info;
				try{
					let a=await db.query('select*from reklama where src=$1', [src]);
					if(a.rows.length){
						info=a.rows[0];
						}
					}catch(e){
					ctx.throw(400, e);
					}
				ctx.body={info:info}
				})
				
adm.post("/api/del_obi", auth, async ctx=>{
let {id}=ctx.request.body;
if(!id)ctx.throw(400, "no id");
let db=ctx.db;
try{
	await db.query('delete from obi where id=$1', [id]);
	}catch(err){ctx.throw(400, err);}	
	ctx.body={info:"OK deleted", id: id};
});
			
/* ADVERTISE */

adm.post("/api/save_post_advertise", auth, async ctx=>{
	let {art, sub}=ctx.request.body;
	if(!art || !sub)ctx.throw(400, "No text, no sub");
	let db=ctx.db;
	try{
		let a=await db.query("update ads set art=$1 where sub=$2", [art, sub]);
		console.log("A: ", a.rowCount);//rowCount=0
		if(a.rowCount==0){
			let b=await db.query("insert into ads(art, sub) values($1, $2)", [art, sub]);
			console.log("b.rowCount: ", b.rowCount);
			}
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"OK, text saved!"}
	})	
	
	/* BASA  знаний */
	
adm.post("/api/save_post_basa", auth, async ctx=>{
	let {art, sub}=ctx.request.body;
	if(!art || !sub)ctx.throw(400, "No text, no sub");
	let db = ctx.db;
	try{
		let a = await db.query("update ads set art=$1 where sub=$2", [art, sub]);
		console.log("A: ", a.rowCount);//rowCount=0
		if(a.rowCount == 0){
			let b = await db.query("insert into ads(art, sub) values($1, $2)", [art, sub]);
			console.log("b.rowCount: ", b.rowCount);
			}
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body = {info:"OK, text saved!"}
})
	
	/* PRIVACY */
	
	adm.post("/api/save_post_privacy", auth, async ctx=>{
	let {art, sub}=ctx.request.body;
	if(!art || !sub)ctx.throw(400, "No text, no sub");
	let db=ctx.db;
	try{
		let a=await db.query("update ads set art=$1 where sub=$2", [art, sub]);
		console.log("A: ", a.rowCount);//rowCount=0
		if(a.rowCount==0){
			let b=await db.query("insert into ads(art, sub) values($1, $2)", [art, sub]);
			console.log("b.rowCount: ", b.rowCount);
			}
		}catch(e){
		ctx.throw(400, e);
		}
	ctx.body={info:"OK, text saved!"}
	})	
	
adm.post("/get_session", auth, async ctx=>{
let db=ctx.db;
let res;
try{
	res=await db.query('select session from session');
}catch(e){ctx.throw(400, e);}	
ctx.body={res:res.rows}
})			
		
		console.log("WELCOME.html: ", WELCOME.html);	
			/* SEND MAIL TEST */
adm.post("/send_mail", auth, async ctx=>{
	
	let t=ctx.transporter;
	t.sendMail({
		from: "",
		to: "gru5@yandex.ru",
		subject:'Welcome to the GLOBIKON!',
		//text: "hallo alik",//WELCOME({nick:"Globi",id:1}).text ,
		html:WELCOME({nick:"Globi",id:1}).html
	},(err,info)=>{
		console.log('info  mail: ',info)
		if(err){
		console.log(err);
		//console.log("WELCOME.html: ", WELCOME.html);
	}
		}) 
	ctx.body={info:"ok, email sent\n"}
	});
			/* USERS */
			/*
adm.get("/home/users", authed, async ctx=>{
let db=ctx.db;
let result;
try{
	result = await db.query("select*from buser");
	}catch(e){
	console.log(e);
	}
	ctx.body=await ctx.render("users",{result:result.rows});
})
*/ 

/* BLOG */

adm.get("/home/write-post", authed, async ctx=>{
	ctx.body=await ctx.render('writePost',{});
	})
	
adm.post("/api/writePost", auth, bodyParser({multipart:true,formidable:{}}),
	 async ctx=>{
		let {auth, title, body, descr}=ctx.request.body.fields;
		if(!auth || !title || !body)ctx.throw(400, "no auth or title or body!");
		var titi=sluger(title);
		let db=ctx.db;
		try{
			
			await db.query('insert into blog(auth, title, slug, body, descr) values($1,$2,$3,$4,$5)', [auth, title, titi, body, descr]);
			}catch(e){
			ctx.throw(400, e);
			}
		ctx.body={info: "OK, saved!"}
		})
		
		adm.post('/api/save_blog', auth, async ctx=>{
			let {text,id,title, descr}=ctx.request.body;
			if(!text || !id || !title)ctx.throw(400, "No data provided");
			let db=ctx.db;
			let ti=sluger(title);
			try{
				console.log("descr: ", descr);
				await db.query('update blog set title=$1, slug=$2, body=$3 , descr=$4 where id=$5',[title,ti,text,descr,id]);
				}catch(e){ctx.throw(400,e);}
				ctx.body={info: "OK saved!"}
				//ctx.redirect("/home/blog");
			})
			
adm.post("/api/remove_post", auth, async ctx=>{
	let {id}=ctx.request.body;
	if(!id)ctx.throw(400, "No id");
	let db=ctx.db;
	try{
		await db.query('delete from blog where id=$1',[id]);
		}catch(e){ctx.throw(400, e);}
ctx.body={info:"OK deleted"}	
})			
			/*
adm.post('/api/save_foto_blog', auth,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
 async ctx=>{
ctx.body={info:"ok, saved",src:src}				
})
*/ 

adm.get('/home/profile', authed, async ctx=>{
let db=ctx.db;
let err;
let a;
try{
//let result=await db.query('select bname, age, isava, vs from profile');
//if(result.rows.length)a=result.rows;
//console.log('a: ',a);	
}catch(e){err=e;}
ctx.body=await ctx.render('profiles',{err:err,result:[{1:1}]});	
})
/* DB SIZE */

adm.post("/api/db_total_size", auth, async ctx=>{
let db=ctx.db;
let r;
let name=(process.env.DEVELOPMENT=='yes'?'test':'globi')
try{
r=await db.query(`select pg_size_pretty(pg_database_size('${name}'))`);
//console.log(r.rows[0]);	
}catch(e){ctx.throw(400, e);}
ctx.body={info:r.rows[0]}	
});
adm.post("/api/table_size", auth, async ctx=>{
let db=ctx.db;
let {s}=ctx.request.body;
let r;
if(!s)ctx.throw(400, "no data");
try{
r=await db.query(`select pg_size_pretty(pg_relation_size('${s}'))`)	
}catch(e){ctx.throw(400, e);}	
ctx.body={info:r.rows[0], table: s}
})

/* fake video */
adm.get("/home/fakevideo", authed,async ctx=>{
let db=ctx.db;
let r,e;
try{
let a=await db.query(`select*from vroom where typ='fake'`);
r=a.rows;	
console.log('r: ', r);
}catch(e){
e=e;	
}
ctx.body=await ctx.render('fakevideo',{videos:r, err:e});	
})

const tmp="./public/uploads/tmp";
const maxfilesize=1000000000;
// github.com/Buzut/huge-uploader-nodejs
adm.post("/fakevideo", auth, async ctx=>{
console.log("YES")
console.log('params ', ctx.request.body,ctx.params)
//console.log('req: ', ctx.req.pipe)
let db=ctx.db;
try{
let assembleChunks=await uploader(ctx.req,tmp,maxfilesize,1500000);
	ctx.status=204;
	ctx.body={info:"ok"}
	if(assembleChunks){
	try{
	let data=await assembleChunks();
	console.log('data: ',data)
	let pi='./public/vid/'+data.postParams.nick;
	let pi2=data.postParams.nick;
	try{
	await insert_foto(data.filePath, pi)
	await db.query("insert into vroom(us_id,nick,src,typ) values($1,$2,$3,'fake')",[data.postParams.us_id,data.postParams.name,
	data.postParams.nick])
	}catch(e){
		console.log(e);
		try{await unlink(data.filePath)}catch(e){console.log(e)}
		ctx.throw(400,e);
		}
	}catch(err){
		console.log('ERR1 :',err)
		try{await unlink(data.filePath)}catch(e){console.log(e)}
		}	
	}
}catch(err){
	try{await unlink(data.filePath)}catch(e){console.log(e)}
	if(err.message==="Missing header(s)"){
		
	ctx.throw(400,'missing uploader-* header')	
	}
	if(err.message==='Missing Content-Type'){
	ctx.throw(400,'Missing Content-Type')	
	}
	if(err.message.includes('Unsupported content type')){
		ctx.throw(400,'Unsupported content type')	
	}
	if(err.message==='Chunk is out of range'){
	ctx.throw(400,'chunk number must be between 0 and total chunks - 1 (0 indexed)')	
	}
	if(err.message==='File is above size limit'){
	ctx.throw(413,'file is too large. max chunksize is: '+maxfilesize)
		}
		if(err.message==='Chunk is above size limit'){
		ctx.throw(413,'chunk is too large.')	
		}
		if(err && err.message==='Upload has expired'){
			ctx.throw(410,err.message)
		}
	}
ctx.body={info:"ok"}	
})

adm.post("/save_fake_user", auth, async ctx=>{
let {username}=ctx.request.body;
if(!username)ctx.throw(400,"no name provided")
let db=ctx.db;
let e=username+'@ya.ru';
let r;
try{
r=await db.query("insert into buser(pwd,bname,email,brole) values('1234',$1,$2,'fake') returning id",[username,e]);	
}catch(er){ctx.throw(400,er)}
ctx.body={info:username,us_id:r.rows[0].id}	
})

adm.post("/api/save_room_descr", auth, async ctx=>{
let {roomdescr,username}=ctx.request.body;
if(!roomdescr)ctx.throw(400,"no room description!");
if(!username)ctx.throw(400,"no username!");
console.log('roomdescr: ', roomdescr);
let db=ctx.db;
try{
await db.query('update buser set stat=$1 where bname=$2',[roomdescr, username]);
}catch(e){}
ctx.body={info:"ok, saved room description"};	
})

adm.post("/fake_poster",auth, bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}), async ctx=>{
	//console.log(ctx.request.body.files)
	//console.log(ctx.request.body.fields);
	let {tposter}=ctx.request.body.files;
	let {nick}=ctx.request.body.fields;
	console.log('nick:',nick)
	let db=ctx.db;
	let s_s='./public/vid/'+tposter.name;
	try{
		await insert_foto(tposter.path, s_s);
		await db.query("update vroom set p=$1 where nick=$2",[ tposter.name, nick ]);
		}catch(e){ctx.throw(400,e)}
	ctx.body={info: "ok"}
})
adm.post("/api/del_fake_video",auth,async ctx=>{
let {src,p,us_id,nick}=ctx.request.body;
if(!src || !p || !us_id || !nick)ctX.throw(400,"no data provided");
let db=ctx.db;
try{
await unlink(process.env.HOME + '/sex_for_many/public/vid/' + src);
}catch(e){ctx.throw(400,e);}
try{
await unlink(process.env.HOME + '/sex_for_many/public/vid/' + p);
}catch(e){ctx.throw(400,e);}
try{
await db.query('delete from vroom where us_id=$1',[us_id]);	
}catch(e){ctx.throw(400,e);}

try{
await db.query('delete from buser where bname=$1',[nick]);	
}catch(e){ctx.throw(400,e);}
ctx.body={info:"OK - deleted!",id:us_id};	
});
/*
adm.post('/api/save_foto_blog', auth,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',keepExtensions:true}}),
 async ctx=>{
let {filew}=ctx.request.body.files;
if(!filew)ctx.throw(400,"no pic");
if(!filew.name)ctx.throw(400,"no picture");

console.log('filev.name: ', filew.name);

let s_s = './public/blog/'+filew.name;
console.log('filew.path: ', filew.path);
console.log('filew.name: ', filew.name);
try{
	await insert_foto(filew.path, s_s);
	}catch(e){
	ctx.throw(400, e);
	} 
ctx.body={info:"ok, saved",src:filew.name}				
})
*/ 
module.exports=adm;

function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}
