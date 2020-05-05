class User {
    constructor(socket, name) {
        this.socket = socket;
        this.name = name;
        this.pfp = 0;
        this.team = null;
        this.active = true;
        this.bullets = [];
        this.speed = {
            x: 2,
            y: 2
        };
        this.dir = {
            x:0,
            y:1
        };
        this.inputs = {};
        this.size = {
            x:16,
            y:16
        };
        this.pos = {
            x:Math.floor(Math.random() * (640 - this.size.x)),
            y:Math.floor(Math.random() * (480 - this.size.y))
        };
    }
}
module.exports = User;