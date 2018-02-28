const   methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        passport            = require("passport"),
        LocalStrategy       = require("passport-local"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        flash               = require("connect-flash"),
        express             = require("express"),
        app                 = express();
    
const   //Blog    = require("./models/blog"),
        //Comment = require("./models/comment"),
        User    = require("./models/user");
        //seedDB  = require("./seeds.js");
        
const   commentRoutes   = require("./routes/comments"),
        blogRoutes      = require("./routes/blog"),
        authRoutes      = require("./routes/auth");

//seedDB();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app_v_0_7");
mongoose.Promise = global.Promise;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressSanitizer()); //it HAS (always) to be after bodyParser
app.use(flash());

//=================================================
//PASSPORT CONFIGURATION
//=================================================
app.use(require("express-session")({
    secret: "Najlepszy na swiecie Blog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================================
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(blogRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is working!");
});