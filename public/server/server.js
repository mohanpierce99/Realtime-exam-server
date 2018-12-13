var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const MFunc = require('./MongooseFunc'); 


const port = process.env.PORT || 3000;
var app = express();
app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.get('/thome',(req,res)=>{
    res.render("TeacherHome.hbs");
})

app.get('/slogin',(req,res)=>{
    res.render("StudentHome.hbs");
})

app.post('/addToClass',(req,res)=>{
    console.log(req.body);
    MFunc.addToClass({
        dept:(req.body.dept),
        sec:(req.body.sec),
        batch:Number(req.body.batch),
        date: String(new Date())
    });
    res.send("started");
});

app.listen(port,()=>{
	console.log(`started on port ${port}`);
});