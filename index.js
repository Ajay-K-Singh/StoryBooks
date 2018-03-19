const express = require('express');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Initialization of app with express
const app = express();

//setting engine for handlebars middleware
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Load keys
const keys = require('./config/keys');

//Load user model
require('./models/Users.js');


//Passport config
require('./config/passport')(passport);


//Map global promises 
mongoose.promise = global.Promise;

mongoose.connect(keys.mongoURI)
    .then(() => { console.log('DB connected') })
    .catch(err => console.log(err));

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//express session and cookieparser middleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


//Passprt middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


//use routes
app.use('/', index);
app.use('/auth', auth);

//Setting environment variables
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});