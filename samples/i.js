var a=['a','b','c','d','e','f','g','h','i']
var b=a[Math.floor(a.length*Math.random())];
//console.log('b: ',b);
var c=[{href:"href1",d:"20"},{href:"href2", d: 6},{href:"href3",d:"22"},{href:"href4", d:8}]
	var d=c[Math.floor(c.length*Math.random())];
	console.log('d: ', d)
var abba=[];
c.forEach(function(el,i){
if(el.d==6)abba.unshift(el)
if(el.d !=6)abba.push(el);	
})
console.log('abba: ', abba);

var si=[0,1,2,3,4,5,6,7,8,9]
console.log('si: ',si)
var sid=si.splice(0,4);
console.log('sid: ', sid)// на удаление файлов 
console.log('si: ',si)//остается на проигрывании
var crypto=require('crypto')
var sh=crypto.createHash('sha1')

/*
 
 
 notification_type: 'p2p-incoming',
  bill_id: '',
  amount: '346.02',
  datetime: '2020-06-22T17:45:33Z',
  codepro: 'false',
  sender: '41001000040',
  sha1_hash: '0ef39f432a2cbf601b84de7b0701abed8e0b092e',
  test_notification: 'true',
  operation_label: '',
  operation_id: 'test-notification',
  currency: '643',
  label: ''

  


*/
var da='p2p-incoming&test-notification&346.02&643&2020-06-22T17:45:33Z&41001000040&false&yandex_sec&'
var li=sh.update(da).digest('hex')
console.log('LI: ',li)
