class User {
    constructor(socket, name) {
        this.socket = socket;
        this.name = name;
        this.team = null;
    }
}
module.exports = User;