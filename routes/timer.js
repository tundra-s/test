
var dateAbs = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay());


var fs = require('fs');
var db ;
var userCounters = null

var c = function(text1, text2){
	console.log('--------------------------------------');
	console.log(text1);
	if(text2 != undefined){
		console.log(text2);
	}
	console.log('--------------------------------------');
}


var readDb = function(user){
	var test = fs.readFileSync('./routes/test.json', 'utf8');
	if(test){
		db = JSON.parse(test);
	}else{
		c('readDb - > error');
	}
};

var writeDb = function(user){
	db[user] = userCounters;
	var test = fs.writeFileSync('./routes/test.json', JSON.stringify(db));
	return true;	
};

// Проверяем по дате последние 5 записей;
// var checkDate = function(){
// 	var zone = 5;
// 	if(counters.history){
// 		for(var i = counters.history.length - 1; i > 0 || i > counters.history.length - zone; i--){
// 			if(counters.history) return counters.history
// 		}
// 	}
// }

// 1470085200000 Вчера

var newDay = function(pattern){
	var day = {};
	day.date = dateAbs;
	day.counters = []
	for (var i = 0; i < pattern.length; i++) {
		day.counters.push({
			id: pattern[i].id,
			name: pattern[i].name,
			session: []
		})	
	}

	c('newDay - > OK', day);
	
	return day;
}

var createNewDay = function(date){
	// определяем вчерашнюю дату
	var yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDay() - 1);

	// проверяем есть ли вчерашняя запись 
	if(userCounters.history.length > 1 && new Date(userCounters.history[userCounters.history.length - 2].date).valueOf() == yesterday.valueOf()){
		
		// добавляем сегодня
		userCounters.history.push(newDay(userCounters.history[userCounters.history.length - 1].counters));

		// если есть незавершенное дело переносим его на сегодня 
		if(userCounters.status){
			var counter = userCounters.history[userCounters.history.length-1];
			yesterday.setHours(23);
			yesterday.setMinutes(59);

			counter.counters.session[counter.counters.session.length - 1][1] = yesterday;

			var session = userCounters.history[userCounters.history.length - 1].counters[counter.status].session.push([dateAbs, false]);
		}
	}else{
		c('createNewDay - > counters status =');
		
		userCounters.history.push(newDay(userCounters.history[0].counters));
	}

}

// Ищем в истории обьект с сегодняшней датой
// Принимаем дату, по которой ищем день в истории если дата не указанна то ищем по сегодняшнему дню
var getCounters = function(req, date){
	var date = typeof(date) == 'string' ? new Date(date) : false;
	date = !date ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()) : date;
	
	c('getCounters - > date', date);

	if(!(date instanceof Date)) return false; 
	var result;

	if(userCounters.history){
		// Сделать инверсию цикла что бы он искал с конца массива 
		for(var i = 0; i < userCounters.history.length; i++){
			if(new Date(userCounters.history[i].date).valueOf() == date.valueOf()){
				result = userCounters.history[i];
			}
		}
	}

	if(!result){
		createNewDay(date);
	}

	c('req.user', req.user);

	writeDb(req.user.username);

	return result || false;


}

// Ищем счетчик по id
// принимаем id счетчика и obj в котором ищем , если его нет автоматом ищем за сегодняшний день
var getCounter = function(req, id){
	var counterId = id || req.body.id;
	var history = getCounters(req);
	for (var i = 0; i < history.counters.length; i++) {
		if(history.counters[i].id == counterId){
			return history.counters[i];
		}  
	}
	return false;
}

// стартуем счетчик
var startCounter = function(req){
	var now = getCounter(req); // 
	if(!now) return false;
	if(userCounters.status !== req.body.id || !now.session.length || now.session[now.session.length - 1][1]){
		if(userCounters.status){
			stopCounter(req, userCounters.status);
		}
		now.session.push([new Date(), false]);
		userCounters.status = req.body.id;
		writeDb(req.user.username);
		return now.session
	}else{
		return 'Уже запущен';
	}

	return false;

}

// Ищем обект истории за сегодня и добавляем туда новый счетчик
var addCounter = function(req){
	for(var i = userCounters.history.length - 1; i >= 0; i--){
		if(new Date(userCounters.history[i].date).valueOf() == (dateAbs).valueOf()){
			userCounters.history[i].counters.push({
				id : req.body.id,
				name: req.body.name,
				session : []
			})
			writeDb(req.user.username);
			return 'добавленно'
		}
	}
}

var stopCounter = function(req, id){
	c('id',id);
	var now = getCounter(req, id);
	if(now && !(now.session[now.session.length - 1][1])){
		now.session[now.session.length - 1][1] = new Date();
		userCounters.status = false;
		writeDb(req.user.username);
		return true;
	}
	return false
}

var getHistory = function(req){
	var date = req.body.date || dateAbs;
	var test = getCounters(req, date);
	c("getHistory", test);
	return test
}


var userIni = function(user){
	readDb(user);
	userCounters = db[user];
	// checkDate();
}


exports.get = function(req, res){
	res.render('timer');
}



exports.post = function(req, res){

	var obj = {mess: 'Нихуя'}

	// передаем туда имя
	userIni(req.user.username);

	switch(req.body.action){
		case 'start': {
			obj.mess = startCounter(req);
			break;
		}
		case 'stop': {
			obj.mess = stopCounter(req);
			break;
		}
		case 'get': {
			obj.history = getHistory(req);
			obj.status = userCounters.status;
			break;
		}
		case 'add': {
			obj.mess = addCounter(req);
			obj.history = getHistory();
			obj.status = userCounters.status;
			break;
		}
		default: {
			obj.mess = 'Хуй'

		}
	}

	res.json(obj);
}