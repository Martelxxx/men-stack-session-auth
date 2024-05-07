const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const session = require('express-session');
const app = express();

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const morgan = require('morgan');

const authController = require('./controllers/auth.js');

//Set the port
const port = process.env.PORT ? process.env.PORT : "3111";

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

//Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
//Middleware for using PUT and DELETE methods
app.use(methodOverride('_method'));
//Middleware for logging
app.use(morgan('dev'));
//Middleware for express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
//Middleware for Controllers
app.use('/auth', authController);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});  

//=======================================================//

//GET / - Home route
app.get('/', async (req, res) => {
    res.render('index.ejs', {
        user: req.session.user
    });
});

//GET VIP route
app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the VIP Lounge, ${req.session.user.username}!`);
    } else {
        res.send("You must be logged in to enter the VIP Lounge.");
    }
});