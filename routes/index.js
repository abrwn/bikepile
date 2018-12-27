var express = require('express');
var router  = express.Router();
var User = require('../models/users');
var passport = require('passport');


router.get('/', function(req,res){
   res.render('landing'); 
});


router.get('/register', function(req, res) {
    res.render('register');
});


router.post('/register', function(req, res) {
    var newUser = {username: req.body.username};
    User.register(new User(newUser), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register', {error: err.message});
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('bikes');
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login');
});


router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/bikes',
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res) {
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/bikes');
})

module.exports = router;