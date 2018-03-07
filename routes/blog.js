const   express = require("express"),
        router = express.Router(),
        Blog = require("../models/blog"),
        middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req, res) {
    res.render("home");
});

router.get("/blog", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
router.get("/blog/new", middleware.isAdmin, function(req, res) {
    res.render("blogs/new");
});

//CREATE ROUTE
router.post("/blog", middleware.isAdmin, function(req, res) {
    //create blog
    req.body.text_content = req.sanitize(req.body.text_content);
    let text_content = req.body.text_content;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    
    let data = {
        title: req.body.title,
        image: req.body.image,
        body: text_content,
        author: author
    };

    Blog.create(data, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        } else {
            req.flash("success", "Succesfully created new blog!");
            //redirect to the index
            res.redirect("/blog");
        }
    });
});

//SHOW ROUTE
router.get("/blog/:id", function(req, res) {
    let id = req.params.id;
    
    Blog.findById(id).populate("comments").exec(function(err, foundBlog){
        if(err || !foundBlog){
            console.log(err);
            req.flash("error", err);
            res.redirect("/blog");
        } else {
            Blog.find({}, function(err, blogs) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    let randomBlogs = [];
                    for (let i = 0; i < 5; i++) {
                        randomBlogs.push(blogs[Math.floor(Math.random() * blogs.length)]);
                    }
                    res.render("blogs/show", {blog: foundBlog, randomBlogs: randomBlogs});
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/blog/:id/edit", middleware.checkBlogOwnership, function(req, res) {
    let id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog});
    });
});

//UPDATE ROUTE
router.put("/blog/:id", middleware.checkBlogOwnership, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    const id = req.params.id,
            newBody = req.body.blog;
    
    Blog.findByIdAndUpdate(id, newBody, function(err, updatedBlog){
        if (err || !updatedBlog){
            req.flash("error", err);
            res.redirect("/blog");
        } else {
            req.flash("success", "Blog succesfully updated!");
            res.redirect("/blog/" + id);
        }
    });
});

//DELETE ROUTE
router.delete("/blog/:id", middleware.checkBlogOwnership, function(req, res){
    let id = req.params.id;
    //destroy blog
    Blog.findByIdAndRemove(id, function(err){
        if(err){
            console.log(err);
            req.flash("error", err);
            res.redirect("/blog");
        } else {
            req.flash("info", "Blog deleted!");
            //redirect
            res.redirect("/blog");
        }
    });
});

module.exports = router;