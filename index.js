const cluster = require('cluster');
const log     = require('ss-logger')("MAIN");
const setLog  = require('./utiles/setLog');

const Cerebro = require("./cerebro");
const CONFIG_FILE = './config.json';

var cerebro;

if (cluster.isMaster) {
  //Leyendo configuración
  log.info("Leyendo configuracion")
  var config = leerConfig();
  if(config==null){
    log.error("No se ha definido configuración")
    process.exit(1);
  }

  setLog(log,config.log.level)

  //Iniciar monitoreo de estado de sentidos (procesos)
  iniciarMonitor();

  //Iniciar cerebro
  log.info("Iniciando cerebro")
  cerebro = new Cerebro(config)
  cerebro.iniciar()
    .then(()=>{
      iniciarSentidos(config)
    })
    .catch(err => {
      console.error(err)
      log.error("Error al iniciar cerebro",err)
      process.exit(1);
    })

}
else {
    var tipo   = process.env['tipo']
    var config = JSON.parse(process.env['config'])

    log.info("Iniciando: "+tipo);
    try{
        const sentido = require("./sentidos/"+tipo)(config);
        sentido.iniciar()
          .then(()=>{
              log.info("Iniciado: "+tipo);
          })
          .catch(err => {
            log.error("Error al iniciar sentido "+tipo,err)
            process.exit(1);
          })
    }
    catch(err){
      console.error(err)
      log.error("Excepción al iniciar sentido "+tipo,err);
      process.exit(1);
    }
}


/**
* Lee configuración de sistema desde CONFIG_FILE
*
* @method leerConfig
* @return {Object} Retorna objecto con configuración
*/
function leerConfig(){
  try{
    return require(CONFIG_FILE);
  }
  catch(err){
    log.error(err);
    return null;
  }
}


/**
* Inicia el monitoreo de los procesos que ejecutan los sentidos
*
* @method iniciarMonitor
*/
function iniciarMonitor(){

  cluster.on('message', (worker, message, handle) => {
    if(cerebro){
      cerebro.agregarEvento(message)
    }
    // ...
  });

  cluster.on('exit', (worker, code, signal) => {
    //TODO: monitorear final de procesos para re-levantarlos
  });
}

/**
* Inicia los modulos de los sentidos cargados en la configuración
*
* @method iniciarSentidos
*/
function iniciarSentidos(config){
  Object.keys(config.sentidos).forEach(function(sentido) {
    var c = config.sentidos[sentido];
    if(c.habilitado){
      var worker = cluster.fork({"tipo":sentido,"config":JSON.stringify(config)});
      if(cerebro){
        cerebro.agregarSentido(sentido,worker);
      }
    }
  });
}
