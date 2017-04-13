module.exports = function(config) {
  const log          = require('ss-logger')("AUDICION")
  const setLog       = require('../utiles/setLog');

  const GCloudSpeech = require('@google-cloud/speech')
  const APIai        = require('apiai')
  const record       = require('node-record-lpcm16')

  const Base         = require('../base/base')
  const Sonus        = require('sonus')

  var module = {}
  var sonus

  /**
  * Inicia sub-modulo audicion
  * Encargado de detectar palabras claves y obtener texto de comando por voz
  *
  * @method iniciar
  * @param {Object} config Configuración
  * @return {Promise} Retorna promesa de resultado
  */
  module.iniciar = () => {
    setLog(log,config.log.level)

    log.info("Iniciando")

    process.on('message',(mensaje)=>{
      log.info(mensaje)

      switch(mensaje.accion){
        case "escuchar":{
          return escuchar()
        }
      }

    });
    return iniciarSonus();
  }


  /**
  * Detiene sub-modulo audicion
  *
  * @method detener
  * @return {Promise} Retorna promesa de resultado
  */
  module.detener = () => {
    log.info("Deteniendo");
    return detenerSonus();
  }

  /**
  * Inicia sonus para captura de palabra clave y voz a texto
  *
  * @method iniciarSonus
  * @return {Promise} Retorna promesa de resultado
  */
  iniciarSonus = () => {
    return new Promise((resolve, reject) => {
      try{
        log.info("Iniciando Sonus");

        const speech = GCloudSpeech(config.credenciales.googleCloud)
        const apiai = APIai(config.credenciales.apiai.token, {language: config.credenciales.apiai.language});

        sonus = Sonus.init(config.sentidos.audicion.sonus, speech)


        Sonus.start(sonus)
        sonus.on('hotword', (index, keyword) => {
        	 log.info("Palabra clave: "+ keyword)
           Base.enviarEvento({"accion":"robotEscuchando","parametros":{"estado":true}});
        })

        //Detectando speech
        sonus.on('partial-result', (texto) => {
          log.info("texto parcial: "+texto)
          Base.enviarEvento({"accion":"robotEscuchandoParcial","parametros":{"texto":texto}});

        })

        sonus.on('final-result', (texto) => {
        	log.info("texto final: "+texto)
          Base.enviarEvento({"accion":"robotEscuchando","parametros":{"estado":false,"texto":texto}});

          if(texto != ""){
              procesarTexto(apiai,texto)
                .then(data => {
                   log.info("texto procesado")
                   Base.enviarEvento(data)
                })
                .catch(err => {
                  log.error("Error al procesar texto",err)
                });
          }


        })

        sonus.on('error', (err) => {
          console.error(err)
        })

        resolve()
      }
      catch(err){
        console.error(err)
        reject(err)
      }
    });
  }


  /**
  * Detiene sonus
  *
  * @method detenerSonus
  * @return {Promise} Retorna promesa de resultado
  */
  detenerSonus = () => {
    return new Promise((resolve, reject) => {
      log.info("Deteniendo Sonus");

      Sonus.stop(sonus)
      resolve()

    });
  }

  /**
  * Escuchar
  *
  * @method escuchar
  */
  escuchar = () => {
    if(sonus){
        Sonus.trigger(sonus, 1)
    }
  }

  /**
  * Procesa texto decodificado de voz para identificar acciones
  *
  * @method procesarTexto
  * @param {String} texto Texto decodificado de voz
  * @return {Promise} Retorna promesa de resultado
  */
  procesarTexto = (apiai,texto) => {
    return new Promise((resolve, reject) => {
      try{
        var comando = obtenerComando(texto)
        if(comando){
          resolve({"accion":comando.accion,"habla":comando.habla});
        }
        else{
          sessionId = (new Date()).getTime();
          var request = apiai.textRequest(texto, {
              sessionId
          })
          request.on('response', (response) =>{
              resolve({"accion":response.result.action,
                       "habla":response.result.fulfillment.speech,
                       "parametros":response.result.parameters});
          })

          request.on('error', (err) => {
              log.error("apiai error",err)
              reject(err);
          })
          request.end();
        }
      }
      catch(err){
        console.error(err)
        reject(err);
      }
    });
  }

  /**
  * Obtiene comando para texto ingresado
  *
  * @method obtenerComando
  * @param {String} texto Texto
  * @return {Object} Retorna objecto con comando o null si no hay un comando asociado al texto
  */
  obtenerComando = (texto)=>{
    if(config && config.sentidos && config.sentidos.audicion && config.sentidos.audicion.comandos){
      var comandos = config.sentidos.audicion.comandos;
      for(var i=0;i<comandos.length;i++){
        if(comandos[i].comando &&
           comandos[i].comando.indexOf(texto) > -1){
          return comandos[i];
        }
      }
    }
    return null;
  }


  return module;
};
