const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app_v_0_7");
mongoose.Promise = global.Promise;

//=================================================
//CONFIGURATION OF MONGOOSE MODEL
//=================================================
const blogSchema = new mongoose.Schema({
      title: String,
      image: String,
      body: String,
      created: {type: Date, default: Date.now},
      author: {
          id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          },
          username: String
      },
      comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
          ]
});


module.exports = mongoose.model("Blog", blogSchema);

/*
Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1438955185657-797f29aeaea8?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    body: "Hello this is test blog post"
});
*/