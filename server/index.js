const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const flash    = require('connect-flash');
const session  = require('express-session');
const bodyParser  = require('body-parser');
const methodOverride  = require('method-override');
const cookieParser  = require('cookie-parser');
const mongoose  = require('mongoose');
const path  = require('path');

const configDB = require('./config/database')

mongoose.connect(configDB.url); // connect database

require('./config/passport')(passport); // configure passport

const app = express();
/*
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
// app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/client')); // set the static files location /public/img will be /img for users
*/

// app.use(compression());

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());


app.use(morgan('dev'))
console.log("client path :", path.resolve(__dirname + '/../client'));
app.use(express.static(path.resolve(__dirname + '/../client')))

app.use(session({
    secret: 'loremisthenewipsum', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport); // configure the routes


app.listen(3000, function() {
   console.log("app is listening on localhost:3000");
})
