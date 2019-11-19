var database = {
    users: [
        {
            id:'id0',
            name: 'admin',
            password: 'password',
            pfp:0,
            playCount:0,
            winCount:0,
            experience: 0,
            score:0,
        },
        {
            id:'id1',
            name: 'John',
            password: 'password',
            pfp:0,
            playCount:7,
            winCount:5,
            experience: 0,
            score:10,
        },
        {
            id:'id2',
            name: 'Adrien',
            password: 'password',
            pfp:0,
            playCount:12,
            winCount:5,
            experience: 0,
            score:7,
        }
    ],
    news: [
        {
            title: 'Wow ! A title !',
            content: 'Wait... What is that ? Content !?',
            date: 'October 20, 2019'
        },
        {
            title: 'Well there is another...',
            content: 'Wait... Again !?',
            date: 'September 14, 2019'
        },
        {
            title: 'Lorem Ipsum',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: 'February 27, 1500'
        },
        {
            title: 'Lorem Ipsum',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: 'February 27, 1500'
        },
    ],
    // games: [],
    // logs: []
}

module.exports = {
    register: (username, password) => {
        database.users.push({
            id: 'id' + database.length,
            name: username,
            password: password,
            pfp:0,
            playCount:0,
            winCount:0,
            experience: 0,
            score:0,
        });
    },
    logIn: (name, password) => {
        var result = null;
        database.users.forEach(user => {
            if (user.name === name && user.password === password) result = user;
        });
        if (result) {
            return {
                id: result.id,
                name: result.name,
                pfp: result.pfp
            };
        }
        else return null;
    },
    getUser: id => {
        return database.users.find(user => user.id === id) || null;
    },
    updateUserPersonalInfos: (id, newName, newPassword, newPfp) => {
        var user = database.users.find(user => user.id === id);
        if (user) {
            if (newName && !database.users.find(user => user.name === newName)) user.name = newName;
            if (newPassword) user.password = newPassword;
            if (newPfp || newPfp === 0) user.pfp = newPfp;
        }
    },
    updateUserGameInfos: (id, newPlayCount, newWinCount, newExperience, newScore) => {
        var user = database.users.find(user => user.id === id);
        if (user) {
            user.playCount = newPlayCount;
            user.winCount = newWinCount;
            user.experience = newExperience;
            user.score = newScore;
        }
    },
    getNews: () => {
        return database.news;
    },
    getRankings: () => {
        return database.users.sort((a, b) => b.score - a.score);
    },
};