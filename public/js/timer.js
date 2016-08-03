var getAjax = function(){
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
		return ajax;
};

var obj = {
	action : 'start', // stop, get
	id: 'work'
}

var lastUpd = null;

var dateAbs = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay());


var startTicker = function(){
	var count = true;
	
	return function(cb){
		if(count){
			setInterval(function(){
				cb();
			}, 1000);
		}
		count = false;
	};
}()

var callToServer = function(obj, cb){

	var bool = false;
	var ajax = getAjax();

	ajax.open('POST', '/timer', true);
	ajax.setRequestHeader('Content-type','application/json');
	
	ajax.send(JSON.stringify(obj));

	ajax.onreadystatechange = function(){

			if(ajax.readyState == 4){
			
				cb(JSON.parse(ajax.responseText));

			}

		}
}


var test = function(res){
	console.log(res.mess);

}

var parseHistory = function(data){
	lastUpd = data;
	drawCounters(data.history[0].counters);
	startTicker(drawCounters);

}

var createCounters = function(counters){
	
	var body = document.getElementById('wrapper');

	if(!document.getElementById(counters.id)){
		var str = document.createElement('div');
		body.appendChild(str);
		str.id = counters.id;
	}else{
		var str = document.getElementById(counters.id);
	}

	return str;	
}

var drawCounters = function(coun){

	
	var counters = coun || lastUpd.history[0].counters;

	for(var i = counters.length - 1; i >= 0; i--){
		
		var str = createCounters(counters[i]);
		str.innerHTML = parseTime(counters[i]) + ' - ' + counters[i].name;
	}

}

var parseTime = function(time){
	var session = 0;
	if(time.session){
		for(var i = 0; i < time.session.length; i++){
			if(time.session[i][1]){
				session += new Date(time.session[i][1]) - new Date(time.session[i][0]); 
				// console.log(new Date(time.session[i][1]) - new Date(time.session[i][0])); 
			}else{
				session += new Date() - new Date(time.session[i][0]);
			}
		}
	}
	session = new Date(session);

	return plusZero(session.getUTCHours()) + ' : ' + plusZero(session.getMinutes()) + ' : ' + plusZero(session.getSeconds());
}


var plusZero = function(num){
	if((num + '').length < 2){
		return '0' + num;
	}else{
		return num;
	}
}




var start = function(id){
	if(!id) return false;
	callToServer({
		action: 'start',
		id: id
	}, get)
}

var stop = function(){
	// if(!id) return false;
	callToServer({
		action: 'stop',
		id: 'some'
	}, get)
}

var add = function(id, name){
	if(!id) return false
	callToServer({
		action: 'add',
		name: name,
		id: id
	}, parseHistory);
}

var get = function(){
	callToServer({
		action: 'get'
	}, parseHistory);
}

var init = function(){
	get();
		

}();


