module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      var acciones = [
        {"sentido":"cara","accion":"escuchandoParcial","texto":data.parametros.texto}
      ];
      callback({estado:true,
                acciones})
    }
  }

  return module;
};
