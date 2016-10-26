var createResponce = require('../defaultGetRes.js');
var User = require('../../models/user').User;
// var auth = 1;

var verificate = function(value){
	return value;
}

module.exports.get = function(req, res) {

	if(req.body.body.action === 'get'){
		
		res.json(createResponce(req.body));

	}else if(req.body.body.action === 'call'){

		var password = verificate(req.body.body.password);
		var username = verificate(req.body.body.login);

		User.authorize(username, password, function(err, user){
			if(err) return next(err);

			if(user){
			

				req.session.user = user._id;
			
				res.json({
					message : user._id + ' hello',
					body : null
				})
			
			}else{
						
				res.json({
					message : 'user not finded !',
					body : null
				})
			}

		})


	}


}

