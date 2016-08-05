// var timer = require('../libs/timerLogic.js');

exports.get = function(req, res){
	res.render('timer');
}



exports.post = function(req, res){

	timer = require('../libs/timerLogic.js')(req, res);

	var responseObject;

	switch(req.body.action){
		case 'start': {
			responseObject = timer.start(req.body.id);
			break;
		}
		case 'stop': {
			responseObject = timer.stop();
			break;
		}
		case 'get': {
			responseObject = timer.get();
			break;
		}
		case 'add': {
			responseObject = timer.add();
			break;
		}
		default: {
			responseObject = timer.default();
		}
	}

	res.json(responseObject);
}