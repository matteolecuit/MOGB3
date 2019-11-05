class Application {
    constructor() {
        this.socket = io();

        this.keyboardListener = new KeyboardListener();

        this.setupSocket = () => {

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
        }
    }
}