const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoconnect.js');
const Student = require('./db/models/Student.js');
const cookie = require('cookie-parser');
const router = require('./router.js');
const mongolib = require('./utility/mongolib');
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

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'hbs');
app.use(bodyParser.json());

io.on('connection', (socket) => {
    console.log('connected');


    socket.on('getCredentials', (roll,name) => {
        if(roll && name){
            socket.roll = roll;
            socket.name = name;
        }else{
            socket.name="Teacher"
        }
 
        sockets.push(socket);
        console.log(socket.name);
        sockets[0].emit('userJoined',{
            rollno: roll,
            name,
            timestamp: new Date().toLocaleTimeString(),
        });

    });


    socket.on('sendTime', (time) => {
        console.log(time);
        socket.broadcast.emit('setDefaultTime', time);
    });
     

    socket.on('cherryPick', (rollId, time) => {
        var correctSocket = sockets.filter(data => data.roll == rollId)[0];
        console.log(correctSocket);
        correctSocket.emit('addTime', time);
    });

    socket.on('append', (time) => {
        socket.broadcast.emit('addTime', time);
    });

    socket.on('makeOffline',(dataUser)=>{
      sockets[0].emit('changeStatus',dataUser);
    });
});


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

server.listen(port);