var objectDB = require("./objectdatabase.js");

var XLSX = require('xlsx');

// app/routes.js
module.exports = function(app, passport) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
      console.log("USER" + req.user);
      if (req.isAuthenticated()) {
          res.render('home.ejs',  {
              username : req.user.firstname
          });
      } else {
        res.render('home.ejs',  {
            username : ""
        });
      }
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // process the signup form
     app.post('/signup', passport.authenticate('local-signup', {
         successRedirect : '/', // redirect to the secure profile section
         failureRedirect : '/signup', // redirect back to the signup page if there is an error
         failureFlash : true // allow flash messages
     }));

     // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/search', function(req, res) {
        res.render('search.ejs');
    });

    app.get('/upload', isLoggedIn, function(req, res) {
        res.render('upload.ejs', {
            user : req.user // get the user out of session and pass to template*/
        });
    });

    app.post('/upload', isLoggedIn, function(req, res) {

      if (!req.body.provenancecolumn || !req.body.namecolumn || !req.files || !req.body.ignoreheader) {
        res.render('uploadresult.ejs', {
            result : "Invalid request",
            error : "Not all fields were entered"
        });
        return;
      }
      insertObjects(req);
      res.render('uploadresult.ejs', {
          result : "Upload Successful",
          error : "The objects were uploaded successfully"
      });
    });

    app.get('/userprofile', isLoggedIn, function(req, res) {
        res.render('userprofile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/search/object', function(req, res) {
      var query = req.body.query;
        //TODO
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function insertObjects(req) {

  var nameColumn = parseInt(req.body.namecolumn) - 1;
  var provenanceColumn = parseInt(req.body.provenancecolumn) - 1;
  var spreadsheet = req.files.spreadsheet;
  var ignoreheader = req.body.ignoreheader;
  console.log('- Recieved file submission: ' + spreadsheet.name);
  var workbook = XLSX.read(spreadsheet.data);
  var columns = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header:1});
  console.log(columns);

  var objectArray = []
  for (var i = 0; i < columns.length; i++) {
    if (i === 0 && ignoreheader === "true") continue;
    var rows = columns[i];
    var name;
    var provenance;
    for (var j = 0; j < rows.length; j++) {
      if (j === nameColumn) {
        name = rows[j];
      }
      if (j === provenanceColumn) {
        provenance = rows[j];
      }
    }
    var object = {
      userId: req.user._id,
      museumId : req.user.affiliation,
      name : name,
      provenace : provenance,
      Persons : [],
      Locations : []
    }
    objectArray.push(object);
  }
  objectDB.insertMany(objectArray);


  /*objectDB.searchOnObject("Paint", function(res) {
    console.log("SEARCH RESULTS:");
    console.log(res);
  });*/
}
