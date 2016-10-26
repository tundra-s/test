var drawLogin = function(){
	var module = document.getElementById('login');
	module.style.display = 'block';

	var button = document.getElementById('login-button');

	button.addEventListener('click', function(e){
		
		var login = document.getElementById('login-name').value;
		var pass = document.getElementById('login-pass').value;

		if(login && typeof(login) === 'string'){
			if(login.length < 3){
				console.log('Логин должен быть длиннее 3 символов !');
				return false;
			}
		}

		if(pass && typeof(pass) === 'string'){
			if(pass.length < 5){
				console.log('Пароль должен быть длиннее 5 символов !');
				return false;
			}
		}

		core.callServer({
			name : 'login',
			address : '/module',
			param : null,
			body : {
				action : 'call',
				login : login,
				password : pass
			} 
		}, function(res){
			console.log(res);
		})
	});

	setTimeout(function(){

		module.style.opacity = 1;

	}, 100);
}

if(core && core.moduleLoaded){
	drawLogin();
	core.moduleLoaded('login');
}