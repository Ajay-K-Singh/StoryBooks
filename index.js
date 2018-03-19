const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
//Initialization of app with express
const app = express();

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
    res.send('It works.');
})


//use routes
app.use('/auth', auth);


//Setting environment variables
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});