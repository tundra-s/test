var fs = require('fs');

module.exports = function(name){
	return fs.readFileSync( __dirname + '/' + name).toString();	
}