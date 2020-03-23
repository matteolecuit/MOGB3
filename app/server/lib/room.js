class Room {
    constructor(name, admin) {
        this.name = name;
        this.admin = admin;
        this.users = new Map();
        this.open = true;
        this.size = 8;
    }
}
module.exports = Room;