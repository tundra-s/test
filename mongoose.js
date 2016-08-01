var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var schema = mongoose.Schema({
	name: String
});

schema.methods.meow = function(){
	console.log(this.get('name'));
}

// create model
// var Cat = mongoose.model('Cat', {name : String});
var Cat = mongoose.model('Cat', schema);

var kitty = new Cat ({ name : 'Gaj' });

kitty.save(function(err) {
	if(err){
		console.log('Ooops !');
	}else{

		kitty.meow();

	}
})