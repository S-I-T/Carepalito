//var exec = require('child_process').exec
const log  = require('ss-logger')

function setLog(logInstance,logLevel) {
	ll = log.levels.silly
	switch(logLevel){
		case "error":
			ll = log.levels.error
			break;
		case "warn":
			ll = log.levels.warn
			break;
		case "info":
			ll = log.levels.info
			break;
		case "verbose":
			ll = log.levels.verbose
			break;
		case "debug":
			ll = log.levels.debug
			break;
	}
	logInstance.setLevel(ll)
}


module.exports = exports = setLog
