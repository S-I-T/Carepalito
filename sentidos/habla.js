module.exports = function(config) {
  const log          = require('ss-logger')("HABLA")
  const setLog       = require('../utiles/setLog');
  const Base         = require('../base/base')
  var Sound          = require('node-aplay');
  var TTS            = require('picotts');
  var Player         = require('player');

  //Revisar plataforma para ajustar reproductores
  if(process.platform==="darwin"){
    Sound = require('../utiles/node-afplay');
    TTS   = require('../utiles/say');
  }

  //const indicador = new Sound(config.sentidos.audicion.indicadorPalabraClave);


  var module = {}
  var audios = {}
  var player = null;

  /**
  * Inicia sub-modulo audicion
  * Encargado de detectar palabras claves y obtener texto de comando por voz
  *
  * @method iniciar
  * @return {Promise} Retorna promesa de resultado
  */
  module.iniciar = () => {
    setLog(log,config.log.level)

    log.info("Iniciando")

    return new Promise((resolve, reject) => {
      try{
        //Precargar audios
        Object.keys(config.sentidos.habla.audios).forEach(function(a) {
          audios[a] = new Sound(config.sentidos.habla.audios[a]);
        })

        process.on('message',(mensaje)=>{
          log.info(mensaje)

          switch(mensaje.accion){
            case "reproducirAudio":{
              return reproducirAudio(mensaje.audio)
            }
            case "decirTexto":{
              return decirTexto(mensaje.texto)
            }
            case "reproducirCancion":{
              return reproducirCancion(mensaje.nombre, mensaje.url)
            }
            case "detenerCancion":{
              return detenerCancion()
            }

          }

        });

        resolve();
      }
      catch(err){
        console.error(err)
        reject(err)
      }

    })

  }


  /**
  * Detiene sub-modulo audicion
  *
  * @method detener
  * @return {Promise} Retorna promesa de resultado
  */
  module.detener = () => {
    log.info("Deteniendo");
    return new Promise((resolve, reject) => {
      resolve();
    })

  }


  /**
  * Reproduce un audio (local)
  *
  * @method reproducirAudio
  * @param {String} audio Nombre del audio, debe estar en la configuracion a que archivo de audio se relaciona
  */
  reproducirAudio = (audio) =>{
    if(audios[audio]){
      log.info("Reproduciendo "+audio)
      audios[audio].play()
    }
  }

  /**
  * Convierte y reproduce texto a voz
  *
  * @method decirTexto
  * @param {String} texto Texto a traducir a voz
  */
  decirTexto = (texto,callback) =>{
    setTimeout(function(){
      Base.enviarEvento({"accion":"robotHablando","parametros":{"estado":true}});
      TTS.say(texto,config.sentidos.habla.lenguaje,function(err){
        if(err){
          log.error(err)
        }
        Base.enviarEvento({"accion":"robotHablando","parametros":{"estado":false}});
        if(callback){
          callback();
        }
      })
    },1);
  }



  /**
  * Reproduce cancion desde url
  *
  * @method reproducirCancion
  * @param {String} nombre Nombre de cancion
  * @param {String} url URL (en formato mp3)
  */
  reproducirCancion = (nombre,url) =>{
    //Decir el nombre...

    if(player){
      player.stop();
      player = null;
    }

    Base.enviarEvento({"accion":"robotCantando","parametros":{"estado":true,"nombre":nombre}});
    player = new Player(url);
    player.on('playend',function(item){
      player = null;
      Base.enviarEvento({"accion":"robotCantando","parametros":{"estado":false}});
    })
    player.on('error', function(err) {
      //console.error(err);
    })
    player.play();
  };

  /**
  * detener cancion actualmente sonando
  *
  * @method detenerCancion
  */
  detenerCancion = () =>{
    if(player){
      player.stop();
      player = null;
      Base.enviarEvento({"accion":"robotCantando","parametros":{"estado":false}});
    }
  };


  return module
}
