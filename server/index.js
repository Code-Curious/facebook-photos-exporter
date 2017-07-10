const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

require('./config/passport')(passport); // configure passport

const app = express();

app.use(morgan('dev'))
// app.use(express.staticProvider(__dirname + '../client'))

require('./routes.js')(app, passport); // configure the routes


app.listen(3000, function() {
   console.log("app is listening on localhost:3000");
})
