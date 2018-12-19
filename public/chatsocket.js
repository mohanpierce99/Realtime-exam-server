

let net = require('net');



let sockets = {};
let counter = 0;
net.createServer((socket) => {
    socket.write("Welcome to the chatroom\n");
    console.log("Successfully connected\n");
    socket.id = counter++;
    socket.write("Please enter your name\n");

    socket.on('data', function (data) {
        if(!socket.name){
           socket.name=data.toString().trim();
           sockets[socket.id]=socket;
           socket.write(`Welcome ${socket.name}  :)\n`);
           return ;
        }
       Object.keys(sockets).forEach((datas)=>{
           if(datas==socket.id){return ;};
        sockets[datas].write(`${this.name} => ${data} `);
       });
    });

    socket.on('end',()=>{
        delete sockets[socket.id];
        console.log(`${socket.id} has disconnected`);
    })

    socket.on('error',(err)=>{
console.log(socket.id);
    });

   
 
 


}).listen(3001);

// net.createServer((socket)=>{
//     socket.write("Hey\n");

//     socket.on("data",(data)=>{
//         socket.write(data+"\n");
//         if(data.toString()=="quit\n"){
//             socket.destroy("BYe ppaaa");
//         }
//     })
//     socket.on('error',(err)=>{
//         console.log(err);
//     })
// }).listen(3005);


{

    S1:false,
    
}





