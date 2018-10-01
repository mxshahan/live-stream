'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);
var port = process.env.PORT || 3100;

app.use((0, _compression2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, '../../dist')));
app.use(function (req, res) {
  return res.sendFile(__dirname + '../../dist/index.html');
});
// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');
io.sockets.on('connection', function (socket) {
  var room = '';
  var create = function create(err) {
    if (err) {
      return console.log(err);
    }
    socket.join(room);
    socket.emit('create');
  };
  // sending to all clients in the room (channel) except sender
  socket.on('message', function (message) {
    return socket.broadcast.to(room).emit('message', message);
  });
  socket.on('find', function () {
    var url = socket.request.headers.referer.split('/');
    room = url[url.length - 1];
    var sr = io.sockets.adapter.rooms[room];
    if (sr === undefined) {
      // no room with such name is found so create it
      socket.join(room);
      socket.emit('create');
    } else if (sr.length === 1) {
      socket.emit('join');
    } else {
      // max two clients
      socket.emit('full', room);
    }
  });
  socket.on('auth', function (data) {
    data.sid = socket.id;
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('approve', data);
  });
  socket.on('accept', function (id) {
    io.sockets.connected[id].join(room);
    // sending to all clients in 'game' room(channel), include sender
    io.in(room).emit('bridge');
  });
  socket.on('reject', function () {
    return socket.emit('full');
  });
  socket.on('leave', function () {
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('hangup');
    socket.leave(room);
  });
});

server.listen(port, function (err) {
  if (err) console.log(err);
  console.log('Server Listening 3100');
});