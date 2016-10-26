// переписать , ахинея

exports.route = function(req, res){
	switch(req.body.name){
		case 'menu' : {
			
			require('./menu/module.js').get(req, res);
			break;
		}
		case 'login' : {
			
			require('./login/module.js').get(req, res);
			break;
		}
		default : {

			res.json({
				message : ['Error module not find'],
				obj : {}
			});
		} 
	}
}
