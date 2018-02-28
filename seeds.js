const mongoose = require('mongoose');

const   Blog = require('./models/blog'),
        Comment = require("./models/comment");

var data = [
    {
        title: "blog title 1",
        image: "https://images.unsplash.com/photo-1459666644539-a9755287d6b0?auto=format&fit=crop&w=828&q=80",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit tincidunt vestibulum. Vivamus vitae neque eleifend lacus vestibulum rutrum. Maecenas ullamcorper vestibulum neque, ac interdum lectus viverra eu. Donec at quam ante. Sed bibendum et est malesuada mollis. Integer efficitur ante vitae luctus egestas. Phasellus id lobortis nibh. Vivamus pulvinar libero ac eleifend scelerisque. Suspendisse potenti. Sed nec velit ut enim consequat lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ac metus at augue blandit porta. Vestibulum rutrum augue vel magna ullamcorper, et efficitur lacus euismod. Quisque blandit facilisis lorem ut mollis."
    },
    {
        title: "blog title 2",
        image: "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?auto=format&fit=crop&w=750&q=80",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit tincidunt vestibulum. Vivamus vitae neque eleifend lacus vestibulum rutrum. Maecenas ullamcorper vestibulum neque, ac interdum lectus viverra eu. Donec at quam ante. Sed bibendum et est malesuada mollis. Integer efficitur ante vitae luctus egestas. Phasellus id lobortis nibh. Vivamus pulvinar libero ac eleifend scelerisque. Suspendisse potenti. Sed nec velit ut enim consequat lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ac metus at augue blandit porta. Vestibulum rutrum augue vel magna ullamcorper, et efficitur lacus euismod. Quisque blandit facilisis lorem ut mollis."
    },
    {
        title: "blog title 3",
        image: "https://images.unsplash.com/photo-1500644970114-4ff3c3dfb61f?auto=format&fit=crop&w=750&q=80",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit tincidunt vestibulum. Vivamus vitae neque eleifend lacus vestibulum rutrum. Maecenas ullamcorper vestibulum neque, ac interdum lectus viverra eu. Donec at quam ante. Sed bibendum et est malesuada mollis. Integer efficitur ante vitae luctus egestas. Phasellus id lobortis nibh. Vivamus pulvinar libero ac eleifend scelerisque. Suspendisse potenti. Sed nec velit ut enim consequat lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ac metus at augue blandit porta. Vestibulum rutrum augue vel magna ullamcorper, et efficitur lacus euismod. Quisque blandit facilisis lorem ut mollis."
    },
    {
        title: "blog title 4",
        image: "https://images.unsplash.com/photo-1514041181368-bca62cceffcd?auto=format&fit=crop&w=890&q=80",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit tincidunt vestibulum. Vivamus vitae neque eleifend lacus vestibulum rutrum. Maecenas ullamcorper vestibulum neque, ac interdum lectus viverra eu. Donec at quam ante. Sed bibendum et est malesuada mollis. Integer efficitur ante vitae luctus egestas. Phasellus id lobortis nibh. Vivamus pulvinar libero ac eleifend scelerisque. Suspendisse potenti. Sed nec velit ut enim consequat lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ac metus at augue blandit porta. Vestibulum rutrum augue vel magna ullamcorper, et efficitur lacus euismod. Quisque blandit facilisis lorem ut mollis."
    }
    ];

function seedDB() {
    Blog.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('removed blogs');
        //add new blogs
        data.forEach(function(seed) {
            Blog.create(seed, function(err, blog) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('added data');
                    //add some comments
                    Comment.create(
                            {
                                text: "This Blog is great!",
                                author: "Homer"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                blog.comments.push(comment);
                                blog.save();
                                console.log('created new comment');
                                }
                            });
                }
            });
        });
    });
    
}

module.exports = seedDB;