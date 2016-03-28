/**
 * Created by pavel on 2/12/2016.
 */

const express = require("express");
const app = express();
const body = require("body-parser");
const router = require("./rout");
const  session = require('express-session');
const   db = require("./db.js");

var user = [];
var hasLogin = false;

app.use("/stat",express.static(__dirname+'/stat'));
app.use(body.urlencoded({extended:true}));
app.set("view engine","jade");
app.use(session({ secret: 'keyboard cat'}));
app.use('/user', router);

function requireLogin(req,res,next){
    if(req.session.hasLogined){
        next();
    }else{
        res.redirect("/user/signin");
    }

}

app.get("/",requireLogin,function(req,res){
    db.Count(function(err,result){
        if(err){
            console.error(err)
            return;
        }
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",result)
        res.render("home", { user: req.session.user ,count:result});
    });

});

app.listen(3000);