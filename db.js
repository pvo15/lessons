"use strict";


const pg = require("pg");
const conString = "postgres://postgres:12345@127.0.0.1:5432/test";
const client = new pg.Client(conString);

const _ = require("lodash");
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
	insertUser: insertUser,
	findUser: findUser,
	updateDocument: updateDocument,
	changepassword: changepassword,
	updateUser: updateUser,
	Count:Count
};

/**
 * @param user User object to insert
 * @param callback Callback function
 */
function insertUser(user, callback) {
	connect(function (err, db, done) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}

		db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [user.email, user.password], function (err, result) {
			done();

			if (err) {
				if (err.code == 23505) {
					callback(null, null);
					return;
				}

				console.error(err);
				callback(err);
				return;
			}

			console.log(err);
			console.log(result);

			if (err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
}

/**
 * @param user User query object
 * @param callback Callback function
 */
function findUser(user, callback) {
	connect(function (err, db, done) {
		if (err) {
			console.error(err);
			callback(err);
			done();
			return;
		}


		db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [user.email], function (err, docs) {
			done();
			if (err) {
				console.error(err);
				callback(err);
				return;
			}

			console.log("sdd",docs.rows[0]);

			if (docs.rows.length > 0) {
				callback(null, docs.rows[0]);
				return;
			}

			callback(null, null);
		});
	});
}

function updateUser(id, fields, user, callback) {
	connect(function (err, db,done) {
		if (err) {
			console.error(err);
			callback(err);
			done();
			return;
		}
		
		let query = [];
		let params = [];
		let index = 1;

		_.each(fields, function (field) {
			query.push(field + ' = ' + ' $' + index++);
			params.push(user[field]);
		});
		
		params.push(id);

		console.log(query);
		console.log(params);

		db.query("UPDATE users SET " + query.join(',') + ' WHERE id = $' + index, params, function (err, result) {
			done();

			if (err) {
				console.error(err);
				callback(err);
				return;
			}
			
			console.log(result);
			
			callback(null, result);
		});
	})
}

function updateDocument(user, callback) {
	connect(function (err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
		var obj = {email: user.email};
		findUser(user, function (err, result) {
			if (err) {
				console.error(err);
				callback(err);
			}
			else if (result != null) {
				callback(null, null);
			}
			else if (result == null) {
				var oldmail = {email: user.oldemail};
				db.collection("Users").updateOne(oldmail, {$set: {email: user.email}}, function (err, docs) {
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
}

function changepassword(user, callback) {
	connect(function (err, db) {
		if (err) {
			console.error(err);
			callback(err);
			return;
		}
		var obj = {
			email: user.email,
			password: user.oldpass
		};
		findUser(obj, function (err, result) {
			if (err) {
				console.error(err);
				callback(err);
				return;
			}
			else if (result != null) {
				db.collection("Users").updateOne(result, {$set: {password: user.newpass}}, function (err, docs) {
					db.close();
					if (err) {
						console.error(err);
						callback(err);
						return;
					}
					callback(null, docs);
				});
			} else callback(null, null);
		});
	})
}

function connect(callback) {
	pg.connect(conString, function (err, client, done) {
		console.log("Connected correctly to server: ", conString);
		callback(err, client, done);
	});
}
function  Count(callback){
	connect(function (err, db,done) {
		if (err) {
			console.error(err);
			callback(err);
			done();
			return;
		}
		db.query('select id,email from users;', function (err, doc) {
			done();
			console.log("id", doc);
			callback(null, doc.rows);
		});
	});
}

/*

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

 /!**
 * @param user User object to insert
 * @param callback Callback function
 *!/
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


 /!**
 * @param user User query object
 * @param callback Callback function
 *!/
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
 callback(null, docs[0]);
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
 }*/
