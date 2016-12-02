var express = require('express'),
var router = express.Router(),
var mongoose = require('mongoose'), //mongo connection
var bodyParser = require('body-parser'), //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

// method-over script
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
// GET all models
	.get(function(req, res, next){
		// retrieve all items from the db
		mongoose.model(Model).find({}, function(err, models) {
			if (err) {
				return conosle.error(err);
			} else {
				// respond to html and json 
				html: function(){
					res.render('models/index', {
						title: 'All the Models',
						"models": models
					});
				},
				json: function(){
					res.json(models);
				}
			});	
		}
	});
	// post new thing
	.post(function(req, res){
		// get values from post req through forms or rest calls.
		var name = req.body.name;
		// call the create function for db
		mongoose.model('Model').create({
			name: name
		}, function(err, model){
			if (err) {
				res.send("there was a problem adding the info to the db");
			} else {
				// model instance has been created
				  console.log('POST creating new instance of model: ' + model);
				res.format({
				//HTML response will set the location and redirect back to the home page or wherever you want (success page)
					html: function(){
						// If it worked, set the header so the address bar doesn't still say /adduser
						res.location("models");
						// And forward to success page
						res.redirect("/models");
					},
				//JSON response will show the newly created blob
					json: function(){
						res.json(model);
					}
				});
			}
		})
	});