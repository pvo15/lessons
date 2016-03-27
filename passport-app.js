var express         = require('express'),
	app             = express(),
	passport        = require('passport'),
	LocalStrategy   = require('passport-local').Strategy,
	bodyParser      = require('body-parser'),
	session         = require('express-session');

var users = [{"id":111, "username":"123", "password":"123"}];

passport.serializeUser(function (user, done) {
	done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
	done(null, users[0]);
});

passport.use('local', new LocalStrategy(
	function (username, password, done) {
		if (username === users[0].username && password === users[0].password) {
			return done(null, users[0]);
		} else {
			return done(null, false, {"message": "User not found."});
		}
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: "thelast",
	resave: true,
	saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.sendStatus(401);
}

app.get("/", function (req, res) {
	res.redirect("/login");
});

// api endpoints for login, content and logout
app.get("/login", function (req, res) {
	res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});
app.post("/login",
	passport.authenticate("local", { failureRedirect: "/login"}),
	function (req, res) {
		res.redirect("/content");
	});
app.get("/content", isLoggedIn, function (req, res) {
	res.send("loginvar axper jan<br> <a href='/logout'>logutr</a>");
});
app.get("/logout", function (req, res) {
	req.logout();
	res.send("helar axper jan!");
});

app.listen(3030);
console.log("running:3030");