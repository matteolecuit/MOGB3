class Room {
    constructor(name, admin) {
        this.name = name;
        this.admin = admin;
        this.users = new Map();
        this.size = 8;
    }
}
module.exports = Room;