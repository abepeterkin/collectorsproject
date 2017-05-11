/********************************/
/*			MongoDB				*/
/********************************/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://abepeterkin:0[2*13F!npw~@ds155490.mlab.com:55490/db1';
var datab = [];

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

/********************************/
/*			Indexing			*/
/********************************/
var objectIndexing = function(db) {
  db.collection('object').createIndex({
    "userId": "text",
    "museumId" : "text",
    "name": "text",
    "Provenance": "text",
    "Persons.name" : "text",
    "Locations.name" : "text",
  }, { weights: {
    "name" : 200,
    "Provenance" : 20,
    "Person.name" : 2,
    "Locations.name" : 2
  }, name: "Object Index"
  }, function(err, indexname) {
    assert.equal(null, err);
    console.log(indexname);
  });
}

var personIndexing = function(db) {
  db.collection('person').createIndex({
    "name" : "text",
    "Object.name" : "text",
    "Locations.name" : "text",
  }, { weights: {
    "name" : 25,
  }, name: "Person Index"
  }, function(err, indexname) {
    assert.equal(null, err);
    console.log(indexname);
  });
}

var locationIndexing = function(db) {
  db.collection('location').createIndex({
    "name" : "text",
    "Persons.name" : "text",
    "Locations.name" : "text",
  }, { weights: {
    "name" : 25,
  }, name: "Location Index"
  }, function(err, indexname) {
    assert.equal(null, err);
    console.log(indexname);
  });
}

/********************************/
/*		Insert Excel objects	*/
/********************************/
function insertMany(objects) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected to DB");
		db.collection('object').insertMany(objects, function(err, records) {
			assert.equal(err, null);
			console.log("Inserted " + records.insertedCount + " into the object collection.");
		});
		db.close();
	});
}

/********************************/
/*		Create new person		*/
/********************************/
var createPerson = function(person, object, callback) {
  var createdPerson = createPersonHelper(person, object);
  MongoClient.connect(url, function(err, db) {
    db.collection('person').insertOne(createdPerson,
     function(err, result) {
      assert.equal(err, null);
      console.log("Added " + createdPerson.name + " to the person collection.");
      } );
    db.close();
  });
  callback(createdPerson);
}

var createPersonHelper = function(person, object) {
  var createdPerson = {
    "name" : person,
    "Objects": [],
    "Locations" : []
  }
  createdPerson.Objects.push(object);
  return createdPerson;
}

/********************************/
/*		Create new location		*/
/********************************/
var createLocation = function(location, object, callback) {
  var createdLocation = createLocationHelper(location, object);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('location').insert( createdLocation,
     function(err, result) {
      assert.equal(err, null);
      console.log(createdLocation._id);
      console.log("Inserted " + location.name + " into the location collection.");
     });
    db.close();
  });
  callback(createdLocation);
}

var createLocationHelper = function(location, object) {
  var createdLocation = {
    "name" : location.name,
    "Objects": [object],
    "Persons" : []
  }
  return createdLocation;
}

/********************************/
/*			Add to Objects 		*/
/********************************/
var addPersonToObject = function(object, person, callback) {
  MongoClient.connect(url, function(err, db) {
    db.collection('object').findOneAndUpdate(
	{ _id : object },
	{ $addToSet: { Persons: person } },
	{ "new": true },
	function(err, doc) {
		console.log("Added person " + person + " to object " + object);
		callback(doc);
    });
    db.close();
  });
}

var addLocationToObject = function(artifactId, location) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('object').findAndModify(
      { _id: artifactId },
     { $addToSet: { Locations: location} },
     function(err, object) {
      assert.equal(err, null);
      console.log("Updated " + artifactId + " with new location id");
    });
    db.close();
  });
}

/********************************/
/*		Search Functions 		*/
/********************************/
var searchOnObject = function(query, after, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('object').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}}).toArray(function(err, documents) {
        assert.equal(err, null);
        var toReturn = [];
        for(var i = after; i < after + 21 && i < documents.length; i++) {
          toReturn.push(documents[i]);
        }
        callback(toReturn);
      });
    db.close();
  });
}

var searchOnPerson = function(query, after, callback) {
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('person').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}}).toArray(function(err, documents) {
		  assert.equal(err, null);
		  var toReturn = [];
        for(var i = after; i < after + 21 && i < documents.length; i++) {
          toReturn.push(documents[i]);
        }
        callback(toReturn);
      });
    db.close();
  });
}

var searchOnLocation = function(query, after, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('location').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}});
    var toReturn = [];
      for(var i = after; i < after + 21 && i < results.length; i++) {
        toReturn.push(results[i]);
      }
      callback(toReturn);
    db.close();
  });
}

var searchObjectOfPerson = function(object, callback) {
	MongoClient.connect(url, function(err, db) {
    console.log("Looking for object: " + object);
    assert.equal(null, err);
    var results = db.collection('object').find(
		{ _id : ObjectId(object) },
		{ score : { $meta : "textScore" } }).sort(
		{ score : { $meta : "textScore" } }).toArray(
			function(err, doc) {
				assert.equal(err, null);
				callback(doc);
			});
			db.close();
		}
	);
}

var searchObjectOfLocation = function(object, callback) {
  MongoClient.connect(url, function(err, db) {
    console.log("Looking for object: " + object);
    assert.equal(null, err);
    var results = db.collection('object').find(
    { _id : ObjectId(object) },
    { score : { $meta : "textScore" } }).sort(
    { score : { $meta : "textScore" } }).toArray(
      function(err, doc) {
        assert.equal(err, null);
        callback(doc);
      });
      db.close();
    }
  );
}

function searchForUserObjects(userId, query, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('object').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}}).toArray(function(err, documents) {
        assert.equal(err, null);
        var toReturn = [];
        for(var i = 0; i < documents.length; i++) {
          var str = String(documents[i].userId);
          if(str === userId) {
            toReturn.push(documents[i]);
          }
        }
        callback(toReturn);
      });
    db.close();
  });
}

/********************************/
/*		Update Functions 		*/
/********************************/
function updatePersonsInObjects(value, callback) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('object').update(
			{ $text: { $search : value } },
			{ $addToSet: { "Persons" : value } },
			{ new: true, multi: true },
			function(err) {
		  assert.equal(err, null);
      db.collection('object').find({$text : {$search : value}})
        .toArray(function(err, documents) {
          assert.equal(err, null);
          callback(documents);
        });
			});
  	});
}

function updateLocationsInObjects(value, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('object').update(
      { $text: { $search : value } },
      { $addToSet: { "Locations" : value } },
      { new: true, multi: true },
      function(err) {
      assert.equal(err, null);
      db.collection('object').find({$text : {$search : value}})
        .toArray(function(err, documents) {
          assert.equal(err, null);
          callback(documents);
        });
      });
    });
}

/********************************/
/*		Remove Functions 		*/
/********************************/
function removeObject(obid) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('object').deleteOne({ _id: new require('mongodb').ObjectID(obid) }, function(err) {
      assert.equal(err, null);
      console.log("Removed Object with Id " + obid);
    });
    db.close();
    console.log("Closed the db after removing");
  });
}

/********************************/
/*	Module export functions 	*/
/********************************/
module.exports.insertMany = insertMany;
module.exports.createPerson = createPerson;
module.exports.createLocation = createLocation;
module.exports.addPersonToObject = addPersonToObject;
module.exports.addLocationToObject = addLocationToObject;
module.exports.searchForUserObjects = searchForUserObjects;
module.exports.searchOnObject = searchOnObject;
module.exports.searchOnPerson = searchOnPerson;
module.exports.searchOnLocation = searchOnLocation;
module.exports.searchObjectOfPerson = searchObjectOfPerson;
module.exports.searchObjectOfLocation = searchObjectOfLocation;
module.exports.updatePersonsInObjects = updatePersonsInObjects;
module.exports.updateLocationsInObjects = updateLocationsInObjects;
module.exports.removeObject = removeObject;




/********************************/
/*		Future development		*/
/********************************/
/*
var findObjects = function(db, callback) {
   var cursor = db.collection('object').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

var addObjectToLocation = function(location, object) {
  MongoClient.connect(url, function(err, db) {
    db.collection('location').findAndModify(
      { _id: location._id },
     { $addToSet: { Objects: object } },
     function(err, result) {
      assert.equal(err, null);
      console.log("Updated " + location._id + " with new object");
    });
    db.close();
  });
}

var addPersonToLocation = function(location, person) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);
    db.collection('location').findAndModify(
      { _id: location._id },
     { $addToSet: { Persons: person } },
     function(err, result) {
      assert.equal(err, null);
      console.log("Updated " + location._id + " with new person");
    });
    db.close();
  });
}

var addObjectToPerson = function(person, object) {
	console.log(person);
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('person').update(
		{
//			_id: person._id
		}, {
			$addToSet: {
				Objects: object
				}
		}, function(err, result) {
			assert.equal(err, null);
//			console.log("Updated " + person._id + " with new object id " + object);
			});
	db.close();
  });
}

var addLocationToPerson = function(person, location) {
	MongoClient.connect(url, function(err, db) {
		db.collection('person').findAndModify(
		{ _id: person._id },
		{ $addToSet: { Locations: location }, },
		function(err, result) {
			assert.equal(err, null);
			console.log("Updated " + person._id + " with new location id " + locationId);
		});
	db.close();
	});
}

function getUsersObjects(userId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('object').find({"userId" : userId}).sort(
      'uploadDate', 1).toArray(function(err, documents) {
        assert.equal(err, null);
        callback(documents);
      });
    db.close();
  });
}

function findObjectWithID(id, callback) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('object').findOne({ _id : new require('mongodb').ObjectID(id) }, function(err, doc) {
		  assert.equal(err, null);
			callback(doc);
		});
    db.close();
  });
}

module.exports.addLocationToPerson = addLocationToPerson;
module.exports.addObjectToLocation = addObjectToLocation;
module.exports.addObjectToPerson = addObjectToPerson;
module.exports.addPersonToLocation = addPersonToLocation;
module.exports.findObjects = findObjects;
module.exports.getUsersObjects = getUsersObjects;
module.exports.findObjectWithID = findObjectWithID;*/