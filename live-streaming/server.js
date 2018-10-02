const express = require('express');
const http = require('http');
// const socketIO = require('socket.io');
const WebSocketServer = require('ws').Server;
const compression = require('compression');
const fs = require('fs');
const path = require('path');


const app = express();
const server = http.createServer(app);
// const io = socketIO(server);
const io = new WebSocketServer({ port: 9090 });

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

app.get('/capture', (req, res) => {
    res.send('hee')
})

io.on('connection', socket => {
    var users;
    console.log('connected')
    socket.on('stream', video => {
        var data;
        try {
            data = JSON.parse(video)
        } catch (e) {
            console.log('Invalid')
            data = {};
        }

        switch (data.type) {
            case "login":
                console.log("User logged:", data.name);

                //if anyone is logged in with this username then refuse 
                if (users[data.name]) {
                    sendTo(socket, {
                        type: "login",
                        success: false
                    });
                } else {
                    //save user connection on the server 
                    users[data.name] = socket;
                    socket.name = data.name;

                    sendTo(socket, {
                        type: "login",
                        success: true
                    });
                }

                break;

            case "offer":
                //for ex. UserA wants to call UserB 
                console.log("Sending offer to: ", data.name);

                //if UserB exists then send him offer details 
                var conn = users[data.name];

                if (conn != null) {
                    //setting that UserA connected with UserB 
                    socket.otherName = data.name;

                    sendTo(conn, {
                        type: "offer",
                        offer: data.offer,
                        name: socket.name
                    });

                }

                break;

            case "answer":
                console.log("Sending answer to: ", data.name);

                //for ex. UserB answers UserA 
                var conn = users[data.name];

                if (conn != null) {
                    socket.otherName = data.name;

                    sendTo(conn, {
                        type: "answer",
                        answer: data.answer
                    });
                }

                break;

            case "candidate":
                console.log("Sending candidate to:", data.name);
                var conn = users[data.name];

                if (conn != null) {
                    sendTo(conn, {
                        type: "candidate",
                        candidate: data.candidate
                    });
                }

                break;

            case "leave":
                console.log("Disconnecting from", data.name);
                var conn = users[data.name];
                conn.otherName = null;

                //notify the other user so he can disconnect his peer connection 
                if (conn != null) {
                    sendTo(conn, {
                        type: "leave"
                    });
                }

                break;
            default:
                sendTo(socket, {
                    type: 'error',
                    message: 'command not found ' + data.type
                });
                break;
        }
    })

    function sendTo(socket, message) {
        console.log('h')
        socket.send(JSON.stringify(message));
    }

    socket.on('close', () => {
        if(socket.name) { 
            delete users[socket.name]; 
              
            if(socket.otherName) { 
               console.log("Disconnecting from ", socket.otherName); 
               var conn = users[socket.otherName]; 
               conn.otherName = null;  
                  
               if(conn != null) { 
                  sendTo(conn, { 
                     type: "leave" 
                  });
               }
                  
            } 
         } 
    })
	
    socket.send("Hello world");  

})

const port = process.env.PORT || 5000;
server.listen(port, function (err) {
    if (err) console.log(err)
    console.log('Server Listening ' + port)
})