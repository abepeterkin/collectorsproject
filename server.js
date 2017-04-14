// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://abepeterkin:0[2*13F!npw~@ds155490.mlab.com:55490/db1';
	
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'thisisusedtohashthesession5235378' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.set('views', './public/pages')
app.use(express.static(__dirname + '/public'));

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   insertDocument(db, function() {
//       db.close();
//   });
// });

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findObjects(db, function() {
      db.close();
  });
});

// =========================================================
// MONGODB

var insertDocument = function(db, callback) {
   db.collection('object').insertOne( {
   	"userId": 10,
      "museumId" : 100,
      "name" : "Object Name",
      "Provenace" : "John to James 1844, James to RISD 2016",
      "Persons" : [ {personId: 1234}],
      "Locations" : [{locationId: "Egypt"}]
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the object collection.");
    callback();
  });
};

var findObjects = function(db, callback) {
   var cursor =db.collection('object').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};