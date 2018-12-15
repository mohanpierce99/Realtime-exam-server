const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoconnect.js');
const Student = require('./db/models/Student.js');
const cookie=require('cookie-parser');
const router = require('./router.js');
const mongolib=require('./db/mongolib.js');
const jwt=require('jwtwebtoken');
let app = express();

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

router({
    app,
    express,
    bodyParser,
    mongoose,
    Student,
    cookie,
    mongolib,
     jwt
});

app.listen(port);