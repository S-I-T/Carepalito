module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      var acciones = [
        {"sentido":"cara","accion":"hablando","estado":data.parametros.estado}
      ];
      callback({estado:true,
                acciones})
    }
  }

  return module;
};
