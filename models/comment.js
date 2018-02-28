const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app_v_0_7");
mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        avatar: String
    },
    reply: [{
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String,
            avatar: String
        },
        text: String
    }]
});



module.exports = mongoose.model("Comment", commentSchema);