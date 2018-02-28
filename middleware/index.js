const Blog = require("../models/blog"),
        User = require("../models/user"),
        Comment = require("../models/comment");

const middlewareObj = {
    
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

middlewareObj.checkBlogOwnership = function (req, res, next) {
    const id = req.params.id;
    if (req.isAuthenticated()){
        Blog.findById(id, function(err, foundBlog){
            if(err || !foundBlog){
                console.log(err);
                req.flash("error", err);
                res.redirect("/blog");
            } else {
                if (foundBlog.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    const id = req.params.comment_id;
    if (req.isAuthenticated()){
        Comment.findById(id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", err);
                res.redirect("/blog");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkUserOwnership = function (req, res, next) {
    const id = req.params.id;
    if (req.isAuthenticated()){
        User.findById(id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error", err);
                res.redirect("/blog");
            } else {
                if (foundUser.id ==req.user._id || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isAdmin = function (req, res, next) {
    if (req.user && (req.user.isAdmin || req.user.isBoss)) {
        return next ();
    }
    req.flash("error", "You don't have permission to do that!");
    res.redirect("/blog");
};

module.exports = middlewareObj;