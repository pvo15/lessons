const express = require("express");
const router = express.Router();
const _ = require("lodash");
const  db = require('./db');
const multer = require("multer");

var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './stat/uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage : storage }).single('userPhoto');

function requireLogin(req,res,next){
    if(req.session.hasLogined){
        next();
    }else{
        res.redirect("/user/signin");
    }

}
router.get("/",requireLogin,function(req,res,next){
    if(!req){

    }
    next();
});
router.get("/signin",function(req,res){
    res.render("login",{error:req.query.error});
});
router.get("/repass",requireLogin,function(req,res){
    res.render("repass",{error:req.query.error});
});
router.get("/signup",function(req,res){
    res.render("reg",{used:req.query.used});
});
router.get("/rname",requireLogin,function(req,res){
    res.render("rname",{used:req.query.used});
});
router.post("/signin",function(req,res){

    var user = {
        email:req.body.email,
        password:req.body.password
    };
    var hash = bcrypt.hashSync(req.body.password, salt);

    db.findUser(user,function(err,user){
        if(err){
            return res.status(500).send("server error");
        }else if(user != null){
            console.log(hash )
            bcrypt.compare( req.body.password, user.password ,function (err, result) {
                if(result) {
                    req.session.hasLogined = true;
                    req.session.user = user;
                    res.redirect('/');
                }
                else
                    res.redirect("/user/signin?error=true");
            })

        }
        else{
            res.redirect("/user/signin?error=true");
        }
    });
});
router.post("/signup",function(req,res){
    var hash = bcrypt.hashSync(req.body.password, salt);

        var user = {
            email:req.body.email,
            password: hash
        };
    db.insertUser(user,function(err,result){
        if(err) {
            return res.status(500).send("insert user error");
        }else if(result != null) {
            res.redirect("/user/signin?used=false");
        } else{

            res.redirect("/user/signup?used=true");
        }
    });
});
router.post("/signout",function(req,res){

    req.session.hasLogined = false;
    req.session.user = null;
    res.redirect("/");

});
router.post("/rname",function(req,res){
    var user = {
        email:req.body.email,
        oldemail:req.session.user.email
    };
   db.updateUser(req.session.user.id, ['email'], user,function(err,result){
       if(err) {
           return res.status(500).send("insert user error");
       }else if(result != null) {
           req.session.user.email = user.email;
           res.redirect("/");
       } else{
           res.redirect("/user/rname?used=true");
       }
   })
});
router.post("/repass",function(req,res) {
    var hash = bcrypt.hashSync(req.body.password, salt);
    
    db.updateUser(req.session.user.id,["password"],{password:hash}, function (err, result) {
                if (err) {
                    return res.status(500).send("insert user error");
                } else if (result != null) {
                    res.redirect("/");
                } else if (result == null) {
                    res.redirect("/user/repass?error=not");
                }
                else  {
                    res.redirect("/user/repass");
                }
            })
});
router.post("/photo", upload, function(req, res){
    req.session.user.image = req.file.filename;
    db.updateUser(req.session.user._id,["image"],req.session.user,function(err,result){
            if (err) {
                return res.status(500).send("insert photo error");
            } else if (result != null) {
                res.redirect("/");
            }
        });
});



module.exports = router;




