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
            width:800,
            height:600
        });

        Base.decirTexto(callback,"Mirando...")

        camera.takePhoto().then((photo) => {

          let filename = "/tmp/"+camera.getOption("fileName")+ ".jpg";
          const vision = require('@google-cloud/vision')(env.config.credenciales.googleCloud)

          Base.decirTexto(callback,"Analizando...")

          //console.log(filename)
          vision.detectFaces(filename, function(err, faces) {
            //var fs = require('fs');
            //fs.unlinkSync(filename)

            if(err){
                callback({success:false,error:err})
            }
            else{
              if(0 < faces.length){
                let face = faces[0];
                console.log("* ",face);
                speech = "Tienes cara de nada";
                if(face.joy){
                  percentage = face.joyLikelihood/4*100;
                  speech = "Tienes un "+percentage+"% de cara contenta";
                }
                else if(face.anger){
                  percentage = face.angerLikelihood/4*100;
                  speech = "Tienes un "+percentage+"% de cara enojada";
                }
                else if(face.sorrow){
                  percentage = face.sorrowLikelihood/4*100;
                  speech = "Tienes un "+percentage+"% de cara de dolor";
                }
                else if(face.surprise){
                  percentage = face.surpriseLikelihood/4*100;
                  speech = "Tienes un "+percentage+"% de cara de sorpresa";
                }
                Base.decirTexto(callback,speech)
              }
              else{
                Base.decirTexto(callback,"No veo ninguna persona")
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
