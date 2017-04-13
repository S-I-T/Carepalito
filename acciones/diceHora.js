module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
        const Base         = require('../base/base')

        var now = new Date();
        var hour = now.getHours();
        var mins = now.getMinutes();

        speech = "Son las "+hour+" con "+mins+" minuto";
        if(mins!=1){
            speech += "s"
        }

        Base.decirTexto(callback,speech)
    }
  }

  return module;
};
