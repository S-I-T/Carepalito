module.exports = function(data,env) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      try{
        const Base       = require('../base/base')

        //TODO: Agregar soporte para webcam (https://github.com/chuckfairy/node-webcam)
        const Raspistill = require('node-raspistill').Raspistill;
        const camera = new Raspistill({
            outputDir: "/tmp",
            fileName: Date.now().toString(),
            noPreview: false,
            verticalFlip:env.config.camara.verticalFlip,
            encoding: 'jpg',
            width:640,
            height:480
        });

        Base.decirTexto(callback,"Leyendo...")

        camera.takePhoto().then((photo) => {

          let filename = "/tmp/"+camera.getOption("fileName")+ ".jpg";
          const vision = require('@google-cloud/vision')(env.config.credenciales.googleCloud)

          Base.decirTexto(callback,"Entendiendo...")

          //console.log(filename)
          vision.readDocument(filename)
            .then((results) => {
              console.log(results)
              const texto = results[0];

              var fs = require('fs');
              fs.unlinkSync(filename)

              console.log('Text:'+texto);
              Base.decirTexto(callback,"Dice "+texto)
            })
          })
      }
      catch(err){
          callback({success:false,error:err})
      }
    }
  }

  return module;
};
