var express = require('express');
var router  = express.Router();
var Bike = require('../models/bikes');
var middleware = require('../middleware');

router.get('/', function(req,res){
    Bike.find({}, function(err, allBikes){
        if(err){
            console.log(err);
        }else{
            res.render('bikes', {bikes: allBikes}); 
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req,res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Bike.create({
        name: req.body.name, 
        image: req.body.image,
        owned_from: req.body.owned_from,
        owned_to: req.body.owned_to,
        author:author
    }, function(err, newBike){
        if(err){
            console.log(err);
        }else{
            res.redirect('/bikes/' + newBike._id);
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req,res){
    res.render('bikes/new');
});

router.get('/:id', function(req,res){
    Bike.findById(req.params.id).populate('comments').exec(function(err, foundBike){ // needed to get the comments as an object rather than ID
       if(err){
           console.log(err);
       }else{
           res.render('bikes/show', {bike: foundBike});
       }
    });
});

router.get('/:id/edit', middleware.checkBikeAuthorId, function(req, res) {
    Bike.findById(req.params.id, function(err, foundBike){
        if(err){
            console.log(err);
        }else{
            res.render('bikes/edit', {bike: foundBike});
        }
    });
});

router.put('/:id', middleware.checkBikeAuthorId, function(req, res){
    Bike.findByIdAndUpdate(req.params.id, req.body.bike, function(err, foundBike){
        if(err){
            console.log(err);
            res.redirect('/bikes/' + req.params.id + '/edit');
        }else{
            req.flash('success', 'Bike updated');
            res.redirect('/bikes/' + req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkBikeAuthorId,  function(req, res){
    Bike.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/bikes');
        }
    });
});

module.exports = router;