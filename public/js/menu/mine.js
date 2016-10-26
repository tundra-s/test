if(core && core.moduleLoaded){
	core.callServer({
		name : 'menu',
		address : '/module',
		param : null,
		body : {
			action : 'call'
		}
	}, function(res){
		console.log(res);
		drawMenu(res.body.menuArray);
		core.moduleLoaded('menu');
	});

	core.setEndLoadCB(function(){
		setTimeout(function(){
			document.getElementById('menu').style.opacity = '1';
		}, 500);
	});
	
}


var drawMenu = function(arr){
	if(arr instanceof Array){
		var module = document.getElementById('menu');
		module.style.display = 'block';
		var ul = document.getElementById('menu-container');
		for(var i = 0; i < arr.length; i++){
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.href = arr[i][2];
			a.innerHTML = arr[i][1];
			
			a.addEventListener('click', function(e){
			    var evt = e ? e : window.event;
				console.log(e.target.getAttribute('href'));
				core.addQueueModules(['login']);
				// core.addQueueModules([e.target.getAttribute('href')]);
				evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
				return false;
			});

			li.appendChild(a);
			ul.appendChild(li);
		}
	}
}