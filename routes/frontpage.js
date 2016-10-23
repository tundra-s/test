var fs = require('fs');

exports.get = function(req, res){

	res.end(fs.readFileSync('./views/index.htm'));
	
	// var setDate = function(num){
	// 	var date = new Date(num);
	// 	return date.getYears() + '.' + date.getMonth() + '.' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes() + '"' + date.getSeconds();
	// }

	// var user = false;

	// if(req.user){
	// 	user = req.user.username;
	// }

	// res.render('index', {

	// 	title: req.session.user ? 'registred' : 'unregistred',
	// 	user: user

	// });
}

