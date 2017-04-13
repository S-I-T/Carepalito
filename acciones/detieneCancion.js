module.exports = function(data,env) {
  var module = {};

  module.exec = function(callback){
    callback({estado:true,
              acciones:[
                {"sentido":"habla","accion":"detenerCancion"}
              ]})
  }
  return module;
};
