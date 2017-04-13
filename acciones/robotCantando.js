module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      var acciones = [
        {"sentido":"cara","accion":"cantando","estado":data.parametros.estado,"nombre":data.parametros.nombre}
      ];
      callback({estado:true,
                acciones})
    }
  }

  return module;
};
