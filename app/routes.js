var objectDB = require("./objectdatabase.js");
var user_model = require('../app/models/user');
var XLSX = require('xlsx');

module.exports = function(app, passport) {

/************************/
/*	Home page with menu	*/
/************************/
app.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		console.log(req.user);
		res.render('home.ejs', {
			userid		 : req.user._id,
			email        : req.user.local.email,
			firstname    : req.user.firstname,
			lastname     : req.user.lastname,
			affiliation  : req.user.affiliation,
			city         : req.user.city,
			country      : req.user.country
		});
		console.log("User " + req.user + " logged on");
	} else {
		res.render('home.ejs', {
			userid		 : undefined,
			email	     : undefined,
			firstname    : undefined,
			lastname     : undefined,
			affiliation  : undefined,
			city         : undefined,
			country      : undefined
		});
		console.log("Logged unregistered user");
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
	successRedirect: '/',
	failureRedirect: '/signup',
	failureFlash: true // allow flash messages
}));

/************************/
/*		Signin process	*/
/************************/
app.get('/signin', function(req, res) {
	res.render('signin.ejs', {
		message: req.flash('loginMessage')
	});
});

app.post('/signin', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/signin',
	failureFlash: true // allow flash messages
}));

/************************/
/*		User profiles	*/
/************************/
app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile.ejs', {
		userid		 : req.user._id,
		email        : req.user.local.email,
		firstname    : req.user.firstname,
		lastname     : req.user.lastname,
		affiliation  : req.user.affiliation,
		city         : req.user.city,
		country      : req.user.country
	});
});

/************************/
/*		Uploading data	*/
/************************/
app.get('/upload', isLoggedIn, function(req, res) {
	res.render('upload.ejs', {
		user: req.user
	});
});

app.post('/upload', isLoggedIn, function(req, res) {
	if (!req.body.provenancecolumn || !req.body.namecolumn || !req.files || !req.body.ignoreheader) {
		res.render('uploadresult.ejs', {
			result: "Invalid request",
			error: "Not all fields were entered"
		});
		return;
	}
	insertObjects(req);
	res.render('uploadresult.ejs', {
		result: "Upload Successful",
		error: "The objects were uploaded successfully"
	});
});

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
	console.log("QUERY: [" + [query] + "]");
	var after = 0;
	if (query !== "") {
		objectDB.searchOnObject(query, after, function(result) {
			var resultJSON = JSON.stringify(result);
			res.send(resultJSON);
		});
	}
});

app.post('/search/:query/:userid', function(req, res) {
	var query = req.params.query;
	var userid = req.params.userid;
	console.log("QUERY: [" + [query] + "]");
	console.log("QUERY: [" + [userid] + "]");
	if (query !== "") {
		objectDB.searchForUserObjects(userid, query, function(result) {
			var resultJSON = JSON.stringify(result);
			res.send(resultJSON);
		});
	}
});

app.get('/mark/person/:object', function(req, res) {
	var object = req.params.object;
	objectDB.searchObjectOfPerson(object, function(result) {
		var resultJSON = JSON.stringify(result);
		res.send(resultJSON);
	});
});

app.get('/mark/location/:object', function(req, res) {
	var object = req.params.object;
	objectDB.searchObjectOfLocation(object, function(result) {
		var resultJSON = JSON.stringify(result);
		res.send(resultJSON);
	});
});

app.post('/mark/person/:object/:person', function(req, res) {
	var object = req.params.object;
	var person = req.params.person;
	var after = 0;
	if (person !== "") {
		objectDB.searchOnPerson(person, after, function(result) {
			if (result.length !== 0) { 
				console.log(person + " is already in the collection; adding '" + object + "' to existing record for: " + person);
				console.log("Updating all associated object records...");
				objectDB.updatePersonsInObjects(person, function (data) {
					res.send(data);
				});
			} else {
				objectDB.createPerson(person, object, function(data) {
					res.send(data);
				});

				console.log("Updating all associated object records...");
				objectDB.updatePersonsInObjects(person, function (data) {
					var resultJSON = JSON.stringify(data);
					res.send(resultJSON);
				});
			}
		});
	} else {
		res.send("Invalid query");
	}
});

app.post('/mark/location/:object/:location', function(req, res) {
	var object = req.params.object;
	var location = req.params.location;
	var after = 0;
	if (location !== "") {
		objectDB.searchOnLocation(location, after, function(result) {
			if (result.length !== 0) {
				console.log(location + " is already in the collection; adding '" + object + "' to existing record for: " + location);
				console.log("Updating all associated object records...");
				objectDB.updateLocationsInObjects(location, function (data) {
					res.send(data);
				});
			} else {
				objectDB.createLocation(location, object, function(data) {
					res.send(data);
				});

				console.log("Updating all associated object records...");
				objectDB.updateLocationsInObjects(location, function (data) {
					var resultJSON = JSON.stringify(data);
					res.send(resultJSON);
				});
			}
		});
	} else {
		res.send("Invalid query");
	}
});


/************************/
/*	Artifact editing 	*/
/************************/
app.post('/deleteartifact/:artifactid', isLoggedIn, function(req, res) {
	var artifactid = req.params.artifactid;
	objectDB.findObjectWithID(artifactid, function(artifact) {
		if (artifact) {
			if (JSON.stringify(artifact.userId) === JSON.stringify(req.user._id)) {
				objectDB.removeObject(artifactid);
				res.redirect('/profile');
			} else {
				res.status(403).send("Error: You do not have permission to edit that object");
			}
		} else {
			res.status(404).send("Error: that object does not exist");
		}
	});
});

/************************/
/*		Profile editing */
/************************/
app.post('/editprofile',isLoggedIn, function(req, res) {
	user_model.findOne({ 'local.email' :  req.user.local.email }, function(err, user) {
		console.log("findOne... ");
			if (err) {
				console.log("Profile update error: " + err);
				return;
			}

			if (user) {
				console.log("firstname: " + req.body.firstname);
				user.local.email = req.body.email;
				user.firstname   = req.body.firstname;
				user.lastname   = req.body.lastname;
				user.affiliation   = req.body.affiliation;
				user.city   = req.body.city;
				user.country   = req.body.country;
				user.save(function(err) {
					if (err) {
						console.log(err);
					} else {
						console.log("User " +  req.user.local.email + " profile updated");
					}
					res.redirect('/profile');
				});
			} else {
					console.log("User " +  req.user.local.email + " not found");
					res.redirect('/profile');
			}
		});
});

/************************/
/*	Helper Functions	*/
/************************/
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/');
	}
}

function insertObjects(req) {
	var nameColumn = parseInt(req.body.namecolumn) - 1;
	var provenanceColumn = parseInt(req.body.provenancecolumn) - 1;
	var spreadsheet = req.files.file;
	var ignoreheader = req.body.ignoreheader;
	console.log('- Received file submission: ' + spreadsheet.name);
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
      name : escapeHtml(name),
      Provenance : escapeHtml(provenance),
      Persons : [],
      Locations : []
    }
    objectArray.push(object);
  }
  objectDB.insertMany(objectArray);
}
}

var entityMap = {
  '<': '',
  '>': '',
	"'": '',
  '"': '',
};

function escapeHtml (string) {
  return String(string).replace(/[<>"']/g, function (s) {
    return entityMap[s];
  });
}

/********************************/
/*		Future development		*/
/********************************/
/*
app.post('/editpassword',isLoggedIn, function(req, res) {
	user_model.findOne({ 'local.email' :  req.user.local.email }, function(err, user) {
		console.log("findOne... ");
			// if there are any errors, return the error
			if (err) {
				console.log("Profile update error: " + err);
				res.send("Something went wrong. Try again later.");
				return;
			}

			// check to see if theres already a user with that email
			if (user) {

				if (req.body.newpassword !== req.body.confirmpassword) {
					console.log("Passwords do not match");
					res.send("Passwords do not match");
					return;
				}
				user.setPassword(req.body.newpassword, function(err) {
					if (err) {
						console.log(err);
						res.send("Something went wrong. Try again later.");
					} else {
						console.log("User " +  req.user.local.email + " profile updated");
						res.send("Password change successful!");
					}
				});
			} else {
				console.log("User " +  req.user.local.email + " not found");
				res.send("User " +  req.user.local.email + " not found");
			}
		});
});*/