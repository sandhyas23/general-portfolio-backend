// Login route using google passport
const express = require("express");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const cookieSession = require('cookie-session');

require('dotenv').config();


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

router.use(express.json());

const userDb = require('../models/userModel')


// cookieSession config
router.use(cookieSession({
    maxAge:  5*60 * 1000, // One day in milliseconds
    keys: ['sandhyaaaaaaaa'],
}));

router.use(passport.initialize()); // Used to initialize passport
router.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new GoogleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
    },
    (accessToken, refreshToken, profile, done) => {
        //done(null, profile); // passes the profile data to serializeUser
       // userDb.findOne({googleId:profile.id})
        userDb.find({googleId:profile.id}).then(function (doc) {
            console.log("doc",doc);
            if(doc.length > 0){
               // console.log("User found in the database");
                done(null, doc);
            }
            else{
                userDb.create({displayName:profile.displayName, image:profile.photos[0].value,
                    googleId : profile.id, isAdmin:false}
                    , (err,newUser) => {
                   // console.log("user added");
                        done(null, newUser);
                });


            }
        });

    }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware to check if the user is authenticated
function  isUserAuthenticated(req, res, next) {
    //console.log("hhhhhhh",req.user);
    //console.log("lll",req.session.passport.user);
    if (req.user) {
        next();
    } else {
        res.json({message:'You must login!',success:false});
    }
}

// Routes
router.get('/', (req, res) => {
    res.send('index');
});
// Add headers

// passport.authenticate middleware is used here to authenticate the request
router.get('/auth/google' , passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
}));

// The middleware receives the data from Google and runs the function on Strategy config
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {

    res.cookie("user", req.session.passport.user);
    //res.redirect(`http://${process.env.SITE_NAME}/`)

    res.redirect(`http://${process.env.SITE_NAME}/`);

});

// Secret route
router.get('/secret', isUserAuthenticated, (req, res) => {
    //console.log("response------------>",req);
    console.log("pppppppp",config.googleAuth.callbackURL);
    res.json({User:JSON.stringify(req.session.passport.user),success:true});
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`http://${process.env.SITE_NAME}/`);
});


module.exports = router;