var dateAbs = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay());
var fs = require('fs');
var db = {test: 'test'};
var counters = null


var readDb = function(user){
	var test = fs.readFileSync('./routes/test.json', 'utf8');
	db = JSON.parse(test);
};

var writeDb = function(){
	var test = fs.writeFileSync('./routes/test.json', JSON.stringify(db));
	return true;	
};




var getCounters = function(date){
	// var date = new Date();
	var date = !date ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()) : date;
	if(!(date instanceof Date)) return false; 
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	var result;
	if(counters.history){
		// Сделать инверсию цикла что бы он искал с конца массива 
		for(var i = 0; i < counters.history.length; i++){
			if(new Date(counters.history[i].date).valueOf() == date.valueOf()){
				result = counters.history[i];
			}
		}
	}
	return result || false;

}

var getCounter = function(id, obj){
	var history = obj || getCounters();
	for (var i = 0; i < history.counters.length; i++) {
		if(history.counters[i].id == id){
			return history.counters[i];
		}  
	}
	return false;
}

var startCounter = function(id){
	var now = getCounter(id.body.id);
	if(!now) return false;
	if(counters.status !== id.body.id || !now.session.length || now.session[now.session.length - 1][1]){
		if(counters.status){
			stopCounter();
		}
		now.session.push([new Date(), false]);
		counters.status = id.body.id;
		writeDb();
		return now.session
	}else{
		return 'Уже запущен';
	}

	return false;

}

var addCounter = function(req){
	for(var i = counters.history.length - 1; i >= 0; i--){
		if(new Date(counters.history[i].date).valueOf() == (dateAbs).valueOf()){
			counters.history[i].counters.push({
				id : req.id,
				name: req.name,
				session : []
			})
			writeDb();
			return 'добавленно'
		}
	}
}


var stopCounter = function(){
	var now = getCounter(counters.status);
	if(now && !(now.session[now.session.length - 1][1])){
		now.session[now.session.length - 1][1] = new Date();
		counters.status = false;
		writeDb();
		return true;
	}
	return false
}

var getHistory = function(){
	return counters.history;
}

var userIni = function(user){
	readDb(user);
	counters = db[user];
}


exports.get = function(req, res){
	res.render('timer');
}



exports.post = function(req, res){

	var obj = {mess: 'Нихуя'}

	userIni(req.user.username);

	switch(req.body.action){
		case 'start': {
			obj.mess = startCounter(req);
			break;
		}
		case 'stop': {
			obj.mess = stopCounter();
			break;
		}
		case 'get': {
			obj.history = getHistory();
			obj.status = counters.status;
			break;
		}
		case 'add': {
			obj.mess = addCounter(req.body);
			obj.history = getHistory();
			obj.status = counters.status;
			break;
		}
		default: {
			obj.mess = 'Хуй'

		}
	}

	res.json(obj);
}