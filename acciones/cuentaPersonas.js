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

        Base.decirTexto(callback,"Mirando...")

        camera.takePhoto().then((photo) => {

          let filename = "/tmp/"+camera.getOption("fileName")+ ".jpg";
          const vision = require('@google-cloud/vision')(env.config.credenciales.googleCloud)

          Base.decirTexto(callback,"Contando...")

          //console.log(filename)
          vision.detectFaces(filename, function(err, faces) {
            var fs = require('fs');
            fs.unlinkSync(filename)

            if(err){
                callback({success:false,error:err,isFinished:true})
            }
            else{
              if(0 < faces.length){
                var texto = "Estoy viendo "+faces.length+" persona"
                if(faces.length>1){
                  texto += "s"
                }
                Base.decirTexto(callback,texto)
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
