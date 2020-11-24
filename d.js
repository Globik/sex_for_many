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
/*
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

*/
const vurl="https://Globi:867f06f6-1065-11ea-a46b-0242ac110003@global.xirsys.net/_turn/alikon";
const axios=require('axios').default;
/*
axios.put(vurl,{format:"urls"}).then(function(d){
console.log('data: ',JSON.stringify(d.data));
console.log('status: ', d.status);
console.log(' statusText: ', d.statusText); 
}).catch(function(er){console.log('err: ',er)})
*/
const base_url_smart_tbtc="https://api.bitaps.com/btc/testnet/v1/create/payment/address/distribution";
const base_url_smart_btc='https://api.bitaps.com/btc/v1/create/payment/address/distribution'
const cb_link="https://frozen-atoll-47887.herokuapp.com/api/test_cb_smartc";
/*
const data={}
data.forwarding_address_primary="mvcwCoEnRbbtKn1P6dk4AhzkAScPpwgYWW";//must be mine
data.forwarding_address_secondary="mqwRsYbYjU19m3SP89dREEBkoNUAetf1FK";//must be client's one
data.forwarding_address_primary_share="10%";//ctx.state.btc_percent;
data.callback_link=cb_link;
axios.post(base_url_smart_tbtc,data).then(function(d){console.log("data: ",d.data)}).catch(function(er){console.log('err: ',er)})
*/
const data={}
data.forwarding_address_primary="1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy";//must be mine
data.forwarding_address_secondary="1PJsmJzFgkAVWwqPvcEHvYELcCcvsFgACo";//must be client's one
data.forwarding_address_primary_share="10%";//ctx.state.btc_percent;
data.callback_link=cb_link;
axios.post(base_url_smart_btc,data).then(function(d){console.log("data: ",d.data)}).catch(function(er){console.log('err: ',er)})

/*
const onesignal_app_key = "MGFmMmZlOTgtOTAyMi00NWE2LThhMTYtNWMwYmNlYTRlYzUw";
const onesignal_app_id = "b989ab63-af54-4afc-b68d-0ab78133540c";
const burl = "https://onesignal.com/api/v1/notifications";
let opt={
		app_id:onesignal_app_id,
		contents:{en: 'info.username'+" just signed up."},
		included_segments:["Subscribed Users"]
		};
	let mops={
		url: "https://onesignal.com/api/v1/notifications",
		 method:"post", 
		 headers:{"Authorization": "Basic "+onesignal_app_key},
		 json:true,
		 body:opt
		 };
axios.post(burl, {app_id:onesignal_app_id,contents:{en: 'info.username'+" just signed up."},included_segments:["Subscribed Users"]},
{headers:{"Authorization": "Basic "+onesignal_app_key}}).then(function(d){console.log('data: ',d.data)}).catch(function(er){console.log('er: ',e)})
*/
/*
var map=new Map();
const n=100;
const ab=[];
var tp=Math.ceil(n/5);
for(var i=0;i<tp;i++){
	ab.push(i);
	}
	ab.forEach(function(el,k){
		if(tp>=15){
			if(k<=5){map.set(k,ab.slice(0,5));console.log('k<=5',map);}
			if(k>5&& k<(tp-5)){map.set(k,ab.slice(((k-1)-2,k+2)));console.log('k > 5 &&k < tp-5',map);}
			if(k>=tp-5){map.set(k,ab.slice(tp-5,tp));console.log('k>=tp-5',map);}
			}else{map.set(k,ab.slice(0,tp));console.log('tp<15',map);}
		})

*/
























