var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../error').AuthError;
var async = require('async');

exports.get = function(req, res){
	res.render('login');
}

exports.post = function(req, res, next){
	// req.body работает от body parser
	
	var username = req.body.username;
	var password = req.body.password;

	User.authorize(username, password, function(err, user){
		if(err){
			if(err instanceof AuthError){
				return next(new HttpError(403, err.message));

			}else{

				return next(err);
				
			}
		}


		if(user){
		

			req.session.user = user._id;
			res.json({login: 'user ' + user._id});
		
		}else{
		
			res.json({login: 'user not found'});
		
		}

	})

}