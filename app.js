var express             = require('express'),
passport                = require('passport'),
LocalStrategy           = require('passport-local'),
passportLocalMongoose   = require('passport-local-mongoose'),
mongoose                = require('mongoose'),
methodOverride          = require('method-override'),
bodyParser              = require('body-parser'),
Bike                    = require('./models/bikes'),
User                    = require('./models/users'),
Comment                 = require('./models/comments'),
commentRoutes           = require('./routes/comments'),
bikeRoutes              = require('./routes/bikes'),
indexRoutes             = require('./routes/index'),
flash                   = require('connect-flash');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/bikeproject', {useMongoClient: true});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method"));

app.use(flash());

app.use(require('express-session')({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', indexRoutes);
app.use('/bikes', bikeRoutes);
app.use('/bikes/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Running');
});