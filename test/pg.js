const PORT = 3000;
const Koa=require('koa');
const db_url='postgress://globik:null@localhost:5432/test';
const url=require('url');
const Pool=require('pg-pool');

const pgn=require('pg').native.Client;

//const pgn=require('pg-native');
//console.log("pgn: ", pgn);

const pars=url.parse(db_url);
const cauth=pars.auth.split(':');
const pg_opts = { user:cauth[0],password:cauth[1],host:pars.hostname,port:pars.port,database:pars.pathname.split('/')[1],ssl:false,
	Client:pgn
	};
const pool = new Pool(pg_opts);
pool.on('connect', function(client){console.log('db connected!')})
pool.on('error', function(err, client){console.log('db err: ', err.name)})
pool.on('acquire', function(client){console.log('db acquired!')})

const app=new Koa();
app.on('error',function(){console.log('app err')})
app.listen(PORT);
console.log('soll on port: ', PORT, 'started.');
pool.query("select*from busers").then(function(dat){console.log('dat:', dat.rows[0].name)}).catch(function(err){
console.log('err: ',err)})
// which pg_config
// /usr/local/pgsql/include/libpq-fe.h
// /usr/local/pgsql/bin/pg_config
// export PATH=$PATH:/usr/local/pgsql/bin
// /usr/local/pgsql/lib/libpq.so.5
// /usr/local/pgsql/lib/libpq.so.5.12
// export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/pgsql/lib/
