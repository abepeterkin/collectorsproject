var objectDB = require("./objectdatabase.js");
var XLSX = require('xlsx');

module.exports = function(app, passport) {

/************************/
/*	Home page with menu	*/
/************************/
app.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		console.log(req.user);
		res.render('home.ejs', {
			user: req.user
		});
		console.log("User " + req.user + " logged in");
	} else {
		res.render('home.ejs', {
			user: ""
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
		user: req.user // get the user out of session and pass to template
	});
});

/************************/
/*		Search process	*/
/************************/
/*app.post('/uploadfile', function(req, res) {
	var spreadsheet = req.files.spreadsheet;
	console.log('- Received file submission: ' + spreadsheet.name);
	workbook = XLSX.read(spreadsheet.data);
	xlsx = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
	res.send(objectDB.insertArtifact(xlsx));
});*/

app.get('/upload', isLoggedIn, function(req, res) {
	res.render('upload.ejs', {
		user: req.user
	});
});

app.post('/upload', isLoggedIn, function(req, res) {
//	console.log(req.body);
	console.log(req.files);
//	console.log(req.body.provenancecolumn);
//	console.log(req.body.namecolumn);
//	console.log(req.body.ignoreheader);
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
	if (query !== "") {
		objectDB.searchOnObject(query, function(result) {
			var resultJSON = JSON.stringify(result);
			res.send(resultJSON);
			console.log(resultJSON);
		});
	}
});

app.post('/search/:query/:userid', function(req, res) {
	var query = req.params.query;
	var userid = req.params.userid
	console.log("QUERY: [" + [query] + "]");
	console.log("QUERY: [" + [userid] + "]");
	if (query !== "") {
		objectDB.searchForUserObjects(userid, query, function(result) {
			var resultJSON = JSON.stringify(result);
			res.send(resultJSON);
			console.log(resultJSON);
		});
	}
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
      name : name,
      Provenance : provenance,
      Persons : [],
      Locations : []
    }
    objectArray.push(object);
  }
  objectDB.insertMany(objectArray);
}
}
