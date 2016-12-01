var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
	//attributes: schema type (string, boolean, etc)
});

mongoose.model('Model', modelSchema);