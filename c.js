const db_url='postgress://globi:globi@localhost:5432/globi'
const Pool=require('pg-pool')
const url=require('url')
const pars=url.parse(db_url)
const cauth=pars.auth.split(':')
const pg_ops={
	user:cauth[0],
	password:cauth[1],
	host:pars.hostname,
	port:pars.port,
	database:pars.pathname.split('/')[1],
	ssl:false
	}
const pool=new Pool(pg_ops)
pool.on('connect',function(c){console.log('db connected!')})
pool.on('acqire',function(c){console.log('acqired!')})
pool.on('error',function(er,c){console.log('err: ',er)})
pool.query('select*from baner',function(er,d){
if(er)console.log(er)
console.log('data: ',d.rows[0])	
})
/*
 * 1) sudo -u globi psql
 * 2) alter role globi password 'globi'; (for exampl
 * e)
 */ 
