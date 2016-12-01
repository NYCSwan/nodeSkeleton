var mongoose = require('mongoose'); 

var modelSchema = new mongoose.Schema({
	//attributes: schema type (string, boolean, etc)
	name: String
});

mongoose.model('Model', modelSchema);