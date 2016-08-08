var fs = require('fs');
var db = './routes/test.json';

var timer = function(req, res){
	// кеш всей базы данных
	var dataBase = null;
	// ссылка на 
	var userDataBase = null;
	var userToday = null;
	var userName = req.user.username;

	// стандартный обьект ответа 
	var defaultObject = {
		status: null,
		history: null,
		mess: ['Action not found, this is default Error, User : ' + req.user.username ]	
	}

	// добавляем запись в лог
	var log = function(log){
	
		defaultObject.mess.push(log);
	
	}

	// обьеденить два обьекта
	var doubleObj = function(first, second){
		var fObj = first || {};
		var sObj = second || {};
		for(var key in sObj){
			fObj[key] = sObj[key];
		}
		return fObj; 
	}

	// Округляем дату до дня 
	var getRoundedDate = function(date){
		var date = date ? new Date(date) : new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}

	// читаем базу данных
	var readDataBase = function(){
		
		if(!(dataBase = fs.readFileSync(db))){
			log('Database : db is down');
			return false;
		}

		dataBase = JSON.parse(dataBase);

		if(!(userDataBase = dataBase[userName])){
			log('Database : User not found in db');
			return false;
		};
		

		log('Database : db has been Readed !!!');
		
		return true; 
	
	};

	// Пишем в базу данных
	var writeDataBase = function(){
		if(dataBase != null){
			fs.writeFileSync(db, JSON.stringify(dataBase));
			log('writeDataBase : Database has been wrote');
			return true;
		}
		
		log('writeDataBase : Database not found');

		return false;
	};

	// ищем сегодняшний день в базе
	var findForDay = function(d){
		var date = d || getRoundedDate();
		if(date){
			for (var i = 0; i < userDataBase.history.length; i++) {
				if(new Date( userDataBase.history[i].date ).valueOf() == date.valueOf()){
					userToday = userDataBase.history[i];
					return true;
				}
			}
		}
		return false
	}

	// проверяем создан ли обьект для сегодняшнего дня 
	var checkToday = function(){
		if(!findForDay()){
			var today = getRoundedDate();
			var pattern = userDataBase.pattern;
			if(pattern){

				var newDay = doubleObj({}, pattern);
				newDay.date = today;

				var statusNew = false;

				var tomorow;
				if(tomorow = userDataBase.history[userDataBase.history.length - 1]){
					console.log(1);
					if(userDataBase.status){
						console.log(2);
						for (var i = 0; i < tomorow.counters.length; i++) {
							console.log(3);
							if(tomorow.counters[i].id == userDataBase.status){
								console.log(4);
								if(!tomorow.counters[i].session[tomorow.counters[i].session.length - 1][1]){
									console.log(5);

									var lastDate = new Date(today);
									lastDate.setSeconds(lastDate.getSeconds() - 1);
									
									tomorow.counters[i].session[tomorow.counters[i].session.length - 1][1] = lastDate;

									newDay.counters[i].session.push([getRoundedDate(), false]);
									
									statusNew = true;
								}
							}
						}
					}
				}

				console.log(statusNew);

				userDataBase.history.push(newDay);

				writeDataBase();

				log('checkDay : Day not found and created');
			
			}

		}else{
			
			log('checkDay : Day found');
		}
	}

	// находим счетчик
	var getCounter = function(id){
		if(id){	
			if(!userToday){
				// что то делаю
			}else{
				for(var i = 0; i < userToday.counters.length; i++){
					if(userToday.counters[i].id == id){
						return userToday.counters[i];
					}
				}
			}
		}

		return false;
	}


	// стартуем счетчик
	var startCounter = function(id){
		if(id && id != userDataBase.status){
			var counter = getCounter(id);
			counter.session.push([new Date(), false]);
			
			if(userDataBase.status !== false){
				stopCounter(userDataBase.status);
			}
			
			defaultObject.history = userDataBase.history;
			defaultObject.status = userDataBase.status = id;
			log('Counter has been started ' + id);

			writeDataBase();

			return defaultObject;
		}else{
			defaultObject.mess = [];
			log('This counter already started !');
			return defaultObject
		}
	}

	// остановка таймера 
	var stopCounter = function(id){
		if(id){
			var counter = getCounter(id);

			if(counter.session.length > 0){
				if(!(counter.session[counter.session.length - 1][1])){
					counter.session[counter.session.length - 1][1] = new Date();

					userDataBase.status = false;
				
					// запись в базу данных ставить не буду , по тому что 
				}
			}
		}else{
			var counter = getCounter(userDataBase.status)
		
			if(counter.session.length > 0){
				if(!(counter.session[counter.session.length - 1][1])){
					counter.session[counter.session.length - 1][1] = new Date();
				
					userDataBase.status = false;

					writeDataBase();

					defaultObject.history = userToday;
					defaultObject.status = userDataBase.status;

					return defaultObject;


				}		
			}
		
		}
	}

	// получение обновления 

	var getHistory = function(date){
		defaultObject.history = userToday;
		defaultObject.status = userDataBase.status;

		return defaultObject;
	}

	// функция инициализатор
	var ini = function(){
		readDataBase();
		checkToday();
	}();

	// Возвращаем стандартный пустой обьект, для теста
	var returnDefaultObject = function(mess){
		defaultObject.mess = mess || defaultObject.mess;
		return defaultObject;
	}

	var clear = function(){
		delete userDataBase.history[userDataBase.history.length - 1];
	}

	return {
		// старт счетчика 
		start : startCounter,
		// остановка счетчика 
		stop : stopCounter,
		// остановка счетчика 
		get : getHistory,
		// остановка счетчика 
		add : returnDefaultObject,
		// 
		clear : clear,
		// остановка счетчика 
		default : returnDefaultObject,
	}
}

module.exports = timer;