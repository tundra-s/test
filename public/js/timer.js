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

var lastUpdDate = null;

var lastUpd = null;

var dateAbs = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());


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
			
				if(JSON.parse(ajax.responseText)){
					cb(JSON.parse(ajax.responseText));
				}

			}

		}
}


var test = function(res){
	console.log(res.mess);

}

var parseHistory = function(data){
	
	console.log(data);
	if(data){	
		if(data.mess){
			parseMess(data.mess);
		}
		if(data.history != null){
			
			lastUpd = data;

			console.log(data.history.counters);

			if(data.history.counters){
				drawCounters(data.history.counters);
			}
			
			startTicker(tick);
		}	
	}

}

var tick = function(){
	get();
	drawCounters();
	drawStateWrapper();
}

var drawStateWrapper = function(){
	var wrapper = document.getElementById('state');
	if(wrapper){
		var d = new Date(dateAbs);
		d.setHours(24);
		var nowDate = new Date();
		var sutki = d.valueOf() - dateAbs.valueOf();
		var nowPt = new Date().valueOf() - dateAbs.valueOf();
		var percent = nowPt / sutki * 100;
		wrapper.style.height = 30 + 'px';
		wrapper.style.width = percent + '%';
		drawStateCounters();
	}
}

var drawStateCounters = function(){
	var counters = lastUpd.history.counters;
	var wrapper = document.getElementById('state');

	for (var i = counters.length - 1; i >= 0; i--) {
		var stateBlock;
		var create = false;
		if(!(stateBlock = document.getElementById('state-block-' + counters[i].id))){
			var stateBlock = document.createElement('div');
			stateBlock.id = 'state-block-' + counters[i].id;
			create = true;
		}

		stateBlock.className = 'state-block';


		if(counters[i].id == lastUpd.status){

			stateBlock.className += ' state-active';

		}

		var dateTodayDown = new Date().valueOf() - dateAbs.valueOf();

		var percent = parseTime(counters[i], true) / dateTodayDown * 100;

		stateBlock.style.width = percent + '%';

		if(create){
			wrapper.appendChild(stateBlock);
		}
	}
}

var parseMess = function(mess){
	if(mess instanceof Array){
		for (var i = 0; i < mess.length; i++) {
			console.log('------------------------');
			console.log(mess[i]);
			console.log('------------------------');
		}
	}
}

var createCounters = function(counters){
	
	var body = document.getElementById('wrapper');

	if(!document.getElementById(counters.id)){
		var str = document.createElement('div');
		body.appendChild(str);
		str.id = counters.id;
		str.className = 'counter';
		str.onclick = function(){
			start(this.id);
		}
	}else{
		var str = document.getElementById(counters.id);
	}

	return str;	
}

var drawCounters = function(coun){

	var counters = coun || lastUpd.history.counters;

	for(var i = counters.length - 1; i >= 0; i--){
		
		var str = createCounters(counters[i]);
		
		if(lastUpd && lastUpd.status == counters[i].id){
			str.className = 'counter counterActive';
		}else{
			str.className = 'counter';
		}

		var box = '<div class="state-box box-'+counters[i].id+'"></div>';

		str.innerHTML =  box + parseTime(counters[i]) +  counters[i].name;
	}

}

var parseTime = function(time, bool){
	var bool = bool || false;
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

	if(!bool){
		return "<div class='counter-string'>" + plusZero(session.getUTCHours()) + ' : ' + plusZero(session.getMinutes()) + ' " ' + plusZero(session.getSeconds()) + "</div>";
	}else{
		return session.valueOf();
	}
}

// добавляем в строку к однозначным значениям ноль
var plusZero = function(num){
	if((num += '').length < 2){
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

var get = function(d){
	var status = null;

	if(lastUpd && lastUpd.status){
		status = lastUpd.status;
	}

	callToServer({
		action: 'get',
		date: d || dateAbs,
		status : status
	}, parseHistory);
}


var clear = function(d){
	callToServer({
		action: 'clear',
		date: d || dateAbs
	}, parseHistory);
}




var init = function(){
	get();
		

}();






