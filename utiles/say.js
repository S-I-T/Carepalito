//var exec = require('child_process').exec
var spawn = require('child_process').spawn

function say(text, lang, cb) {
	this.process = spawn('say', ["-v","Juan",text ]);
	var self = this;
	this.process.on('exit', function (code, sig) {
		if (code !== null && sig === null) {
			cb && cb()
		}
	});

	/*
	command = "say -v Juan \"text\""
	exec(command, function(err) {
		cb && cb(err)
	})
	*/
}

module.exports = exports = {say: say}
