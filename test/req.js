const request=require('request');
var rp=require('request-promise-native');//1.0.7


const prim="mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE";
const sec= "mi1BYcC463rVJzrbaApLVKSR9bVtGHVDbp";
const pr="10%";
const base_url_smart="https://api.bitaps.com/btc/testnet/v1/create/payment/address/distribution"

var data={};
data.forwarding_address_primary=prim;//must be mine
data.forwarding_address_secondary=sec;//must be client's one
data.forwarding_address_primary_share=pr;
//data.callback_link="http://ex.com/bitaps/notif"
const mops={url: base_url_smart, method:"post", json:true,body:data};


}
rp(mops).then(function(b,body){console.log("data:",b,body)}/*,function(e){console.log('er3:',e)}*/).catch(function(er){
console.log("hier err: ",er.name, er.message)
})
/*
request(mops, function(e,b,body){
if(e){console.log('err in request: ',e);
return;
}
console.log("status code: ",b.statusCode);
if(b.statusCode !=200){console.log("some error here");}//400 { error_code: 7,message: 'invalid secondary forwarding address',details: '' }

console.log('BODY=> \n', body);	
console.log("body invoice: ",body.invoice);
console.log("body payment_code: ",body.payment_code);
console.log("address: ", body.address);
})
*/ 

async function lu(){
try{
let b=await rp(mops);
console.log('b: ', b);	
}catch(e){
console.log("err in await reqw: ", e.message);	
}	
}

lu();
 
/*
  "invoice": "invPoMqRtTZZGLNLsC2xDQUKwj3cyZtPJrPdwSRA4kvhoQV6Y77Dr", 
  "payment_code": "PMTvFcvDDMmSpDm9QqnPsWMBE8RyEmoQdSxHXmyM9zux9d5oGEvNe",
   "address": "2MsUHKMPGVvsqiF6XzioDDFeAeVyajbNq2C", "domain": "", "domain_hash": "", "confirmations": 3, "callback_link": "", 
  "forwarding_address_primary": "mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE", 
  "forwarding_address_secondary": "mi1BYcC463rVJzrbaApLVKSR9bVtGHVDbp", 
  "forwarding_address_primary_share": 10, "share_type": "percent", "currency": "tBTC"
   invoice: 'invPf2CHJQ96mcrUq1acbpMfuaDVhG2y1TpfcbHhvHB2m3D7inUy7',
  payment_code: 'PMTvRtYd1SmGmiHrUtRQ2nCZQVjknxbFavfpvRR1bxZn4jMjjjVPr',
  address: '2MwUHaJZp4Xi4FUq2Ht7TeiqEJBFFPych4f'
 */
