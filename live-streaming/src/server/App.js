import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3100;

app.post('/stream', (req, res) => {

})

io.on('connection', (socket) => {
    socket.on('stream', (stream) => {
        console.log(stream)
        socket.broadcast.emit('view', stream);
    })
    socket.on("disconnect", function() {
      console.log("A user is disconnected");
    });
})

server.listen(port, (err) => {
    if(err) console.log(err)
    console.log('Server Listening 3100')
})