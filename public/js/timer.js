var day = document.getElementById('day');
var hour = document.getElementById('hour');
var min = document.getElementById('min');
var second = document.getElementById('second');

	
var ls = window.localStorage;

var filds = {
	lern : {
		name: 'lern',
		state: ls.getItem('lern_state') || false, 
		value: parseInt(ls.getItem('lern_value')) || 0, 
		point: parseInt(ls.getItem('lern_point')) || false, 
		names: 'l'
	},
	work : {
		name: 'work', 
		state: ls.getItem('work_state') || false, 
		value: parseInt(ls.getItem('work_value')) || 0, 
		point: parseInt(ls.getItem('work_point')) || false, 
		names: 'w'
	},
	joy : {
		name: 'joy', 
		state: ls.getItem('joy_state') || false, 
		value: parseInt(ls.getItem('joy_value')) || 0, 
		point: parseInt(ls.getItem('joy_point')) || false, 
		names: 'j'
	}
	
}

// document.getElementById('resetLS').onclick = function(){
// 	window.localStorage.clear();
// }


for(var key in filds){

	var f = function(key){

		var time = 0;

		if(filds[key].point && filds[key].point !== 'flase'){
			
			time = new Date() - filds[key].point;
			
			console.log('!!!' + key);

			document.getElementById(filds[key].name).style.opacity = '1';
		}
		
		time = new Date(parseInt(filds[key].value) + time); 

		var d = (time.getDate() - 1).toString();
		var h = time.getUTCHours().toString();
		var m = time.getUTCMinutes().toString();
		var s = time.getUTCSeconds().toString();

		document.getElementById(filds[key].names + '-day').innerHTML = d.length < 2 ? '0' + d : d;
		document.getElementById(filds[key].names + '-hour').innerHTML = h.length < 2 ? '0' + h : h;
		document.getElementById(filds[key].names + '-min').innerHTML = m.length < 2 ? '0' + m : m;
		document.getElementById(filds[key].names + '-second').innerHTML = s.length < 2 ? '0' + s : s;
		
		return function(){
			document.getElementById(filds[key].name).onclick = function(){ setObj(filds[key]) }
		}();

	}(key);


}


var nowDo = function(){

	for(var key in filds){

		if(filds[key].state == 'true'){
			return filds[key];
		};
	}

	return null;

}();

function setObj (obj){

	if(nowDo){

		start(nowDo);

	}

	nowDo = obj;
	
	start(obj);

}


function setTimer(){
	
	var date = new Date();
	
	var h = date.getHours().toString();
	var m = date.getMinutes().toString();
	var s = date.getSeconds().toString();


	hour.innerHTML = h.length < 2 ? '0' + h : h;
	min.innerHTML = m.length < 2 ? '0' + m : m;
	second.innerHTML = s.length < 2 ? '0' + s : s;

	if(nowDo && nowDo.state){
		
		var ld = document.getElementById(nowDo.names + '-day');
		var lh = document.getElementById(nowDo.names + '-hour');
		var lm = document.getElementById(nowDo.names + '-min');
		var ls = document.getElementById(nowDo.names + '-second');

		var time = new Date();

		time = time - nowDo.point;

		time = new Date(nowDo.value + time);

		var lernd = (time.getDate() - 1).toString();
		var lernh = time.getUTCHours().toString();
		var lernm = time.getUTCMinutes().toString();
		var lerns = time.getUTCSeconds().toString();

		ld.innerHTML = lernd.length < 2 ? '0' + lernd : lernd;
		lh.innerHTML = lernh.length < 2 ? '0' + lernh : lernh;
		lm.innerHTML = lernm.length < 2 ? '0' + lernm : lernm;
		ls.innerHTML = lerns.length < 2 ? '0' + lerns : lerns;

	}

}

function start(obj){

	if(obj.state == 'false' || !obj.state){

		obj.point = obj.point.valueOf() || new Date().valueOf();
		obj.state = true;

		document.getElementById(obj.name).style.opacity = '1';

		window.localStorage.setItem(obj.name + '_point', obj.point.valueOf());
		window.localStorage.setItem(obj.name + '_state', obj.state);

	}else{

		obj.state = false;
		obj.value += new Date() - obj.point;
		obj.point = false;

		document.getElementById(obj.name).style.opacity = '0.5';

		window.localStorage.setItem(obj.name + '_point', obj.point);
		window.localStorage.setItem(obj.name + '_value', obj.value);
		window.localStorage.setItem(obj.name + '_state', obj.state);
	}

}

setTimer();



var timer = setInterval(function(){

	setTimer();

},1000);