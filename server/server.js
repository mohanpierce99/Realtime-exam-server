const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoconnect.js');
const Student = require('./db/models/Student.js');
const router = require('./router.js');
const randomsection = require('./../public/randomsection');
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
    randomsection
});

app.listen(port);