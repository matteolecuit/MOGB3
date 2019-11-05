require('dotenv').config({
    path: __dirname + '/../../.env'
});
const serverPort = process.env.SERVERPORT;

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var api = require('./lib/api');

app.use(express.static(__dirname + '/../client'));

io.on('connection', socket => {
    console.log('Connection : \033[32m' + socket.id + '\033[0m');

    socket.on('disconnect', () => {
        console.log('Disconnect : \033[31m' + socket.id + '\033[0m');
    });
});

http.listen(serverPort, () => console.log('\x1b[33m%s\x1b[0m', "Server is listening on port " + serverPort));