
// подключаем экспресс
var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var HttpError = require('./error').HttpError; 
var mongoose = require('./libs/mongoose');


// создаем приложение, создается ф-я которая обрабатывает запросы
var app = express();

// app.set('port', 3000);

// app.use(function(req, res, next){
//  if(req.url == '/'){
//    doSome(); при выполнении условия делает что то 
//  }else{
//    next(); при невыполнении передает управление след. обработчику
//  }
// });


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon()); // faveicon.ico
app.use(express.logger('dev'));
app.use(express.bodyParser()); //json -> req.body.---
app.use(express.cookieParser()); // req.cookies

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// app.use(function(req, res, next){
//   req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//   // res.send("Visits: " + req.session.numberOfVisits);
// })

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router); // Пример ниже 


require('./routes')(app);


app.use(function(err, req, res, next){

  console.log(err.status);

  if(typeof(err) == 'number'){
    err = new HttpError(err);
  }

  console.log('HttpError');
  console.log(HttpError);
  console.log('HttpError');
  
  if(err instanceof HttpError){
    res.sendHttpError(err);

  }else{

    if(app.get('env') == 'development'){
  
      express.errorHandler()(err, req, res, next);
  
    }else{

      // log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    
    }

    
  }

})




http.createServer(app).listen(config.get('port'), function(){
// http.createServer(app).listen(7077, function(){
  // console.log("Express server listening on port " + 7077);
  console.log("Express server listening on port " + config.get('port'));
});
