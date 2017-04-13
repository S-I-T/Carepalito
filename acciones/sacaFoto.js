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
            noPreview: false,
            verticalFlip:env.config.camara.verticalFlip
        });

        Base.decirTexto(callback,"Sonrie!")

        camera.takePhoto().then((photo) => {

          Base.decirTexto(callback,"listo!")
        });
      }
      catch(err){
          callback({success:false,error:err})
      }
    }
  }

  return module;
};
