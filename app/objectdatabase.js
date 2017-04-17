// =========================================================
// MONGODB

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://abepeterkin:0[2*13F!npw~@ds155490.mlab.com:55490/db1';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

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

var addObjectFromCSV = function(db, artifact, callback) {
  db.collection('object').insertOne( {
    "userId": artifact.userId,
    "museumId" : artifact.museumId,
    "name" : artifact.name,
    "Provenace" : artifact.provenance,
    "Persons" : [],
      "Locations" : []
  }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted " + artifact.name + " into the object collection.");
    callback();
  });
};

var addLocationToObject = function(db, artifact, locationId, callback) {
  db.collection('object').update(
    { _id: artifact._id },
   { $push: { Locations: {locationId: locationId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + artifact._id + " with new location id " + locationId);
    callback();
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
var createPerson = function(db, person, callback) {
  var createdPerson = createPersonHelper(person);
  db.collection('person').insert( createdPerson,
   function(err, result) {
    assert.equal(err, null);
    console.log(createdPerson._id);
    console.log("Inserted " + person.name + " into the person collection.");
    callback(createdPesron._id); //callback returns the id for object and location
  } );
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
var createLocation = function(db, location, callback) {
  var createdLocation = createLocationHelper(location);
  db.collection('location').insert( createdLocation,
   function(err, result) {
    assert.equal(err, null);
    console.log(createdLocation._id);
    console.log("Inserted " + location.name + " into the location collection.");
    callback(createdLocation._id); //callback returns the id for object and location
  } );
}

var addObjectToLocation = function(db, location, objectId, callback) {
  db.collection('location').update(
    { _id: location._id },
   { $push: { Objects: {objectId: objectId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + location._id + " with new object id " + objectId);
    callback();
  });
}

var addPersonToLocation = function(db, location, personId, callback) {
  db.collection('location').update(
    { _id: location._id },
   { $push: { Persons: {personId: personId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + location._id + " with new person id " + personId);
    callback();
  });
}

var addPersonToObject = function(db, object, personId, callback) {
  db.collection('object').update(
    { _id: object._id },
   { $push: { Persons: {personId: personId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + object._id + " with new person id " + personId);
    callback();
  });
}

var searchOnObject = function(db, query) {
  var results = db.collection('object').find({$text : {$search : query}}, {
    score : {$meta : "textScore"}}).sort(
    {score: {$meta : "textScore"}});
    return results;
}

var searchOnPerson = function(db, query) {
  var results = db.collection('person').find({$text : {$search : query}}, {
    score : {$meta : "textScore"}}).sort(
    {score: {$meta : "textScore"}});
    return results;
}

var searchOnLocation = function(db, query) {
  var results = db.collection('location').find({$text : {$search : query}}, {
    score : {$meta : "textScore"}}).sort(
    {score: {$meta : "textScore"}});
    return results;
}

var addObjectToPerson = function(db, person, objectId, callback) {
  db.collection('person').update(
    { _id: person._id },
   { $push: { Objects: {objectId: objectId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + person._id + " with new object id " + objectId);
    callback();
  });
}

var addLocationToPerson = function(db, person, locationId, callback) {
  db.collection('person').update(
    { _id: person._id },
   { $push: { Locations: {locationId: locationId} } },
   function(err, result) {
    assert.equal(err, null);
    console.log("Updated " + person._id + " with new location id " + locationId);
    callback();
  });
}

module.exports.insertDocument = insertDocument;
module.exports.addObjectFromCSV = addObjectFromCSV;
module.exports.addLocationToObject = addLocationToObject;
module.exports.createPerson = createPerson;
module.exports.findObjects = findObjects;
module.exports.createLocation = createLocation;
module.exports.addObjectToLocation = addObjectToLocation;
module.exports.addPersonToLocation = addPersonToLocation;
module.exports.addPersonToObject = addPersonToObject;
module.exports.addObjectToPerson = addObjectToPerson;
module.exports.addLocationToPerson = addLocationToPerson;
