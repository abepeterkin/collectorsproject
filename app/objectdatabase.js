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

module.exports.insertDocument = insertDocument;
module.exports.addObjectFromCSV = addObjectFromCSV;
module.exports.addLocationToObject = addLocationToObject;
module.exports.createPersonHelper = createPersonHelper;
module.exports.createPerson = createPerson;
module.exports.findObjects = findObjects;
