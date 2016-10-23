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
	data : {
		type: Schema.Types.Mixed,
		default : {}
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
						cb(null, true, user);
					}else{
						cb(null, false, {message : 'пароль не верен'});
					}					
				}else{
					cb(null, false, {message : 'пользователь с таким именем не найден'});

					// var user = new User({username: username, password: password});
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