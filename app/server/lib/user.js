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
        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            x:16,
            y:16
        };
    }
}
module.exports = User;