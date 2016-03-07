"use strict";

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/lesson';
const ObjectID = require('mongodb').ObjectID;
const _ = require("lodash");
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

		module.exports = {
	insertUser: insertUser,
	findUser: findUser,
	updateDocument:updateDocument,
	changepassword:changepassword,
	updateUser:updateUser
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
		findUser(obj,function(err,result){
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
function findUser(user, callback) {
	connect(function (err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
				db.collection("Users").find({email:user.email}).limit(1).toArray(function (err, docs) {
					console.log(docs)
					db.close();
					if (err) {
						console.error(err);
						callback(err);
					} else if (docs.length > 0) {
						console.log(docs[0],":",user.password)
						bcrypt.compare(user.password, docs[0].password, function (err, res) {
							console.log(res);
							if(res)
							callback(null, docs[0]);
							else
								callback(null, null);
						})
					}
					else {
						callback(null, null);
					}
				});
		});
}
function updateUser(id, fields, user, callback) {

	const updateObject = {};
	connect(function (err, db) {
				if (err) {
					console.error(err);
					callback(err);
					return;
				}
				_.each(fields, function (field) {
					updateObject[field] = user[field];
				});
				db.collection("Users").updateOne({_id: new ObjectID(id)}, {$set: updateObject}, function (err, docs) {
					db.close();
					if (err) {
						console.error(err);
						callback(err);
						return;
					}
					callback(null, docs);
				});
		})
}

 function updateDocument (user, callback) {
	 connect(function (err, db) {
			 if (err) {
				 console.error(err);
				 callback(err);
				 return;
			 }
		 var obj = {email:user.email};
		 findUser(user,function(err,result){
				 if(err){
					 console.error(err);
					 callback(err);
				 }
				 else if( result != null){
						callback(null,null);
				 }
				 else if (result == null){
					 var oldmail = {email:user.oldemail};
					 db.collection("Users").updateOne(oldmail,{$set:{email:user.email}}, function (err, docs) {
						 db.close();
						 if (err) {
									 console.error(err);
									 callback(err);
									 return;
								 }
								 callback(null, docs);
							 });
				 }
			 });
	 });
};
function changepassword (user, callback) {
	connect(function(err,db){
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
		var obj = {
			email:user.email,
			password:user.oldpass
		};
		findUser(obj,function(err,result){
			if(err){
				console.error(err);
				callback(err);
				return;
			}
			else if(result != null) {
					db.collection("Users").updateOne(result, {$set: {password: user.newpass}}, function (err, docs) {
						db.close();
						if (err) {
							console.error(err);
							callback(err);
							return;
						}
						callback(null, docs);
					});
				}else callback(null,null);
		});
	})
};
function connect(callback) {
	MongoClient.connect(url, function (err, db) {
		console.log("Connected correctly to server: ",url);
		callback(err, db);
	});
}