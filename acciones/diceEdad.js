module.exports = function(data,env) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      const Base         = require('../base/base')

      var now = new Date();
      var birthtime = new Date(env.config.fechaNacimiento)

      console.log(birthtime)
      var diffMs = now.getTime() - birthtime.getTime();
      var diffDays  = diffMs / (1000 * 3600 * 24);
      var diffYears = diffDays/365;

      Base.decirTexto(callback,"tengo "+diffYears.toFixed(3)+" años")
    }
  }

  return module;
};
