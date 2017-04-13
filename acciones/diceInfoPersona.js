module.exports = function(data,env) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      const Base  = require('../base/base')

      let query = data.parametros.person;

      Base.decirTexto(callback,"Buscando...")

      var KEY     = env.config.credenciales.googleapis.token
      var request = require('request');

      request('https://kgsearch.googleapis.com/v1/entities:search?query='+query+'&languages=es&key='+KEY+'&limit=1&indent=False',
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            try{
              data = JSON.parse(body)
              if(data &&
                data.itemListElement &&
                data.itemListElement.length > 0 &&
                data.itemListElement[0].result &&
                data.itemListElement[0].result.detailedDescription &&
                data.itemListElement[0].result.detailedDescription.articleBody){
                speech = data.itemListElement[0].result.detailedDescription.articleBody
                speech = speech.substr(0, speech.indexOf('.'));
                Base.decirTexto(callback,speech)
              }
              else{
                Base.decirTexto(callback,"Cuek!, no puede encontrar la información")
              }
            }
            catch(ex){
                callback({success:false,error:ex})
            }
          }
          else{
            Base.decirTexto(callback,"Cuek!, no puede encontrar la información")
          }
        }
      )
    }
  }

  return module;
};
