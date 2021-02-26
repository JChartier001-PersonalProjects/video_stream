const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require("../database/Schema").User,
const shortid = require('shortid');

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});


//handle user registration
passport.use('localRegister', new localStrategy({
    usernameField: 'email',
    passwordField: "password",
    passReqToCallback: true
},
(req, email, password, done) => {
    User.findOne({$or: [{email: email}, {username: req.body.username}]}, (err, user) => {
        if(err)
        return done(err);
        if(user){
            if(user.email === email){
                req.flash('email', "email is already taken");
            }
            if(user.username === req.body.username){
                req.flash('username', "Username is already taken")
            }
            return done(null, user)
        } else {
            let user = new User();
            user.email = email;
            user.password = user.generateHash(password);
            user.username = req.body.username;
            user.stream_key = shortid.generate();
            user.save((err) => {
                if(err)
                throw err;
                return done(null, user)
            })
        }
    })
}));

passport.use('localLogin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password';
    passReqToCallback: true
}, 
(req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if(err)
        return done(err);
        if(!user)
        return done(null, false, req.flash('email', "email doesn't exist"));
        if(!user.validPassword(password))
        return done(null, false, req.flash('password', "wrong password"));
        return done(null, user)
    })
}))

module.exports = passport;