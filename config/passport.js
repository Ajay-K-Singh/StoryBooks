const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');

//Load model
const User = mongoose.model('users');
const keys = require('./keys');


module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientId,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);
        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
        const newUser = {
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.givenName,
            lastName: profile.lastName,
            image: image
        }

        //Check for existing user
        User.findOne({
                googleId: profile.id
            })
            .then(user => {
                if (user) {
                    done(null, user);
                } else {
                    //Create user
                    new User(newUser)
                        .save()
                        .then(user => done(null, user));
                }
            })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });

}