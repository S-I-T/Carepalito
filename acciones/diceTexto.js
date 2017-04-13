module.exports = function(data) {
  const Base         = require('../base/base')
  var module = {};

  module.exec = function(callback){
    if(callback){
      Base.decirTexto(callback,data.habla)
    }
  }

  return module;
};
