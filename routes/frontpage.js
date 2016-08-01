exports.get = function(req, res){
	res.render('index', {
		title: 'hello',
		user: req.session.user || false
	});
}