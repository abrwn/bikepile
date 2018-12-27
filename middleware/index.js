var Comment = require('../models/comments.js'),
    Bike = require('../models/bikes.js');
    
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to log in first');
    res.redirect('/login');
};

middlewareObj.checkBikeAuthorId = function(req, res, next){
    if (req.isAuthenticated()){
        Bike.findById(req.params.id, function(err, foundBike){
            if(err || !foundBike){
                req.flash('error', 'Bike not found');
                res.redirect('back');
            }else{
                if(foundBike.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }else{
        res.redirect('back');
    }
};

middlewareObj.checkCommentAuthorId = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect('back');
                }
            }
        });
    }else{
        res.redirect('back');
    }
};

module.exports = middlewareObj;