class Application {
    constructor() {
        this.socket = io();

        this.serverData = null;

        this.display = new Display(this.socket);
        
        this.keyboardListener = new KeyboardListener();

        this.setupSocket = () => {

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

            this.socket.on("leaveRoom", name => {
                this.display.getRoomList();
            });

            this.socket.on("logIn", user => {
                if (user) {
                    this.display.user = user;
                    this.display.showTitleScreen();
                }
                else this.display.showAuthScreen();
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

            // this.keyboardListener.listen(this.socket);
        }

        this.init = () => {
            this.setupSocket();
            this.display.showTitleScreen();
        }
    }
}