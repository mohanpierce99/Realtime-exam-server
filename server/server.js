const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
let mongoose = require('./db/mongoconnect.js');
const Student = require('./db/models/Student.js');
const cookie = require('cookie-parser');
const router = require('./router.js');
let mongolib = require('./utility/mongolib');
const jwt = require('jsonwebtoken');
const hbs = require('hbs');
const jwtlib = require('./utility/jwtlib');
const randomsection = require('./utility/randomsection');
const pathgen = require('./utility/pathgen.js');
const resultify = require('./utility/resultify.js');
const socketio = require('socket.io');

let app = express();
let server = http.createServer(app);
var io = socketio(server);

var sockets = [];

// let studColl = mongolib.init("students");
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'hbs');
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
    randomsection,
    pathgen,
    resultify
});
mongoose=mongoose.mongoose;
io.on('connection', (socket) => {
    console.log('connected');
    socket.on('getCredentials', (roll, name) => {
        if (roll && name) {
            socket.roll = roll;
            socket.name = name;
            socket.join("students");
        } else {
            socket.name = "Teacher"
        }

        sockets.push(socket);
        console.log(socket.name);
        sockets[0].emit('userJoined', {
            rollno: roll,
            name,
            timestamp: new Date().toLocaleTimeString(),
        });

    });


    socket.on('sendTime', (time) => {
        console.log(time);
        io.sockets.in("students").emit("setDefaultTime",time);
    });


    socket.on('cherryPick', (rollId, time) => {
        var allClients = io.sockets.clients("students");
        let correctSocket=allClients.filter((x)=>{
           return x.roll==rollId
        });
        console.log(correctSocket[0]);
        if(correctSocket[0])
        correctSocket[0].emit('addTime', time);
    });

    socket.on('changeTime', (time) => {
        io.sockets.in("students").emit("addTime",time);
    });

    socket.on("disconnect", () => {
        socket.leave("students");
        sockets[0].emit('userLeft', {
            rollno: socket.roll,
            timestamp: new Date().toLocaleTimeString(),
        });

        studColl.update({
            id: rollno
        },{
            is_loggedin: false,
        }).then(()=>{
            console.log("Login status changed for "+socket.roll);
        })
    
    })
});




server.listen(port);