var createResponce = require('../defaultGetRes.js');
var auth = 0;

var DBmenu = [
		[0, 'главная', 'home'],
		[0, 'вход', 'login'],
		[0, 'регистрация', 'register'],
		[1, 'таймер', 'setting'],
		[1, 'дела', 'setting'],
		[1, 'параметры', 'setting'],
		[1, 'выход', 'logout'],
		[2, 'администрирование', 'admin']
	]

module.exports.get = function(req, res) {

	if(req.body.body.action === 'get'){
		
		res.json(createResponce(req.body));

	}else if(req.body.body.action === 'call'){

		var response = [];

		for(var i = 0; i < DBmenu.length; i ++){
			if(DBmenu[i][0] === auth){
				response.push(DBmenu[i]);
			}
		}

		res.json({
			message : 'All is ok !!',
			body : {
				menuArray : response
			}
		});

	}
}

