exports.get = function(req, res){
	
	res.render('index', {

		title: req.session.user ? 'registred' : 'unregistred',
		user: req.session.user || false

	});
}

