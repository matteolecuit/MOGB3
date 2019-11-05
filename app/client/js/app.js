class Application {
    constructor() {
        this.socket = io();

        this.setupSocket = () => {

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
        }
    }
}