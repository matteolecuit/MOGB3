module.exports = {
    validKeys: keys => {
        if (keys.left && keys.right) {
            keys.left = false;
            keys.right = false;
        }
        if (keys.up && keys.down) {
            keys.down = false;
            keys.up = false;
        }
        return keys;
    },
    sameKeys: (keys1, keys2) => {
        if (keys1.left !== keys2.left ||
            keys1.right !== keys2.right ||
            keys1.up !== keys2.up ||
            keys1.down !== keys2.down ||
            keys1.a !== keys2.a ||
            keys1.b !== keys2.b
        ) return false;
        else return true;
    },
    is: (value, array) => {
        var result = false;
        array.forEach(element => result = value === element ? true : result);
        return result;
    },
    getRoomData: room => {
        var userList = [];
        room.users.forEach(user => userList.push({
            name: user.name,
            team: user.team
        }));

        return {
            name: room.name,
            users: userList,
            admin: room.admin.name
        }
    },
    getRoomListData: rooms => {
        var newRooms = [];
        rooms.forEach(room => {
            var userList = [];
            room.users.forEach(user => userList.push({
                name: user.name,
                team: user.team
            }));

            newRooms.push({
                name: room.name,
                users: userList,
                admin: room.admin.name
            });
        });
        return newRooms;
    }
};