tfile.oninput=function(ev){
	let a=ev.target;
	console.log(a.files)
	console.log('suka ',ev.target.files[0].name);
	var uploader=new HugeUploader({endpoint:"/fakevideo",file:ev.target.files[0]})
	uploader.on('error',function(e){console.error(e.detail)})
	uploader.on('progress',function(p){console.log(p.detail)})
	uploader.on('finish',function(){console.log('on finish')})
}
