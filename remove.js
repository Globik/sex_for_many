// public/reklama public/profile public/vid
//mkdir ../profile
//cp public/profile/* ../profile
var fs = require('fs');
var {spawn} = require('child_process');

const ls2 = spawn('cp', ['-r', 'public/vid', '../vid'])
ls2.stderr.on('data', to_data)
ls2.stdout.on('data', to_data)
ls2.on('exit', on_exit)
const ls3 = spawn('cp', ['-r', 'public/profile', '../profile'])
ls3.stderr.on('data', to_data)
ls3.stdout.on('data', to_data)
ls3.on('exit', on_exit)
const ls4 = spawn('cp', ['-r', 'public/reklama', '../reklama'])
ls4.stderr.on('data',to_data)
ls4.stdout.on('data', to_data)
ls4.on('exit', on_exit)

function on_exit(code){console.log("exit: ", code)}
function to_data(data){console.log(data.toString())}


