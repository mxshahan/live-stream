import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import compression from 'compression';
import fs from 'fs';
import path from 'path'

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3100;

app.use(compression());
app.use(express.static(path.join(__dirname, '../../dist')));
app.use((req, res) => res.sendFile(__dirname + '../../dist/index.html'));
// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');
// io.sockets.on('connection', socket => {
//   let room = '';
//   const create = err => {
//     if (err) {
//       return console.log(err);
//     }
//     socket.join(room);
//     socket.emit('create');
//   };
//   // sending to all clients in the room (channel) except sender
//   socket.on('message', message => socket.broadcast.to(room).emit('message', message));
//   socket.on('find', () => {
//     const url = socket.request.headers.referer.split('/');
//     room = url[url.length - 1];
//     const sr = io.sockets.adapter.rooms[room];
//     if (sr === undefined) {
//       // no room with such name is found so create it
//       socket.join(room);
//       socket.emit('create');
//     } else if (sr.length === 1) {
//       socket.emit('join');
//     } else { // max two clients
//       socket.emit('full', room);
//     }
//   });
//   socket.on('auth', data => {
//     data.sid = socket.id;
//     // sending to all clients in the room (channel) except sender
//     socket.broadcast.to(room).emit('approve', data);
//   });
//   socket.on('accept', id => {
//     io.sockets.connected[id].join(room);
//     // sending to all clients in 'game' room(channel), include sender
//     io.in(room).emit('bridge');
//   });
//   socket.on('reject', () => socket.emit('full'));
//   socket.on('leave', () => {
//     // sending to all clients in the room (channel) except sender
//     socket.broadcast.to(room).emit('hangup');
//     socket.leave(room);});
// });

server.listen(port, (err) => {
    if(err) console.log(err)
    console.log('Server Listening 3100')
})