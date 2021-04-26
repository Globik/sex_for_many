var fs = require('fs');
var {spawn} = require('child_process');

const ls = spawn('rm', ['-r','public/vid'])
ls.stderr.on('data', to_data)
ls.stdout.on('data', to_data)
ls.on('exit', on_exit)

const ls1 = spawn('cp', ['-r', '../vid/', 'public/vid'])
ls1.stderr.on('data', to_data)
ls1.stdout.on('data', to_data)
ls1.on('exit', function(c){
	if(c == 0) do_rm();
})
function do_rm(){
const ls2 = spawn('rm', ['-r', '../vid/'])
ls2.stderr.on('data', to_data)
ls2.stdout.on('data', to_data)
ls2.on('exit', on_exit)
}


const ls3 = spawn('rm', ['-r','public/profile'])
ls3.stderr.on('data', to_data)
ls3.stdout.on('data', to_data)
ls3.on('exit', on_exit)

const ls4 = spawn('cp', ['-r', '../profile/', 'public/profile'])
ls4.stderr.on('data', to_data)
ls4.stdout.on('data', to_data)
ls4.on('exit', function(c){
	if(c == 0) do_rm2();
})
function do_rm2(){
const ls5 = spawn('rm', ['-r', '../profile/'])
ls5.stderr.on('data', to_data)
ls5.stdout.on('data', to_data)
ls5.on('exit', on_exit)
}

const ls6 = spawn('rm', ['-r', 'public/reklama'])
ls6.stderr.on('data', to_data)
ls6.stdout.on('data', to_data)
ls6.on('exit', on_exit)

const ls7 = spawn('cp', ['-r', '../reklama/', 'public/reklama'])
ls7.stderr.on('data', to_data)
ls7.stdout.on('data', to_data)
ls7.on('exit', function(c){
	if(c == 0) do_rm3();
})
function do_rm3(){
const ls8 = spawn('rm', ['-r', '../reklama/'])
ls8.stderr.on('data', to_data)
ls8.stdout.on('data', to_data)
ls8.on('exit', on_exit)
}


function on_exit(code){console.log("exit: ", code)}
function to_data(data){console.log(data.toString())}

