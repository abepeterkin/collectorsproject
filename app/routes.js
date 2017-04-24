var objectDB = require("./objectdatabase.js");
var XLSX = require('xlsx');

module.exports = function(app, passport) {

/************************/
/*	Home page with menu	*/
/************************/
app.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('home.ejs', {
			username: req.user.firstname
		});
		console.log("User " + req.user + " logged in")
	} else {
		res.render('home.ejs', {
			username: ""
		});
		console.log("No user logged in")
	}
});

/************************/
/*		Signup process	*/
/************************/
app.get('/signup', function(req, res) {
	res.render('signup.ejs', { 
		message: req.flash('signupMessage')
	});
});

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

/************************/
/*		Login process	*/
/************************/
app.get('/login', function(req, res) {
	res.render('login.ejs', { 
		message: req.flash('loginMessage')
	});
});

app.post('/login', passport.authenticate('local-login', function(req, res) {
	console.log(req);
}));

/************************/
/*		User profiles	*/
/************************/
app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile.ejs', {
		user : req.user // get the user out of session and pass to template
	});
});
/*
    app.get('/userprofile', isLoggedIn, function(req, res) {
        res.render('userprofile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });*/

/************************/
/*		Logout process	*/
/************************/
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/************************/
/*		Search process	*/
/************************/
app.get('/search', function(req, res) {
	res.render('search.ejs');
});

app.post('/search/:query', function(req, res) {
	var query = req.params.query;
	res.send(objectDB.searchQuery(query));
});
	
	app.post('/uploadfile', function(req, res) {
		var spreadsheet = req.files.spreadsheet;
		console.log('- Received file submission: ' + spreadsheet.name);
		workbook = XLSX.read(spreadsheet.data);
		xlsx = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
		res.send(objectDB.insertArtifact(xlsx));
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
