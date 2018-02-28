const   express = require("express"),
        router = express.Router(),
        Blog = require("../models/blog"),
        Comment = require("../models/comment"),
        middleware = require("../middleware");

//================================
//COMMENTS ROUTES
//================================
router.post('/blog/:id/comments', middleware.isLoggedIn, function(req, res) {
    //lookup blog using id
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err || !foundBlog) {
            console.log(err);
            req.flash("error", err);
            res.redirect('back');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    comment.save();
                    foundBlog.comments.push(comment._id);
                    foundBlog.save();
                    req.flash("success", "Comment added successfully!");
                    res.redirect('/blog/' + foundBlog._id);
                }
            });
        }
    });
});

//EDITING COMMENTS ROUTE
router.get('/blog/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    
    const id = req.params.id,
        comment_id = req.params.comment_id;
        
        Blog.findById(id, function(err, foundBlog) {
            if (err || !foundBlog) {
                console.log(err);
                res.redirect('back');
            } else {
                Comment.findById(comment_id, function(err, foundComment) {
                    if (err) {
                        console.log(err);
                        res.redirect('back');
                    } else {
                        res.render('comments/edit', {blog: foundBlog, comment: foundComment});
                    }
                });
            }
        });
});

//COMMENTS UPDATE ROUTE
router.put('/blog/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    
    const id = req.params.id,
            comment_id = req.params.comment_id,
            newComment = req.body.comment;
    
    Comment.findByIdAndUpdate(comment_id, newComment, function (err, updatedComment) {
        if (err) {
            console.log(err);
            req.flash("error", err);
            res.redirect('back');
        } else {
            req.flash("success", "Comment succefully updated!");
            res.redirect('/blog/' + id);
        }
    });
});

//COMMENTS DELETE ROUTE
router.delete('/blog/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    
    const id = req.params.id,
        comment_id = req.params.comment_id;
        
    Comment.findByIdAndRemove(comment_id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", err);
            res.redirect('/blog/' + id);
        } else {
            req.flash("info", "Comment deleted!");
            res.redirect('/blog/' + id);
        }
    });
});

//REPLY ROUTE
router.post('/blog/:id/comments/:comment_id/reply', middleware.isLoggedIn, function (req, res) {
    const id = req.params.id,
        comment_id = req.params.comment_id,
        reply = {
            author: {
                id: req.user._id,
                username: req.user.username,
                avatar: req.user.avatar
            },
            text: req.body.reply
        };
        
        Comment.findById(comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", err);
                res.redirect('/blog/' + id);
            } else {
                foundComment.reply.push(reply);
                foundComment.save();
                req.flash("success", "Succesfully added reply!");
                res.redirect("/blog/" + id);
            }
        });
});

module.exports = router;