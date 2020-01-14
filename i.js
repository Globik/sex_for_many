var fs=require('fs');
var {spawn}=require('child_process');
var suka=[];
fs.readdir('./sql', function(er,d){
	var s='';
	if(er)console.log(er);
	
	console.log('data: ', d);
	d.forEach(function(el,i){
		s+=' -f '+el;
		suka.push(',"-f", '+'"'+el+'"');
	})
	console.log('s :',s);
	console.log('d: ', d.join('-f'))
	console.log('suka: ', suka);
	console.log('B: ',suka.join(''));
	})

/*
var ls=spawn('/usr/local/pgsql/bin/psql',['test','-f','./sql/profile.sql','-f','./sql/room.sql']);
ls.stderr.on('data',data=>{cosnole.log(data.toString())})
ls.stdout.on('data',data=>{console.log(data.toString());})
*/
