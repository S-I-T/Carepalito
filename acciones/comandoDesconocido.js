module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
        callback({estado:true,
                  acciones:[
                    //TODO: Revisar porque se escucha a si mismo y se queda en un loop
                    {"sentido":"habla","accion":"decirTexto","texto":data.habla},
                    {"sentido":"audicion","accion":"escuchar"}

                  ]})
    }
  }

  return module;
};
