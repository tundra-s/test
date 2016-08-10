exports.get = function(req, res){
	
	var setDate = function(num){
		var date = new Date(num);
		return date.getYears() + '.' + date.getMonth() + '.' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes() + '"' + date.getSeconds();
	}

	res.render('index', {

		title: req.session.user ? 'registred' : 'unregistred',
		user: req.user.username || false,
		setDate : setDate

	});
}

