require('dotenv').config({
    path: __dirname + '/../../.env'
});
const serverPort = process.env.SERVERPORT;

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var util = require('./lib/util');
var api = require('./lib/api');
var User = require('./lib/user');
var Room = require('./lib/room');

app.use(express.static(__dirname + '/../client'));

var loggedUsers = new Map();
var users = new Map();
var rooms = new Map();

io.on('connection', socket => {
    console.log('Connection : \033[32m' + socket.id + '\033[0m');

    //
    // User join the game instance
    //
    socket.on('join', name => {
        if (users.has(socket.id)) socket.disconnect();
        else {
            users.set(socket.id, new User(socket, name));
            socket.join('rooms_socket_channel_security_length');
            console.log('User \033[33m' + socket.id + '\033[0m joined as \033[33m' + name + '\033[0m');
        }
    });

    //
    // User request changing name
    //
    socket.on('requestChangeNick', () => {
        socket.leave('rooms_socket_channel_security_length');
    });

    //
    // User change name
    //
    socket.on('changeNick', name => {
        if (!users.has(socket.id)) socket.disconnect();
        else {
            users.get(socket.id).name = name;
            socket.join('rooms_socket_channel_security_length');
            console.log('User \033[33m' + socket.id + '\033[0m is now \033[33m' + name + '\033[0m');
        }
    });

    //
    // User needs the current room list
    //
    socket.on('requestRoomList', () => {
        socket.join('rooms_socket_channel_security_length');
        socket.emit('roomList', util.getRoomListData(rooms));
    });

    //
    // User creates a new room
    //
    socket.on('requestCreateRoom', name => {
        if (rooms.has(name)) socket.emit('notification', {
            type: 'error',
            message: 'ERROR : This room name is already taken'
        });
        else {
            var user = users.get(socket.id);
            var room = new Room(name, user);
            rooms.set(name, room);

            socket.leave('rooms_socket_channel_security_length');
            io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
            socket.emit('createRoom', room.name);
            console.log('User \033[33m' + user.name + '\033[0m created room \033[33m' + name + '\033[0m');
        }
    });

    //
    // User enters a room
    //
    socket.on('requestJoinRoom', name => {
        if (!rooms.has(name)) socket.disconnect();
        else {
            var user = users.get(socket.id);
            var room = rooms.get(name);
            room.users.set(socket.id, user);
            user.team = 'spectator';

            socket.leave('rooms_socket_channel_security_length');
            io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
            socket.join(name);
            io.to(name).emit('room', util.getRoomData(room));
            console.log('User \033[33m' + user.name + '\033[0m joined room \033[33m' + name + '\033[0m');
        }
    });

    //
    // User leaves a room
    //
    socket.on('requestLeaveRoom', name => {
        if (!rooms.has(name) || !rooms.get(name).users.has(socket.id)) socket.disconnect();
        else {
            var user = users.get(socket.id);
            var room = rooms.get(name);
            room.users.delete(socket.id);
            user.team = null;

            socket.leave(name);
            socket.emit('leaveRoom', name);
            console.log('User \033[33m' + user.name + '\033[0m leaved room \033[33m' + name + '\033[0m');

            if (room.users.size < 1) {
                rooms.delete(name);
                console.log('Room \033[33m' + name + '\033[0m has been deleted');
            } else {
                if (room.admin === user) {
                    room.admin = room.users.values().next().value;
                    console.log('User \033[33m' + room.admin.name + '\033[0m is now admin of the room \033[33m' + name + '\033[0m');
                }
                io.to(name).emit('room', util.getRoomData(room));
            }
        }
        io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
    });

    //
    // User selects team or spectator side
    //
    socket.on('requestSelectTeam', data => {
        var user = users.get(socket.id);
        var room = rooms.get(data.name)
        user.team = data.team;

        io.to(room.name).emit('room', util.getRoomData(room));
    });

    //
    // Listen to users redirects and update game data
    //
    var updateLeavingUser = () => {
        if (users.has(socket.id)) {
            var user = users.get(socket.id);
            var room = null;
            rooms.forEach(r => r.users.forEach(u => {
                if (user === u) room = r;
            }));

            if (room) {
                room.users.delete(socket.id);
                console.log('User \033[33m' + user.name + '\033[0m leaved room \033[33m' + room.name + '\033[0m');

                if (room.users.size < 1) {
                    rooms.delete(room.name);
                    console.log('Room \033[33m' + room.name + '\033[0m has been deleted');
                } else {
                    if (room.admin === user) {
                        room.admin = room.users.values().next().value;
                        console.log('User \033[33m' + room.admin.name + '\033[0m is now admin of the room \033[33m' + room.name + '\033[0m');
                    }
                    io.to(room.name).emit('room', util.getRoomData(room));
                }
                io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
            }

            [...Object.keys(io.sockets.adapter.sids[socket.id])].forEach(socketRoom => socket.leave(socketRoom));
            users.delete(socket.id);
            console.log('Leaving : \033[31m' + socket.id + '\033[0m');
        }
    }

    socket.on('requestNewsPage', () => {
        updateLeavingUser();
        socket.emit('newsPage', api.getNews());
    });

    socket.on('requestPlayPage', () => {
        updateLeavingUser();
        socket.emit('playPage');
    });

    socket.on('requestRankingsPage', () => {
        updateLeavingUser();
        socket.emit('rankingsPage', api.getRankings());
    });

    socket.on('requestAboutPage', () => {
        updateLeavingUser();
        socket.emit('aboutPage');
    });

    socket.on('requestProfilePage', id => {
        updateLeavingUser();
        socket.emit('profilePage', api.getUser(id));
    });

    socket.on('requestAuth', () => {
        updateLeavingUser();
        socket.emit('authPage');
    });

    socket.on('requestLogIn', user => {
        updateLeavingUser();
        var userConnection = null;
        if (!Array.from(loggedUsers.values()).find(loggedUser => loggedUser === user.name)) {
            userConnection = api.logIn(user.name, user.password);
            if (userConnection) {
                loggedUsers.set(socket.id, userConnection.name);
                console.log('Log in : User \033[33m' + socket.id + '\033[0m logged in as \033[33m' + userConnection.name + '\033[0m');
            }
        }
        socket.emit('logIn', userConnection);
    });

    socket.on('requestRegister', user => {
        if (api.register(user.name, user.password)) {
            console.log('Register : User \033[33m' + socket.id + '\033[0m registered as \033[33m' + userConnection.name + '\033[0m');
        };
        updateLeavingUser();
        var userConnection = api.logIn(user.name, user.password);
        if (userConnection) {
            loggedUsers.set(socket.id, userConnection.name);
            console.log('Log in : User \033[33m' + socket.id + '\033[0m logged in as \033[33m' + userConnection.name + '\033[0m');
        }
        socket.emit('logIn', userConnection);
    });

    socket.on('requestUpdateUser', user => {
        api.updateUserPersonalInfos(user.id, user.newname, user.newpassword, user.newPfp);
        socket.emit('profilePage', api.getUser(user.id));
    });

    socket.on('requestLogOut', () => {
        updateLeavingUser();
        socket.emit('logOut');
        if (loggedUsers.has(socket.id)) {
            loggedUsers.delete(socket.id);
            console.log('Log out : User \033[33m' + socket.id + '\033[0m logged out');
        }
    });

    //
    // Listen to disconnecting users and update game data
    //
    socket.on('disconnect', () => {
        if (users.has(socket.id)) {
            var user = users.get(socket.id);
            var room = null;
            rooms.forEach(r => r.users.forEach(u => {
                if (user === u) room = r;
            }));

            if (room) {
                room.users.delete(socket.id);
                console.log('User \033[33m' + user.name + '\033[0m leaved room \033[33m' + room.name + '\033[0m');

                if (room.users.size < 1) {
                    rooms.delete(room.name);
                    console.log('Room \033[33m' + room.name + '\033[0m has been deleted');
                } else {
                    if (room.admin === user) {
                        room.admin = room.users.values().next().value;
                        console.log('User \033[33m' + room.admin.name + '\033[0m is now admin of the room \033[33m' + room.name + '\033[0m');
                    }
                    io.to(room.name).emit('room', util.getRoomData(room));
                }
                io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
            }
            users.delete(socket.id);
        }
        if (loggedUsers.has(socket.id)) {
            loggedUsers.delete(socket.id);
            console.log('Log out : User \033[33m' + socket.id + '\033[0m logged out');
        }
        console.log('Disconnect : \033[31m' + socket.id + '\033[0m');
    });
});

http.listen(serverPort, () => console.log('\x1b[33m%s\x1b[0m', "Server is listening on port " + serverPort));