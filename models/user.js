const   mongoose = require('mongoose'),
        passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app_v_0_7");
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: "https://freeiconshop.com/wp-content/uploads/edd/person-flat.png"},
    firstName: String,
    lastName: String,
    email: String,
    joined: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);