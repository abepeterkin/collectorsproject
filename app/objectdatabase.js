// =========================================================
// MONGODB

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://abepeterkin:0[2*13F!npw~@ds155490.mlab.com:55490/db1';
var datab = [];

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  dropAll(db);
  objectIndexing(db);
  console.log("Indexed objects");
  personIndexing(db);
  console.log("Indexed persons");
  locationIndexing(db);
  console.log("Indexed locations");
  db.close();
});

function insertMany(objects) {
  console.log("Adding to Stuff");
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to DB");
  db.collection('object').insertMany(objects, function(err, records) {
    assert.equal(err, null);
    console.log("Inserted " + records.insertedCount() + " into the object collection.");
  });
  console.log("Closing");
  db.close();
  console.log("Closed");
  });
  console.log("Gets after connect");
}


var dropAll = function(db) {
  db.collection('object').remove({});
  db.collection('person').remove({});
  db.collection('location').remove({});
  console.log("Dropped all");
}


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

var addLocationToObject = function(artifactId, location) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('object').findAndModify(
      { _id: artifactId },
     { $push: { Locations: location} },
     function(err, object) {
      assert.equal(err, null);
      console.log("Updated " + artifactId + " with new location id");
    });
    db.close();
  });
}
//do the same for location
var createPersonHelper = function(person) {
  var createdPerson = {
    "name" : person.name,
    "Objects": [],
    "Locations" : []
  }
  return createdPerson;
}

//have person be
var createPerson = function(person, callback) {
  var createdPerson = createPersonHelper(person);
  MongoClient.connect(url, function(err, db) {
    db.collection('person').insertOne( createdPerson,
     function(err, result) {
      assert.equal(err, null);
      console.log(createdPerson._id);
      console.log("Inserted " + person.name + " into the person collection.");
      } );
    db.close();
  }); 
  callback(createdPerson);
}

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

//do the same for location
var createLocationHelper = function(location) {
  var createdLocation = {
    "name" : location.name,
    "Objects": [],
    "Persons" : []
  }
  return createdLocation;
}

//have person be
var createLocation = function(location, callback) {
  var createdLocation = createLocationHelper(location);
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
  callback(createdLocation); //callback returns the id for object and location
}

var addObjectToLocation = function(location, object) {
  MongoClient.connect(url, function(err, db) {
    db.collection('location').findAndModify(
      { _id: location._id },
     { $push: { Objects: object } },
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
     { $push: { Persons: person } },
     function(err, result) {
      assert.equal(err, null);
      console.log("Updated " + location._id + " with new person");
    });
    db.close();
  });
}

var addPersonToObject = function(object, person) {
  MongoClient.connect(url, function(err, db) {
    db.collection('object').findAndModify(
      { _id: object._id },
     { $push: { Persons: person } },
     function(err) {
      assert.equal(err, null);
      console.log("Updated " + object._id + " with new person");
    });
    db.close();
  });
}

var searchOnObject = function(query, callback) {
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('object').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}});
    callback(results);
    db.close();
  });
}

var searchOnPerson = function(query, callback) {
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('person').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}});
    callback(results);
    db.close();
  });
}

var searchOnLocation = function(query, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var results = db.collection('location').find({$text : {$search : query}}, {
      score : {$meta : "textScore"}}).sort(
      {score: {$meta : "textScore"}});
    callback(results);
    db.close();
  });
}

var addObjectToPerson = function(person, object) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('person').update(
      { _id: person._id },
     { $push: { Objects: object } },
     function(err, result) {
      assert.equal(err, null);
      console.log("Updated " + person._id + " with new object id " + objectId);
    });
   db.close(); 
  });
}

var addLocationToPerson = function(person, location) {
  MongoClient.connect(url, function(err, db) {
    db.collection('person').findAndModify(
      { _id: person._id },
     { $push: { Locations: location } },
     function(err, result) {
      assert.equal(err, null);
      console.log("Updated " + person._id + " with new location id " + locationId);
    });
    db.close();
  });
}

module.exports.insertMany = insertMany;
module.exports.addLocationToObject = addLocationToObject;
module.exports.createPerson = createPerson;
// module.exports.findObjects = findObjects;
module.exports.createLocation = createLocation;
module.exports.addObjectToLocation = addObjectToLocation;
module.exports.addPersonToLocation = addPersonToLocation;
module.exports.addPersonToObject = addPersonToObject;
module.exports.searchOnObject = searchOnObject;
module.exports.searchOnPerson = searchOnPerson;
module.exports.searchOnLocation = searchOnLocation;
module.exports.addObjectToPerson = addObjectToPerson;
module.exports.addLocationToPerson = addLocationToPerson;
