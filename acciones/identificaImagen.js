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

        Base.decirTexto(callback,"Observando...")

        camera.takePhoto().then((photo) => {

          let filename = "/tmp/"+camera.getOption("fileName")+ ".jpg";
          const vision = require('@google-cloud/vision')(env.config.credenciales.googleCloud)

          Base.decirTexto(callback,"Reconociendo...")

          //console.log(filename)
          vision.detectLabels(filename, function(err, labels, apiResponse) {
            var fs = require('fs');
            fs.unlinkSync(filename)

            if(err){
                callback({success:false,error:err,isFinished:true})
            }
            else{
              if(0 < labels.length){
                const translate = require('@google-cloud/translate')(env.config.credenciales.googleCloud)

                translate.translate(labels,{from: 'en',to: 'es'}, function(err, translation) {
                  if (!err) {
                    console.log(translation)

                    if( typeof translation === 'string' ) {
                        speech = "Estoy viendo: "+translation
                    }
                    else{
                        speech = "Estoy viendo: "+translation.join(", ")
                    }
                    Base.decirTexto(callback,speech)
                  }
                  else{
                      callback({success:false,error:err})
                  }
                });
              }
              else{
                Base.decirTexto(callback,"Ups!, No se describir lo que veo")
              }
            }
          });
        });
      }
      catch(err){
          callback({success:false,error:err})
      }
    }
  }

  return module;
};
