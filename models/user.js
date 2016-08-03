var crypto = require('crypto');
var async = require('async');
var util = require('util');
var HttpError = require('../error');

var mongoose = require('../libs/mongoose');

var Schema = mongoose.Schema;

var schema = new Schema ({
	username : {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword:{
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

schema.virtual('password').set(function(password){
	this._plainPassword = password;
	this.salt = Math.random() + '';
	this.hashedPassword = this.encryptPassword(password);
})

schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
}

schema.statics.authorize = 	function(username, password, cb){

		var User = this;

		
		async.waterfall([

			function(cb){
				User.findOne({username: username}, cb);
			},

			function(user, cb){
				if(user){
					if(user.checkPassword(password)){
						
						console.log('checkPassword : OK');

						cb(null, user);
					
					}else{
						
						// Надо обработать , это временно 
						cb(null, false);
						// cb(new AuthError('Пароль неверен'));
					
					}					
				}else{

					cb(null, false);

					// убрал что бы не регистрировались все подряд

					var user = new User({username: username, password: password});

					user.save(function(err){

						if(err) return cb(err);

						cb(null, user);

					})
				}
			}
		], cb);

}


exports.User = mongoose.model('User', schema);


function AuthError(message){
	Error.apply(this, arguments);
	Error.captureStackTrace(this, HttpError);
	this.message = message || 'Error';
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;