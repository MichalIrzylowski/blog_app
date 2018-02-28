const   express = require("express"),
        router = express.Router(),
        passport = require("passport"),
        User = require("../models/user"),
        middleware = require("../middleware");

//===================================
//AUTH ROUTES
//===================================

//REGISTER
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
            const newUser = new User({
                username: req.body.username, 
                avatar: req.body.avatar, 
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }),
            password = req.body.password,
            adminCode = req.body.adminCode;
    
    if (adminCode === "secretCode123") {
        newUser.isAdmin = true;
    }
    
    User.register(newUser, password, function(err, user) { //'register' provided by passport-local-mongoose
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Profile created! Nice to meet you " + req.body.username + "!");
            res.redirect("/blog");
            });
        }
    }); 
});

//LOGIN
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", { //local-strategy
        successRedirect: "/blog",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Succesfully logged out!");
    res.redirect("/blog");
});

// USER PROFILE
router.get("/user/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.render("users/user", {user: foundUser});
        }
    });
});

// EDIT USER
router.get("/user/:id/edit", middleware.checkUserOwnership, function(req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.render("users/userEdit", {user: foundUser});
        }
    });
});

router.put("/user/:id", middleware.checkUserOwnership, function(req, res) {
    const id = req.params.id,
            newUser = {
                avatar: req.body.avatar,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            };
    User.findByIdAndUpdate(id, newUser, function (err, updatedUser) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            req.flash("success", "Profile succesfully updated!");
            res.redirect("/user/" + id);
        }
    });
});

//DISPLAY ALL USERS
router.get("/allUsers", middleware.isAdmin,  function(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.render("users/allUsers", {users: allUsers.sort(function (a, b) {
                return a.isAdmin - b.isAdmin;
            })});
        }
    });
});

//CHANGE ADMIN STATUS
router.put("/make_new_admins", middleware.isAdmin, function(req, res) {
    const changeAdminStatus = req.body;
    for (let id in changeAdminStatus) {
        if (changeAdminStatus[id] === "true") {
            const newAdmin = {isAdmin: true};
            User.findByIdAndUpdate(id, newAdmin, function (err, foundUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    req.flash("success", "New admin: " + foundUser.firstName + " " + foundUser.lastName);
                    res.redirect("/allUsers");
                }
            });
        } else if (changeAdminStatus[id] === "false") {
            const lostStatus = {isAdmin: false};
            User.findByIdAndUpdate(id, lostStatus, function (err, foundUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    req.flash("success", "Admin has lost his status: " + foundUser.firstName + " " + foundUser.lastName);
                    res.redirect("/allUsers");
                }
            });
        } else if (changeAdminStatus[id]){
            req.flash("error", "You can't do that!");
            res.redirect("back");
        }
    }
});

module.exports = router;