const mongoose = require('mongoose');
require('dotenv').config()

const uri = `mongodb+srv://serajsas:${process.env.DB_PASSWORD}@cluster0.sndj1.mongodb.net/accounts`;
const express = require('express');
const app = express();
mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(function(){
    console.log("Connection has been established!!")
}).catch(err=>{
    console.log(err)
})
// set the view engine to ejs
app.set('view engine', 'ejs');


app.listen(8080);
console.log('Server is listening on port 8080');