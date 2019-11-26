//curl -s -H "Content-type: application/json" -XPUT "https://Globi:867f06f6-1065-11ea-a46b-0242ac110003@global.xirsys.net/_turn/alikon" -d '{"format": "urls"}'
//{"v":{"iceServers":{"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ==",
//"urls":[
//"stun:bturn2.xirsys.com",
//"turn:bturn2.xirsys.com:80?transport=udp",
//"turn:bturn2.xirsys.com:3478?transport=udp",
//"turn:bturn2.xirsys.com:80?transport=tcp",
//"turn:bturn2.xirsys.com:3478?transport=tcp",
//"turns:bturn2.xirsys.com:443?transport=tcp",
//"turns:bturn2.xirsys.com:5349?transport=tcp"
//],"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"}},"s":"ok"}
const reqw=require('request-promise-native');
let data={};
data.format="urls";
let mops={url: "https://Globi:867f06f6-1065-11ea-a46b-0242ac110003@global.xirsys.net/_turn/alikon",
	 method:"PUT", json:true,body:data};
(async function(){
try{
bod=await reqw(mops);
console.log('bodY: ', bod);
let v=bod.v.iceServers.urls.forEach(function(el,i){
console.log("url ",i," ",el);	
})
}catch(e){console.log(e);}
}());



