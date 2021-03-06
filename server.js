const http = require('http');
const express = require('express');
const socket_io = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const	 io = socket_io(server);

io.on('connection', function(socket) {

	socket.on('draw', function(position) {
		socket.broadcast.emit('draw', position);
	});

	socket.on('guess', function(guess) {
		socket.broadcast.emit('guess', guess);
	});

	socket.on('value', function(value) {
		socket.broadcast.emit('value', value);
	});
});

server.listen(8080);