
exports.enviarEvento = function (data) {
  process.send(JSON.stringify(data))
}

exports.decirTexto = function (callback,texto) {
  callback({estado:true,
            acciones:[
              {"sentido":"habla","accion":"decirTexto","texto":texto}
            ]})
}
