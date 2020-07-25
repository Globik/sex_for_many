var ab=["давай, давай!","ух ты", "писька пиздатая", "ну и сиськи", "задница зашибись", "ну и попка", "молодец!","так держать", "ну и ну"];
var names=["Nicky","Sveta","lettali","haylix","xaevynne","sexyru_couple","miss_julia","sasha","kaileeshy","wowgirls","john","mik","dura"];
function dor(){
let a=Math.floor(Math.random()*(ab.length-1));
let b=ab[a];
let c=Math.floor(Math.random()*(names.length-1));
let d=names[c];
console.log(a);
console.log(d,': ',b);
setTimeout(dor,60000);	
}
dor()
