const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoconnect.js');
const Student = require('./db/models/Student.js');
const cookie=require('cookie-parser');
const router = require('./router.js');
const mongolib=require('./utility/mongolib');
const jwt=require('jsonwebtoken');
const hbs=require('hbs');
const jwtlib=require('./utility/jwtlib');
const randomsection = require('./utility/randomsection');
let app = express();

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

router({
    app,
    hbs,
    express,
    bodyParser,
    mongoose,
    Student,
    cookie,
    mongolib,
     jwt,
     jwtlib,
     hbs,
     randomsection
});

app.listen(port);