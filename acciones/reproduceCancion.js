module.exports = function(data) {
  var module = {};

  module.exec = function(callback){
    if(callback){
      let artist = data.parametros.artist;

      callback({estado:true,
                acciones:[
                  {"sentido":"habla","accion":"decirTexto","texto":"Buscando..."}
                ]})


      var request = require('request');

      request('https://api.spotify.com/v1/search?q='+artist+'&type=album',
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            try{
              data = JSON.parse(body)
              //console.log(data)

              if(data &&
                data.albums &&
                data.albums.items &&
                data.albums.items.length > 0){

                let album  = Math.floor(Math.random() * (data.albums.items.length))
                let albumId = data.albums.items[album].id

                request('https://api.spotify.com/v1/albums/'+albumId,
                    function (error, response, body) {
                      if (!error && response.statusCode == 200) {
                        try{
                          data = JSON.parse(body)
                          //console.log(data)
                          if(data &&
                            data.tracks &&
                            data.tracks.items &&
                            data.tracks.items.length > 0){

                            let track = Math.floor(Math.random() * (data.tracks.items.length))
                            let name =  data.tracks.items[track].name
                            let url_audio = data.tracks.items[track].preview_url;

                            callback({estado:true,
                                      acciones:[
                                        {"sentido":"habla","accion":"reproducirCancion","nombre":name,"url":url_audio}
                                      ]})
                          }
                          else{
                            callback({estado:true,
                                      acciones:[
                                        {"sentido":"habla","accion":"decirTexto","texto":"No pude encontrar canciones de "+artist}
                                      ]})
                          }
                        }
                        catch(ex){
                            callback({success:false,error:ex})
                        }
                      }
                      else{
                        callback({estado:true,
                                  acciones:[
                                    {"sentido":"habla","accion":"decirTexto","texto":"No pude encontrar canciones de "+artist}
                                  ]})
                      }

                    }
                )
              }
              else{
                callback({estado:true,
                          acciones:[
                            {"sentido":"habla","accion":"decirTexto","texto":"No pude encontrar canciones de "+artist}
                          ]})
              }
            }
            catch(ex){
                callback({success:false,error:ex})
            }
          }
          else{
            callback({estado:true,
                      acciones:[
                        {"sentido":"habla","accion":"decirTexto","texto":"No pude encontrar información"}
                      ]})
          }
        }
      )
    }
  }

  return module;
};
