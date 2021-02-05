// Libraries
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const User = require('./models/user');


// Connect to database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/family-recipes';
// const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected');
});


// Formats
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Session
const secret = process.env.SECRET || 'thisshouldbeabetterscret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('Session store error!', e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
}

app.use(session(sessionConfig));


// User Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Security
app.use(mongoSanitize());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);


// Constants
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


// Routing
const usersRoutes = require('./routes/users');
const recipesRoutes = require('./routes/recipes');
const postsRoutes = require('./routes/posts');

app.use('/users', usersRoutes);
app.use('/recipes', recipesRoutes);
app.use('/recipes/:id/posts', postsRoutes);


app.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('home', { users });
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
});


// Activate server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving at port ${port}`);
});