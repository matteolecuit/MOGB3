require('dotenv').config({
    path: __dirname + '/../../.env'
});
const serverPort = process.env.SERVER_PORT || 3000;

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
            var room = rooms.get(name);
            if (room.users.size >= room.size) {
                socket.emit('notification', {
                    type: 'error',
                    message: 'ERROR : The room is full'
                });
            } else {
                var user = users.get(socket.id);
                room.users.set(socket.id, user);
                user.team = null;

                var userConnection = loggedUsers.has(socket.id) ? loggedUsers.get(socket.id) : null;
                if (userConnection) users.get(socket.id).pfp = userConnection.pfp;

                socket.leave('rooms_socket_channel_security_length');
                io.to('rooms_socket_channel_security_length').emit('roomList', util.getRoomListData(rooms));
                socket.join(name);
                io.to(name).emit('room', util.getRoomData(room));
                console.log('User \033[33m' + user.name + '\033[0m joined room \033[33m' + name + '\033[0m');
            }
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
    // User selects team
    //
    socket.on('requestSelectTeam', data => {
        var user = users.get(socket.id);
        var room = rooms.get(data.name);
        user.team = data.team;

        io.to(room.name).emit('room', util.getRoomData(room));
    });

    //
    // User start game
    //

    var getRandomPos = size => {
        return {
            x:Math.floor(Math.random() * (480 - size.x)),
            y:Math.floor(Math.random() * (270 - size.y))
        }
    }

    var updateGame = (roomName, gameLoop) => {
        var room = rooms.get(roomName);

        var bullets = [];
        room.users.forEach(user => user.bullets.forEach(bullet => {
            if (bullet.active) bullets.push(bullet)
        }));
        bullets.forEach(bullet => {
            if (bullet.pos.x > 480 || bullet.pos.x + bullet.size.x < 0 ||
                bullet.pos.y > 270 || bullet.pos.y + bullet.size.y < 0
            ) bullet.active = false;
            else {
                bullet.pos.x += bullet.dir.x * bullet.speed.x;
                bullet.pos.y += bullet.dir.y * bullet.speed.y;
            }
        });

        room.users.forEach(player => {
            if (player.active) {
                var inputs = player.inputs;

                bullets.forEach(bullet => {
                    if (!(player.pos.y + player.size.y <= bullet.pos.y || player.pos.y >= bullet.pos.y + bullet.size.y ||
                        player.pos.x + player.size.x <= bullet.pos.x || player.pos.x >= bullet.pos.x + bullet.size.x) && player.team !== bullet.team) {
                        player.active = false;
                    }
                });

                if (inputs.left === inputs.right) {
                    inputs.left = false;
                    inputs.right = false;
                }
                if (inputs.down === inputs.up) {
                    inputs.down = false;
                    inputs.up = false;
                }

                player.speed = !inputs.b ? { x:2, y:2 } : { x:1, y:1 };

                if (inputs.left) {
                    player.pos.x -= player.speed.x;
                    if (!inputs.b) {
                        player.dir.x = -1;
                        if (!inputs.up && !inputs.down) player.dir.y = 0;
                    }
                }
                if (inputs.right) {
                    player.pos.x += player.speed.x;
                    if (!inputs.b) {
                        player.dir.x = 1;
                        if (!inputs.up && !inputs.down) player.dir.y = 0;
                    }
                }
                if (inputs.down) {
                    player.pos.y += player.speed.y;
                    if (!inputs.b) {
                        player.dir.y = 1;
                        if (!inputs.left && !inputs.right) player.dir.x = 0;
                    }
                }
                if (inputs.up) {
                    player.pos.y -= player.speed.y;
                    if (!inputs.b) {
                        player.dir.y = -1;
                        if (!inputs.left && !inputs.right) player.dir.x = 0;
                    }
                }

                if (player.inputLagA) player.inputLagA--;
                else if (inputs.a) {
                    player.bullets.push({
                        team:player.team,
                        active: true,
                        pos: {
                            x: player.pos.x + player.size.x / 4,
                            y: player.pos.y + player.size.y / 4,
                        },
                        size: {
                            x: 8,
                            y: 8
                        },
                        speed: {
                            x: 4,
                            y: 4
                        },
                        dir: {
                            x: player.dir.x,
                            y: player.dir.y
                        }
                    });
                    player.inputLagA = 60 / 6;
                }

                player.pos.x = player.pos.x < 0 ? 0 : player.pos.x > 480 - 16 ? 480 - 16 : player.pos.x;
                player.pos.y = player.pos.y < 0 ? 0 : player.pos.y > 270 - 16 ? 270 - 16 : player.pos.y;
            }
        });

        var blueAlive = 0;
        var redAlive = 0;
        room.users.forEach(user => {
            blueAlive += user.team === "blue" && user.active ? 1 : 0;
            redAlive += user.team === "red" && user.active ? 1 : 0;
        });
        if (!blueAlive || !redAlive) {
            room.users.forEach(user => {
                user.bullets = [];
                user.active = true;
                user.pos = getRandomPos(user.size);
            });
            clearInterval(gameLoop);
            io.to(roomName).emit('endGame', util.getRoomData(room));
            room.open = true;
        }
    }

    socket.on('requestStartGame', roomName => {
        var room = rooms.get(roomName);
        io.to(roomName).emit('startGame', util.getRoomData(room));
        room.open = false;
        var gameLoop = setInterval(() => {
            updateGame(roomName, gameLoop);
            io.to(roomName).emit('updateGame', util.getGameData(room));
        }, 1000 / 60);
    });

    socket.on('requestInputs', data => {
        rooms.get(data.roomName).users.get(socket.id).inputs = data.inputs;
    })

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
        if (!Array.from(loggedUsers.values()).find(loggedUser => loggedUser === user.name)) {
            var userConnection = api.logIn(user.name, user.password);
            if (userConnection) {
                loggedUsers.set(socket.id, userConnection);

                console.log('Log in : User \033[33m' + socket.id + '\033[0m logged in as \033[33m' + userConnection.name + '\033[0m');
            }
            socket.emit('logIn', userConnection);
        } else {
            socket.emit('notification', {
                type: 'error',
                message: 'ERROR : This user is already logged'
            });
        }
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