;
'use strict';

// alert('Js core loaded !!');

// пример объекта не работает ни где не используется 
var requestObj = {

	// имя действия которое необходимо сотворить 
	name : 'Name of action',

	// адрес обработчика на сервере
	address : '/module',

	// какие либо параметры
	param : {
		ignoreLoad : true,
		css : [], // адрес для css файла  
		js : [] // адрес для js файла  
	},

	// информация которую мы хотим передать на обработчик
	body : 'Some data'
};



var core = function(){

	// Обьект очереди загрузки модулей
	var moduleQueue = {};

	var endLoadingCallBack = false;
	var endLoading = false;

	// обращение к серверу 
	var callServer = function(obj, cb){
		var address = '/module' || obj.address;
		var ajax;
	  	try {
	    	ajax = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				ajax = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
	    		ajax = false;
	    	}
		}
		if (!ajax && typeof XMLHttpRequest != 'undefined') {
	    	ajax = new XMLHttpRequest();
		}
		ajax.open('POST', address, true);
		ajax.setRequestHeader('Content-type','application/json');
		ajax.send(JSON.stringify(obj));
		ajax.onreadystatechange = function(){
			if(ajax.readyState == 4){
				if(JSON.parse(ajax.responseText)){
					cb(JSON.parse(ajax.responseText));
				}else{
					cb(ajax.responseText);
				}
			}
		}
	};

	// парсим ответ сервера 
	var addModule = function(obj){
		if(obj.parent){
			var parent = document.getElementById(obj.paret);
			if(!parent) return false; // Допистать обработчик
		}else{
			var parent = document.body;
		}
		var module = document.createElement('div');
		module.id = obj.name;
		module.style.display = 'none';
		module.innerHTML = obj.html;

		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.href = obj.css;
		document.head.appendChild(link);
		var script = document.createElement('script');
		script.src = obj.js;
		parent.appendChild(script);
		parent.appendChild(module);	
		return true;
	};

	// отображаем в консоль mess
	var printMess = function(arr){
		if(arr && arr instanceof Array){
			for(var i = 0; i < arr.length; i++){
				console.log('From server ---> ' + arr[i]);
			}
		}
	};

	// загружаем модуль с сервера 
	var loadModule = function(name, ignore){


		if(name && typeof(name) === 'string' && !document.getElementById(name)){

			var ignore = ignore || false; 

			callServer({
				name : name,
				address : '/module',
				param : {
					ignoreLoad : ignore
				},
				body : {
					action : 'get'
				}

			}, function(res){

				moduleQueue[name].state = 1;
				printMess(res.message);
				addModule(res.obj);

			})

			return true

		}else{
			return false
		}	
	};

	// добавляем модуль в очередь на загрузку с сервера 
	var addQueueModule = function(name){

		if(!(name instanceof Array)) return false;

		for(var i = 0; i < name.length; i++){

			if(!moduleQueue[name[i]]){

				var module = {
					name : name[i],
					state : 0
				};

				moduleQueue[name[i]] = module;

				loadModule(name[i]);				

			}
		
		}
	};

	//переменная колбек при выполнении загрузки выполнения загрузки

	// сетер callback загрузки
	var setEndLoadingCallBack = function(fn){
		endLoadingCallBack = fn;
	}

	// сетер функции загрузки загрузки
	var setEndLoading = function(fn){
	
		endLoading = fn;
	}

	// отчет о зарузке модуля со стороны модуля 

	var moduleLoaded = function(name){


		if(typeof(name) === 'string' && moduleQueue[name]){

			delete moduleQueue[name];

		}

		var queueIsClear = true;

		for(i in moduleQueue){

			queueIsClear = false;

		}

		if(queueIsClear){
			if(typeof(endLoading) == 'function'){
				endLoading(endLoadingCallBack);
			}
		}
	}

	// инициализация запуск стартовых функций
	var init = function(){

	}

	return{
		callServer : callServer,
		loadModule : loadModule,
		addQueueModules : addQueueModule,
		moduleLoaded : moduleLoaded,
		setEndLoadCB : setEndLoadingCallBack,
		setEndLoad : setEndLoading
	}

}();

core.setEndLoad(function(endLoading){
	var fn = endLoading || false;
	setTimeout(function(){
		document.getElementById('loading').className = 'loading-off'; 

		if(fn){
			fn();
		}
	
	}, 500);
})

core.addQueueModules([
	'menu'
	]);
















