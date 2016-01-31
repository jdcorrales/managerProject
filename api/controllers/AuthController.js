/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var passport        = require('passport'),
    bcrypt          = require('bcrypt'),
    flashService    = require('../services/FlashService.js'),
    authService     = require('../services/AuthService.js'),
    sessionService  = require('../services/SessionService.js');

var AuthController = {

    index: function (req, res) {
        res.view();
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },

    create : function (req ,res)
    {       
        var userData = {
            name : req.param('name'),
            last_name : req.param('last_name'),
            username : req.param('username'),
            email : req.param('email'),
            provider : 'local',
            password : req.param('password'),
            passwordconfirmation : req.param('passwordconfirmation')
        };
        User.create(userData, function (err, user) {
                authService.passportAuthenticate(req, res, err, user, 'con el servidor');
        });
    },

    'local': function (req, res) {
        passport.authenticate('local', { 
            failureRedirect: '/login'             
        },
        function (err, user) {
            authService.passportAuthenticate(req, res, err, user, 'con el servidor');            
        })(req, res);
    },
    
    'dropbox': function (req, res) {
        passport.authenticate('dropbox', { 
            failureRedirect: '/login' 
        },
        function (err, user) {
            authService.passportAuthenticate(req, res, err, user, 'DropBox');
        })(req, res);
    },

    'dropbox/callback': function (req, res) {
        passport.authenticate('dropbox', function (req, res) {
            res.redirect('/');
        })(req, res);
    },

    'github': function (req, res) {
        passport.authenticate('github', { 
            failureRedirect: '/login' 
        },
        function (err, user) {
            authService.passportAuthenticate(req, res, err, user, 'Github');
        })(req, res);
    },

    'github/callback': function (req, res) {
        passport.authenticate('github', function (req, res) {
            res.redirect('/');
        })(req, res);
    },

    'google': function (req, res) {
        passport.authenticate('google', { 
            failureRedirect: '/login', 
            scope:[
                'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ]
        },
        function (err, user) { 
            authService.passportAuthenticate(req, res, err, user, 'Google');
        })(req, res);
    },

    'google/callback': function (req, res) {        
        passport.authenticate('google', function (req, res) {
            res.redirect('/');
        })(req, res);
    },

    'facebook': function (req, res) {
        passport.authenticate('facebook', { 
            failureRedirect: '/login', 
            scope : [                
                'public_profile',
                'email',
            ]      
        },
        function (err, user) {
            authService.passportAuthenticate(req, res, err, user, 'Facebook');
        })(req, res);
    },

    'facebook/callback': function (req, res) {        
        passport.authenticate('facebook', function (req, res) {
            res.redirect('/');
        })(req, res);
    }
};

module.exports = AuthController;