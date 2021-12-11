const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const authRoutes = require('./routes/authroutes')
require('dotenv').config()
const { isLoggedIn } = require('./middlewares')

const uri = `mongodb+srv://serajsas:${process.env.DB_PASSWORD}@cluster0.sndj1.mongodb.net/accounts`;
const express = require('express');
const app = express();
mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(function () {
    console.log("Connection has been established!!")
}).catch(err => {
    console.log(err)
})
//set up express session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
app.use('/', authRoutes);

app.get('*', (req, res) => {
    if (req.session.views) {
        req.session.views += 1;
    } else {
        req.session.views = 1;
    }
    res.render('./pages/home',{value:req.session.views})
})
app.listen(process.env.PORT);
console.log(`Server is listening on port ${process.env.PORT}`);