const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const authRoutes = require('./routes/authRoutes')
const journalRoutes = require('./routes/journalRoutes')
const dotenv = require('dotenv').config() 

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.DB_PASSWORD}@cluster0.sndj1.mongodb.net/accounts`;
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
app.set('trust proxy', 1);
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: oneDay },
    resave: false,
}));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
app.use('/', authRoutes);
app.use('/', journalRoutes);

app.get('*', (req, res) => {
    res.render('./pages/mainPage')
})
app.listen(process.env.PORT || 8000);
console.log(`Server is listening on port ${process.env.PORT}`);