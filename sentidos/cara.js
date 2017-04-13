module.exports = function(config) {
  const log          = require('ss-logger')("CARA")
  const setLog       = require('../utiles/setLog');
  const Base         = require('../base/base')
  const express      = require('express');
  const http         = require('http');
  const url          = require('url');
  const WebSocket    = require('ws');
  const rpio         = require('rpio');

  var wsocket = null;

  var module = {}
  var wsocket

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
        iniciarUI()
        iniciarLecturaPines()

        process.on('message',(mensaje)=>{
          log.info(mensaje)
          if(wsocket){
            wsocket.send(JSON.stringify(mensaje))
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
  * Inicia servicio web para mostrar UI
  *
  * @method iniciarUI
  */
  iniciarUI = () => {
    log.info("Iniciando UI")

    var app = express();
    app.use(express.static('ui'));
    app.use('/static/css', express.static(config.sentidos.cara.directorioUI+'/build/static/css'));
    app.use('/static/js', express.static(config.sentidos.cara.directorioUI+'/build/static/js'));
    app.use('/static/media', express.static(config.sentidos.cara.directorioUI+'/build/static/media'));

    app.get('/', function (req, res) {
      res.sendFile("build/index.html", { root: config.sentidos.cara.directorioUI });
    });
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
      wsocket = ws;
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      //updateUI({"tipo":"estado","data":"conectado"})
    });
    server.listen(8080, function listening() {
      log.info('Escuchando en puerto '+server.address().port)
    });
  }



  iniciarLecturaPines = () =>{
    log.info("Iniciando lectura de pines")
    if(config && config.sentidos && config.sentidos.cara && config.sentidos.cara.pins){
      for(var i=0;i<config.sentidos.cara.pins.length;i++){
        log.info("Iniciando pin "+config.sentidos.cara.pins[i])
        rpio.open(config.sentidos.cara.pins[i], rpio.INPUT, rpio.PULL_UP);
        rpio.poll(config.sentidos.cara.pins[i], cambioPines);
      }

    }
  }

  cambioPines = (pin) => {
    log.info("Pin "+pin+" cambio")
    if(config && config.sentidos && config.sentidos.cara && config.sentidos.cara.pins  && config.sentidos.cara.caras){
      var faceId = 0;
      var pinVal;
      for(var i=0;i<config.sentidos.cara.pins.length;i++){
        pinVal = (rpio.read(config.sentidos.cara.pins[i])==1) ? 0 : 1; //invertir valor por pull_up
        faceId += pinVal * Math.pow(2,i);
      }

      log.info("Nueva cara: "+ faceId)
      if(config.sentidos.cara.caras[faceId]){
          log.info("Cambiando a cara: "+config.sentidos.cara.caras[faceId])
          if(wsocket){
            wsocket.send(JSON.stringify({"sentido":"cara","accion":"cambioCara","cara":config.sentidos.cara.caras[faceId]}))
          }
      }
    }
  }

  return module
}
