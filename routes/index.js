var checkAuth = require('../middleware/checkAuth');

module.exports = function(app){

	// console.log(checkAuth());

	app.get('/', require('./frontpage').get);
	app.get('/home', checkAuth, require('./frontpage').get);
	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);
	app.get('/logout',checkAuth, require('./logout').post);
	// app.get('/chat', checkAuth , require('./chat').get);
	app.get('/timer',checkAuth, require('./timer').get);
	app.post('/timer',checkAuth, require('./timer').post);

}

// var User = require('../models/user').User;
// var HttpError = require('../error').HttpError; 
// var ObjectId = require('mongodb').ObjectId;


// module.exports = function(app){


// 	app.get('/', function(req, res, next){
// 	  res.render('index',{ 
// 	    title : 'Home'
// 	  });
// 	})

// 	app.get('/timer', function(req, res, next){
// 	  res.render('timer',{ 
// 	    title : 'Таймер'
// 	  });
// 	})

// 	app.get('/login', function(req, res, next){
// 	  res.render('login',{ 
// 	    title : 'Вход'
// 	  });
// 	})


// 	app.get('/users', function(req, res, next){

// 	  User.find({}, function(err, user){
// 	    if(err) return next(err);

// 	    res.json(user);

// 	  })

// 	});

// 	app.get('/user/:id', function(req, res, next){

// 		try{
// 			var id = new ObjectId(req.params.id);
// 		}catch(e){
// 			return next(new HttpError(404, 'User not found'));
// 		}

// 		User.findById(req.params.id, function(err, user){

// 	    if(err) return next(err);
	 

// 	    if(!user){
// 	      next(new HttpError(404, 'User not found'));
// 	    }

// 	    res.json(user);


// 	  })

// 	});

// }