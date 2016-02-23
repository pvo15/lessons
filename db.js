"use strict";

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/lesson';

module.exports = {
	insertUser: insertUser,
	findUser: findUser
};

/**
 * @param user User object to insert
 * @param callback Callback function
 */
function insertUser(user, callback) {
	connect(function (err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
			var obj = {email:user.email};
		findFunction(obj,function(err,result){
			if (err) {
				console.error(err);
				callback(err);
				return;
			} else if(result == null) {
					db.collection('Users').insertOne(user, function (err, result) {
						db.close();
						if (err) {
							callback(err);
						} else {
							callback(null,result);
						}
					});
			}else {
				callback(null,null);
			}

		});

	});
}

/**
 * @param user User query object
 * @param callback Callback function
 */
var findFunction = findUser;
function findUser(user, callback) {
	connect(function (err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
		db.collection("Users").find(user).limit(1).toArray(function (err, docs) {
			db.close();
			if (err) {
				console.error(err);
				callback(err);
			} else {
				callback(null, docs.length > 0 ? docs[0] : null);
			}
		});
	});
}


var updateDocument = function (db, callback) {
	var collection = db.collection('documents');
	collection.updateOne({a: 2}
		, {$set: {b: 1}}, function (err, result) {
			if (err) {
				console.error(err);
				callback(err);
				return;
			}
			console.log("Updated the document with the field a equal to 2");
			callback(null, result);
		});
};

function connect(callback) {
	MongoClient.connect(url, function (err, db) {
		console.log("Connected correctly to server");
		callback(err, db);
	});
}