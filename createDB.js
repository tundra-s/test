var mongoose = require('./libs/mongoose');

mongoose.set('debug', true);
// подключаемый модуль npm i async; Для последовательного выполнения ассинхронных операций
var async = require('async');


// 1. drop database
// 2. create & save 3 users
// 3. close connection

async.series([
		open,
		dropDatabase,
		requireModels,
		createUser,
	], function(err, result){
		
		console.log(arguments);
		mongoose.disconnect();

	});


function open (cb){
	
	mongoose.connection.on('open', cb);

}

function dropDatabase(cb){
	
	var db = mongoose.connection.db;
	db.dropDatabase(cb)
}

function requireModels(cb){
	require('./models/user');
	
	async.each(Object.keys(mongoose.models), function(modelName, cb){
		mongoose.models[modelName].ensureIndexes(cb);
	}, cb);
}

function createUser(cb){
	
	
	var users = [
		{username: 'Вася', password: 'supervasya'},
		{username: 'Петя', password: 'superpetya'},
		{username: 'Админ', password: 'superadmin'},
	]

	async.each(users, function(userData, cb){
		
		var user = new mongoose.models.User(userData);
		user.save(cb);

	}, cb);

}

// подберем нативный объект подключения к бд
// var db = mongoose.connection.db;

// mongoose.connection.on('open', function(){

	// db.dropDatabase(function(err){
	// 	if(err) throw err;
		
		// async.parallel([
		// 		function(cb){
					
		// 			var vasya = new User({username: 'Вася', password: 'supervasya'});
		// 			vasya.save(function(err){
		// 				cb(err, vasya);
		// 			});
 
		// 		},
		// 		function(cb){
					
		// 			var petya = new User({username: 'Петя', password: 'superpetya'});
		// 			petya.save(function(err){
		// 				cb(err, petya);
		// 			});

		// 		},
		// 		function(cb){
					
		// 			var admin = new User({username: 'Админ', password: 'superadmin'});
		// 			admin.save(function(err){
		// 				cb(err, admin);
		// 			});

		// 		}
		// 	], function(err, result){

		// 		console.log(arguments);
		// 		console.log("test");
		// 		mongoose.disconnect();
			
		// 	});



	// })

// })