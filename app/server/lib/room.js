class Room {
    constructor(name, admin) {
        this.name = name;
        this.admin = admin;
        this.users = new Map();
    }
}
module.exports = Room;