module.exports = function(data,env) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      const Base       = require('../base/base')

      let action = data.parametros.action.toLowerCase()
      let puerto = data.parametros.port
      let ip     = env.config.acciones.prendeLuz.ip
      let state  = 1
      let speech = "prendida"
      if(action=="apaga"){
        state = 0;
        speech = "apagada"
      }
      else if(action!="prende"){
          Base.decirTexto(callback,"No entiendo el comando")
          return;
      }

      try{
        if(env.config.acciones.prendeLuz.salidas[puerto]){
          let salida = env.config.acciones.prendeLuz.salidas[puerto]
          var request = require('request');
          var url = "http://"+ip+"/control?cmd=GPIO,"+salida+","+state

          //log.info(url)
          request(url, function (error, response, body) {
            if(error==null && response && response.statusCode==200){
                Base.decirTexto(callback,speech)
            }
            else{
                if(response && response.statusCode){
                    log.error(error,response.statusCode)
                }
                Base.decirTexto(callback,"Ups!, ha ocurrido un error")
            }
          });
        }
        else{
          Base.decirTexto(callback,"No se ha configurado el puerto "+puerto)
        }
      }
      catch(err){
        callback({success:false,
                  error:err})
      }

    }
  }

  return module;
};
