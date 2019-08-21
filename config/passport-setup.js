const passport = require('passport');
const GoogleStrat = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

passport.use(
    new GoogleStrat({
        // options for the Google strat
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken,refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired');
        
        // need to check DB before creating a new user

        // creating new user in DB
        const user = new User({
            username: profile._json.name,
            googleId: profile._json.sub
          }).save()
          .then(data => {
            console.log('user created success:', data);
          })
          .catch(err => {
            console.log('error creating user:', err);
          });
    })
)