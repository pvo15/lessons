const express = require("express");
const router = express.Router();
const _ = require("lodash");
const  db = require('./db');

router.get("/",function(req,res,next){
    if(!req){

    }
    next();
});
router.get("/signin",function(req,res){
    res.render("login",{error:req.query.error});
});
router.get("/repass",function(req,res){
    res.render("repass",{error:req.query.error});
});
router.get("/signup",function(req,res){
    res.render("reg",{used:req.query.used});
});
router.get("/rname",function(req,res){
    res.render("rname",{used:req.query.used});
});
router.post("/signin",function(req,res){
    var user = {
        email:req.body.email,
        password:req.body.password
    };
    db.findUser(user,function(err,user){
        if(err){
            return res.status(503).send("server error");
        }else if(user != null){
            req.session.hasLogined = true;
            req.session.user = user;
            res.redirect('/');
        }
        else{
            res.redirect("/user/signin?error=true");
        }
    });
});
router.post("/signup",function(req,res){
    var user = {
        email:req.body.email,
        password:req.body.password
    };

    db.insertUser(user,function(err,result){
        if(err) {
            return res.status(503).send("insert user error");
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
   db.updateDocument(user,function(err,result){
       if(err) {
           return res.status(503).send("insert user error");
       }else if(result != null) {
           req.session.hasLogined = true;
           req.session.user = result;
           res.redirect("/");
       } else{
           res.redirect("/user/rname?used=true");
       }
   })
});

router.post("/repass",function(req,res) {
    var user = {
        email: req.session.user.email,
        oldpass:req.body.old,
        newpass: req.body.password,
        repassword: req.body.repassword
    };
    if (user.newpass === user.repassword) {

    db.changepassword(user, function (err, result) {
                if (err) {
                    return res.status(503).send("insert user error");
                } else if (result != null) {
                    req.session.hasLogined = true;
                    req.session.user = result;
                    res.redirect("/");
                } else if (result == null) {
                    res.redirect("/user/repass?error=not");
                }
                else  {
                    res.redirect("/user/repass");
                }

            })
        }
    else {
        res.redirect("/user/repass?error=true");
    }

});



module.exports = router;




