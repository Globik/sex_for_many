var {spawn}=require('child_process');
var fs=require('fs');
var abba=["Globi_1.webm","Globi_2.webm","Globi_3.webm","Globi_4.webm"]//,"Globi_5.webm"];
var a=['-i',"concat:public/video/Globi/Globi_1.webm|public/video/Globi/Globi_2.webm|public/video/Globi/Globi_3.webm|public/video/Globi/Globi_4.webm","-y","-c","copy","fuck.webm"];
//var a=["-i","concat:","./public/video/Globi/Globi_1.webm","./public/video/Globi/Globi_2.webm","./public/video/Globi/Globi_3.web.m","-c","-y","copy","fuck.webm"]
var sara=[];
//ls.stderr.on('data',data=>{console.log(data.toString())})
//ls.stdout.on('data',data=>{console.log(data.toString())})
abba.forEach(function(el,i){
	sara.push("-i","concat:./public/video/Globi/"+el)
})
sara.push("-c","copy","-y","./public/vid/outputi.webm");
console.log("sara", sara);

var b=["-f","concat","-i","output.txt","-y","-c","copy","fuck.webm"];



//const ls=spawn('ffmpeg',b);


//ls.stderr.on('data',data=>{console.log(data.toString())})
//ls.stdout.on('data',data=>{console.log(data.toString())})

function jopa(){
	return new Promise(function(res,rej){
var stream=fs.createWriteStream("myfile.txt");
stream.once('open',(fd)=>{
	abba.forEach(function(el,i){
	stream.write("file '"+el+"'\n")	
	})
	stream.end();
	})
stream.on('close',function(){console.log("closeeeeeeeee");res("DURA")})
})
}
(async function da(){
	try{
	let d=await jopa();
	console.log("D: ",d)
}catch(e){console.log("err 1:",e)}
})()
