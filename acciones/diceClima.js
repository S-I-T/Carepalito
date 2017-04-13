module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      const Base         = require('../base/base')

      let city = data.parametros.city;
      let date = data.parametros.date;

      if(!city){
        Base.decirTexto(callback,"Debe indicar ciudad para obtener clima")
        return;
      }


      Base.decirTexto(callback,"Buscando...")
      let YQL   = require('yql');
      let query = new YQL("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+city+"') AND u='c'")
      query.setConfig('ssl', true)

      //console.log(query.getURL())

      query.exec(function(error,response) {
        	if (error) {
             console.error(error)
             callback({success:false,error:error})
        	}
        	else {
            //console.log(response)
            if(response.query.results==null){
              Base.decirTexto(callback,"Lo siento, no puede encontrar la información")
            }
            else{
              var location  = response.query.results.channel.location
              var condition = response.query.results.channel.item.condition
              var condition_text = traduceCondicion(condition.code)
              var units     = response.query.results.channel.units
              Base.decirTexto(callback,"El clima para " + location.city + " es " + condition_text + " con " + condition.temp + " grados")
            }
          }
        });
    }
  }

  traduceCondicion = function(code){
    var conditions = {
      "0":"tornado",//tornado
      "1":"tormenta tropical",//tropical storm
      "2":"huracán",//hurricane
      "3":"tormenta eléctrica severa",//severe thunderstorms
      "4":"tormenta eléctrica",//thunderstorms
      "5":"mezcla de lluvia y nieve",//mixed rain and snow
      "6":"mezcla de lluvia y aguanieve",//mixed rain and sleet
      "7":"mezcla de nieve y aguanieve",//mixed snow and sleet
      "8":"llovizna helada",//freezing drizzle
      "9":"llovizna",//drizzle
      "10":"lluvia helada",//freezing rain
      "11":"chubascos",//showers
      "12":"chubascos",//showers
      "13":"copos de nieve",//snow flurries
      "14":"copos de nieve livianos",//	light snow showers
      "15":"viento y nieve",//blowing snow
      "16":"nieve",//snow
      "17":"granizo",//hail
      "18":"aguanieve",//sleet
      "19":"polvo",//dust
      "20":"brumoso",//foggy
      "21":"neblina",//	haze
      "22":"humoso",//	smoky
      "23":"tempestuoso",//	blustery
      "24":"ventoso",//	windy
      "25":"frío",//	cold
      "26":"nublado",//	cloudy
      "27":"mayormente nublado",//mostly cloudy (night)
      "28":"mayormente nublado",//mostly cloudy (day)
      "29":"parcialmente nublado",//	partly cloudy (night)
      "30":"parcialmente nublado",//partly cloudy (day)
      "31":"despejado",//	clear (night)
      "32":"soleado",//	sunny
      "33":"claro",//	fair (night)
      "34":"claro",//	fair (day)
      "35":"mezcla de lluvia y granizo",//	mixed rain and hail
      "36":"caluroso",//	hot
      "37":"tormentas eléctricas aisladas",//isolated thunderstorms
      "38":"tormentas eléctricas dispersas",//scattered thunderstorms
      "39":"tormentas eléctricas dispersas",//scattered thunderstorms
      "40":"chubascos dispersos",//scattered showers
      "41":"fuertes nievadas",//heavy snow
      "42":"chubascos de nieve dispersos",//scattered snow showers
      "43":"fuertes nievadas",//heavy snow
      "44":"parcialmente nublado",//partly cloudy
      "45":"tormentas eléctricas",//	thundershowers
      "46":"chubascos de nieve",//snow showers
      "47":"tormentas eléctricas aisladas",//isolated thundershowers
      "3200":"no disponible"//not available
    }
    return conditions[code];
  }

  return module;
};
