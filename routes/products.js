// it's essentially the routesController but file name taken from db/model name. should be products in this example
var express = require('express'),
var router = express.Router(),
var mongoose = require('mongoose'), //mongo connection
var bodyParser = require('body-parser'), //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

// method-over script. Any req to this controller must pass through use funct
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

// REST operations for the thing aka index page/root
router.route('/')
// GET all items-model from db 
	.get(function(req, res, next){
		// retrieve all items from the db
		mongoose.model('Product').find({}, function(err, products) {
			if (err) {
				return conosle.error(err);
			} else {
				res.format({
				// respond to html and json 
					html: function(){
						res.render('products/index', {
							title: 'All the Products',
							"products": products
						});
					},
					json: function(){
						res.json(products);
					}
				});
			}
		});	
	})
// post new thing/model
	.post(function(req, res){
		// get values from post req through forms or REST calls.
		var name = req.body.name;
		var price = req.body.price;
		// call the create function for db
		mongoose.model('Product').create({
			name: name,
			price: price
		}, function(err, product){
			if (err) {
				res.send("there was a problem adding the info to the db");
			} else {
				// product instance has been created
				  console.log('POST creating new instance of product: ' + product);
				res.format({
				//HTML response will set the location and redirect back to the home page or wherever you want like a success page
					html: function(){
						// If it worked, set the header so the address bar doesn't still say /adduser
						res.location("products");
						// And forward to success page
						res.redirect("/products");
					},
				//JSON response will show the newly created blob
					json: function(){
						res.json(product);
					}
				});
			}
		})
	});

// get NEW thing- 'Create' route
router.get('/new', function(req, res) {
    res.render('products/new', { title: 'Add New thing' });
});

// route middleware to validate the id
router.param('id', function(req, res, next, id){
	console.log('validating ' + id + ' exists...');
	// find the id in the db
	mongoose.model('Product').findById(id, function(err, model){
		if(err) {
			console.log(id + 'was not found');
			res.status(404);
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: function(){
				next(err);
			},
			json: function() {
				res.json({message: err.status + ' ' + err});
			}
		} else {
			// validate and save the new item in the req
			req.id = id;
			next();
		}
	});
});

// show route
router.route('/:id')
	.get(function(req, res){
		mongoose.model('Product').findById(req.id, function(err, product){
			if (err){
				console.log('GET error, cant find your thing:' + err);
			} else {
				console.log('GET retrieving ID: ' + product._id);
				var productName = product.name;
				var productPrice = product.price;
				res.format({
					html: function() {
						res.render('products/show', {
							"product": product,
							"productName": productName
						});
					},
					json: function() {
						res.render(product);
					}
				});
			}
		});
	});

// GET Edit route for specific model-thing based on ID
router.get('/:id/edit') {
	.get(function(req, res) {
    //search for the product within Mongo
	    mongoose.model('Product').findById(req.id, function (err, product) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the product
	          	console.log('GET Retrieving ID: ' + product._id);
				var productName = product.name;
				var productPrice = product.price;
	            res.format({
	                //HTML response will render the 'edit.pug' template
	                html: function(){
	                       res.render('products/edit', {
		                        title: 'Product' + product._id,
	                            "productName" : productName,
		                        "product" : product
	                      	});
	                },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(product);
	                }
	            });
	        }
    	});
	});
		//PUT to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    var name = req.body.name;

	    //find the document by ID
	    mongoose.model('Product').findById(req.id, function (err, product) {
	        //update it with new attributes
	        product.update({
	            name : name
	        }, function (err, productID) {
	            if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	            } else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                res.format({
	                    html: function(){
	                        res.redirect("/products/" + product._id);
	                    },
	                     //JSON responds showing the updated values
	                    json: function(){
	                       res.json(product);
	                    }
	                });
	            }
	        });
	    });
	})
// 	//DELETE a Blob by ID
// 	.delete(function (req, res){
// 	    //find product by ID
// 	    mongoose.model('Blob').findById(req.id, function (err, product) {
// 	        if (err) {
// 	            return console.error(err);
// 	        } else {
// 	            //remove it from Mongo
// 	            product.remove(function (err, product) {
// 	                if (err) {
// 	                    return console.error(err);
// 	                } else {
// 	                    //Returning success messages saying it was deleted
// 	                    console.log('DELETE removing ID: ' + product._id);
// 	                    res.format({
// 	                        //HTML returns us back to the main page, or you can create a success page
// 	                          html: function(){
// 	                               res.redirect("/blobs");
// 	                         },
// 	                         //JSON returns the item with the message that is has been deleted
// 	                        json: function(){
// 	                               res.json({message : 'deleted',
// 	                                   item : blob
// 	                               });
// 	                         }
// 	                      });
// 	                }
// 	            });
// 	        }
// 	    });
// 	});
}
module.exports = router;