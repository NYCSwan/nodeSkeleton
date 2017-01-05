var mongoose = require('mongoose'); 

var productSchema = new mongoose.Schema({
	//attributes: schema type (string, boolean, etc)
	name: String,
	price: Number,
	description: String
});

mongoose.model('Product', productSchema);