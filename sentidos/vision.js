module.exports = function(config) {
  const log          = require('ss-logger')("VISION")
  const setLog       = require('../utiles/setLog');
  const Base         = require('../base/base')
  const spawn        = require('child_process').spawn

  var module = {}
  var process = null

  /**
  * Inicia sub-modulo cara
  * Encargado de mostrar una interfaz visual
  *
  * @method iniciar
  * @return {Promise} Retorna promesa de resultado
  */
  module.iniciar = () => {
    setLog(log,config.log.level)
    log.info("Iniciando")

    return new Promise((resolve, reject) => {
      try{
        iniciarDeteccionRostros()
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
      try{
        detenerDeteccionRostros()
        resolve();
      }
      catch(err){
        console.error(err)
        reject(err)
      }
    })

  }


  /**
  * Inicia proceso para detectar rostros
  *
  * @method iniciarDeteccionRostros
  */
  iniciarDeteccionRostros = () => {
    log.info("Iniciando detección de rostros")

    cmd = "python"
    cmdArgs = [config.sentidos.vision.scriptDeteccionRostros,config.sentidos.vision.pinServo]
    process = spawn(cmd, cmdArgs)

    //callbacks cp
    process.on('close',()     =>{log.info("Proceso cerrado")});
    process.on('disconnect',()=>{log.info("Proceso desconectado")});
    process.on('error',(err)  =>{log.error("Error",err)});
    process.on('exit',()      =>{log.info("Proceso cerrado")});

    process.stdout.on('data', function (data) {
      log.info(data)
    })

    process.stdout.on('end', function () {
      log.info("Detección finalizada")
    })
  }

  /**
  * Finaliza proceso para detectar rostros
  *
  * @method detenerDeteccionRostros
  */
  detenerDeteccionRostros = () => {
    if(process){
        process.kill()
        process = null
    }
  }



  return module
}
