module.exports = function(config) {
  const log   = require('ss-logger')("CEREBRO");
  const Queue = require('better-queue');
  const setLog  = require('./utiles/setLog');

  var module = {};
  var queue  = null;
  var sentidos = {};

  /**
  * Inicia modulo cerebro
  * Encargado de coordinar eventos recibimos por sentidos y ejecutar acciones asociadas
  *
  * @method iniciar
  * @return {Promise} Retorna promesa de resultado
  */
  module.iniciar = () => {
    return new Promise((resolve, reject) => {
      setLog(log,config.log.level)

      log.info("Iniciando");

      try{
        queue = new Queue(function (data, cb) {
          procesarAccion(data)
          .then(()=>{
              cb(null)
          })
          .catch((err)=>{
              cb(err)
          })
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
  * Agrega un evento a la cola de eventos del cerebro
  *
  * @method agregarEvento
  * @param {Object} data Objecto con datos que describen el evento
  */
  module.agregarEvento = (data) =>{
    if(queue){
      queue.push(JSON.parse(data))
    }
  }

  /**
  * Agrega un sentido a la lista de sentidos del cerebro
  *
  * @method agregarSentido
  * @param {String} sentido Nombre del sentido
  * @param {Object} worker Objecto que representa el proceso donde se ejecuta el sentido
  */
  module.agregarSentido = (sentido,worker) =>{
    if(sentidos){
      sentidos[sentido] = worker;
    }
  }

  /**
  * Detiene modulo cerebro
  *
  * @method detener
  * @return {Promise} Retorna promesa de resultado
  */
  module.detener = () => {
    return new Promise((resolve, reject) => {
      log.info("Deteniendo");

      try{
        if(queue){
          queue.destroy(resolve);
        }
      }
      catch(err){
        reject(err)
      }

    });
  }


  /**
  * Procesar acción
  *
  * @method procesarAccion
  * @param {Object} data Datos con información de accion
  * @return {Promise} Retorna promesa de resultado
  */
  procesarAccion = (data) => {
    log.info("procesarAccion",data);

    return new Promise((resolve, reject) => {
      if(data && data.accion){
        try{
          let env = {config,sentidos}
          let actionModule = require("./acciones/"+data.accion)(data,env)
          actionModule.exec(function(result){
            //log.info("ejecutandoAccion",result);
            if(result.estado){
              if(result.acciones && 0<result.acciones.length ){
                  result.acciones.map((accion)=>{
                      if(accion.sentido && sentidos[accion.sentido]){
                          sentidos[accion.sentido].send(accion)
                      }
                  })
                  resolve()
              }
              else{
                  resolve()
              }
            }
            else{
                log.error(result.error)
                reject(error)
            }
          })
        }
        catch(ex){
          log.error(ex)
          reject(ex)
        }
      }
      else{
        reject(new Error("Acción desconocida"))
      }
    });
  }


  return module;
};
