var mongoose = require('mongoose'); //mongodb object modeling for node
mongoose.connect('mongodb://localhost/nodeSkeletondb');


var db = mongoose.connection; // connects to express, lets you know if its connected after'npm start'
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("were connected!"); //server connected connected to Mongo
});

