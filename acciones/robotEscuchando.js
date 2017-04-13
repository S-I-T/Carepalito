module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      var acciones = [
        {"sentido":"cara","accion":"escuchando","estado":data.parametros.estado,"texto":data.parametros.texto}
      ];
      if(data.parametros.estado){
        acciones.push({"sentido":"habla","accion":"reproducirAudio","audio":"dong"});
      }

      callback({estado:true,
                acciones})
    }
  }

  return module;
};
