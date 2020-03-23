class Application {
    constructor() {
        this.socket = io();

        this.serverData = null;

        this.display = new Display(this.socket);

        this.setupSocket = () => {

            this.socket.on('notification', notification => {
                this.display.sendNotification(notification.type, notification.message);
            });

            this.socket.on('authPage', () => {
                this.display.showAuthScreen();
            });

            this.socket.on('newsPage', news => {
                this.display.showHomeScreen(news);
            });

            this.socket.on('playPage', () => {
                this.display.showTitleScreen();
            });

            this.socket.on('rankingsPage', rankings => {
                this.display.showRankingsScreen(rankings);
            });

            this.socket.on('aboutPage', () => {
                this.display.showAboutScreen();
            });

            this.socket.on('profilePage', user => {
                this.display.user = user;
                this.display.showProfileScreen(user);
            });

            this.socket.on("roomList", roomList => {
                this.display.showRoomList(roomList);
            });

            this.socket.on("createRoom", name => {
                this.socket.emit('requestJoinRoom', name);
            });

            this.socket.on("room", room => {
                this.display.showRoom(room);
            });

            this.socket.on("startGame", room => {
                this.display.startGame(room);

                var keyboardListener = new KeyboardListener();
                this.gameLoop = setInterval(() => {
                    this.socket.emit("requestInputs", {
                        inputs: keyboardListener.keys,
                        roomName: room.name
                    });
                }, 1000 / 60);
            });

            this.socket.on("updateGame", room => {
                this.display.canvas.update(room);
            });

            this.socket.on("endGame", room => {
                clearInterval(this.gameLoop);
                this.display.showRoom(room);
            });

            this.socket.on("leaveRoom", name => {
                this.display.getRoomList();
            });

            this.socket.on("logIn", user => {
                if (user) {
                    this.display.user = user;
                    this.display.showTitleScreen();
                } else {
                    this.display.showAuthScreen();
                    this.display.sendNotification('error', 'ERROR : login failed');
                }
            })

            this.socket.on("logOut", () => {
                this.display.user = null;
                this.display.showTitleScreen();
            });

            this.socket.on("connect_failed", () => {
                this.socket.close();
                alert("Disconnected");
            });

            this.socket.on("disconnect", () => {
                this.socket.close();
                alert("Disconnected");
            });
        }

        this.init = () => {
            this.setupSocket();
            this.display.showTitleScreen();
        }
    }
}