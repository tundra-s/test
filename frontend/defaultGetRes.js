var fs = require('fs');


module.exports = function(set){
	
	var obj = new Object();
	
	obj.message = ['Обработчик найден'];

	// Желательно переделать на async
	var html = fs.readFileSync(__dirname + '/' + set.name + '/template.html').toString();
	var js = ['js/' + set.name + '/mine.js']; // ============================
	var css = ['css/' + set.name + '/style.css']; // Можно расшрить до множества 

	obj.obj = {
		name : set.name,
		parent : false,
		html : html,
		js : js,
		css : css
	}
	return obj;
}