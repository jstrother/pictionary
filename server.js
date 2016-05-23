const http = require('http');
const express = require('express');
const socket = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const	 io = socket(server);

io.on('connection', function(socket) {
	console.log('Client Connected');

	socket.on('draw', function(position) {
		console.log('Drawing');
		socket.broadcast.emit('draw', position);
	});
})

server.listen(8080);