var express = require('express');
var router  = express.Router({mergeParams: true});
var Bike = require('../models/bikes');
var Comment = require('../models/comments');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req, res){
    Bike.findById(req.params.id, function(err, foundBike){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {bike: foundBike});
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentAuthorId, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render('comments/edit', {bike_id: req.params.id, comment: foundComment}); // Don't need to pass the whole bike object, just the ID suffices
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
   Comment.create(req.body.comment, function(err, newComment){
       if(err){
           console.log(err);
       }else{
           newComment.author.id = req.user._id;
           newComment.author.username = req.user.username;
           newComment.createdDate = Date.now();
           newComment.save();
           Bike.findById(req.params.id, function(err, foundBike){
               if(err){
                   console.log(err);
               }else{
                   foundBike.comments.push(newComment);
                   foundBike.save();
                   res.redirect('/bikes/' + req.params.id);
               }
           });
       }
   });
});

router.put('/:comment_id', middleware.checkCommentAuthorId, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect('/bikes/' + req.params.id + '/comments/' + req.params.comment_id + '/edit');
        }else{
            res.redirect('/bikes/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentAuthorId, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/bikes/' + req.params.id);
        }
    });
});

module.exports = router;