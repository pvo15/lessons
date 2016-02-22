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
	connect(function(err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}

		db.collection('Users').insertOne(user, function(err, result) {
			db.close();

			if (err) {
				callback(err);
			} else {
				console.log(result);// TODO: replace with insertedId getting
				callback(null);
			}
		});
	});
}

/**
 * @param user User query object
 * @param callback Callback function
 */
function findUser(user, callback) {
	db.collection.find(user).limit(1).toArray(function(err, docs) {
		db.close();
		if (err) {
			console.error(err);
			callback(err);
			return;
		}else{
		callback(docs);
		}
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