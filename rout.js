const express = require("express");
const router = express.Router();
const _ = require("lodash");
const users = [];

router.get("/",function(req,res,next){
    if(!req){

    }
    next();
});
router.get("/signin",function(req,res){
    res.render("login",{error:req.query.error});
});
router.get("/signup",function(req,res){
    res.render("reg");
});
router.post("/signin",function(req,res){

    if(_.find(users, {email:req.body.email,password:req.body.password })) {
        req.session.hasLogined = true;
        res.redirect('/');
    }
    else {
        res.redirect('/user/signin?error=yes');
    }
});
router.post("/signup",function(req,res){

    users.push({email:req.body.email,password:req.body.password});
    res.redirect("/user/signin");

});
router.post("/signout",function(req,res){

    req.session.hasLogined = false;
    res.redirect("/");

});


module.exports = router;




router