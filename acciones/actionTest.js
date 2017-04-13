
if(!process.argv[2]){
   console.warn("Debe indicar nombre de la acción")
   return;
}
var moduleName = process.argv[2];

var params = {};
if(process.argv[3]){
  params = JSON.parse(process.argv[3])
}

var module = require("./"+moduleName)({parameters:params});
module.exec(function(resp){
  console.log(resp)
})
