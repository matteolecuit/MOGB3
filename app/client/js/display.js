class Display {
    constructor(socket) {
        this.socket = socket;

        this.user = null;
        this.nickname = null;
        this.selectedRoom = null;
        this.canvas = null;

        //
        // Header
        //

        this.sendNotification = (type, text) => {
            var notification = document.createElement("p");
            notification.className = 'notif notif-' + type;
            notification.innerHTML = text;

            document.body.appendChild(notification);

            setTimeout(() => {
                var notif = document.getElementsByClassName('notif');
                if (notif.length > 0) notif[0].remove();
            }, 3000);
        }

        this.resetScreen = () => {
            document.body.innerHTML = "";

            var header = document.createElement("header");

            var homeButton = document.createElement("button");
            homeButton.innerHTML = 'News';
            homeButton.id = 'header1';
            homeButton.onclick = () => this.socket.emit('requestNewsPage');

            var playButton = document.createElement("button");
            playButton.innerHTML = 'Play';
            playButton.id = 'header2';
            playButton.onclick = () => this.socket.emit('requestPlayPage');

            var rankingsButton = document.createElement("button");
            rankingsButton.innerHTML = 'Rankings';
            rankingsButton.id = 'header3';
            rankingsButton.onclick = () => this.socket.emit('requestRankingsPage');

            var aboutButton = document.createElement("button");
            aboutButton.innerHTML = 'About';
            aboutButton.id = 'header4';
            aboutButton.onclick = () => this.socket.emit('requestAboutPage');

            var profilRound = document.createElement("button");
            profilRound.id = 'profilRound';

            header.appendChild(profilRound);
            header.appendChild(homeButton);
            header.appendChild(playButton);
            header.appendChild(rankingsButton);
            header.appendChild(aboutButton);
            document.body.appendChild(header);

            if (this.user) {
                profilRound.style.backgroundImage = 'url(../img/pfp' + this.user.pfp + '.png)';
                profilRound.onclick = () => this.socket.emit('requestProfilePage', this.user.id);

                var logOutBtn = document.createElement("button");
                logOutBtn.innerHTML = 'Log Out';
                logOutBtn.id = 'header5';
                logOutBtn.className = 'rightElement';
                logOutBtn.onclick = () => this.socket.emit('requestLogOut');

                header.appendChild(logOutBtn);

            } else {
                profilRound.style.backgroundImage = 'url(../img/pfp0.png)';
                profilRound.onclick = () => this.socket.emit('requestAuth');

                var authButton = document.createElement("button");
                authButton.innerHTML = 'Login / Register';
                authButton.id = 'header5';
                authButton.className = 'rightElement';
                authButton.onclick = () => this.socket.emit('requestAuth');

                header.appendChild(authButton);
            }
        }

        //
        // Auth
        //

        this.logIn = () => {
            var name = document.getElementById('nameInputLogIn').value;
            var password = document.getElementById('passwordInputLogIn').value;

            if (name && name.length > 0 && name.length < 15 && password && password.length > 0) {
                this.socket.emit('requestLogIn', {
                    name: name,
                    password: password
                });
            } else if (!name || name.length <= 0 || name.length >= 15) {
                this.sendNotification('error', 'ERROR : incorrect username');
            } else if (!password || password.length <= 0) {
                this.sendNotification('error', 'ERROR : incorrect password');
            }
        }

        this.register = () => {
            var name = document.getElementById('nameInputRegister').value;
            var password = document.getElementById('passwordInputRegister').value;
            var confirmPassword = document.getElementById('confirmPasswordInputRegister').value;

            if (name && name.length > 0 && name.length < 15 && password && password.length > 0 &&
                confirmPassword && confirmPassword.length > 0 && password === confirmPassword) {
                this.socket.emit('requestRegister', {
                    name: name,
                    password: password
                });
            } else if (!name || name.length <= 0 || name.length >= 15) {
                this.sendNotification('error', 'ERROR : incorrect username');
            } else if (!password || password.length <= 0) {
                this.sendNotification('error', 'ERROR : incorrect password');
            } else if (password !== confirmPassword) {
                this.sendNotification('error', 'ERROR : confirmation password does not match');
            }
        }

        this.showAuthScreen = () => {
            this.resetScreen();

            var container = document.createElement("div");
            container.id = "container";

            var leftContainer = document.createElement("div");
            leftContainer.id = "leftContainer";
            leftContainer.className = 'formContainer';

            var title1 = document.createElement("p");
            title1.className = 'formTitle';
            title1.innerHTML = "Login";

            var nameInputLogIn = document.createElement("input");
            nameInputLogIn.id = "nameInputLogIn";
            nameInputLogIn.type = "text";
            nameInputLogIn.placeholder = "Username";
            nameInputLogIn.maxLength = 15;

            var passwordInputLogIn = document.createElement("input");
            passwordInputLogIn.id = "passwordInputLogIn";
            passwordInputLogIn.type = "password";
            passwordInputLogIn.placeholder = "Password";
            passwordInputLogIn.maxLength = 256;

            var LogInBtn = document.createElement("button");
            LogInBtn.className = "formBtn";
            LogInBtn.innerHTML = "Login";
            LogInBtn.onclick = () => this.logIn();

            var rightContainer = document.createElement("div");
            rightContainer.id = "rightContainer";
            rightContainer.className = 'formContainer';

            var title2 = document.createElement("p");
            title2.className = 'formTitle';
            title2.innerHTML = "Register";

            var nameInputRegister = document.createElement("input");
            nameInputRegister.id = "nameInputRegister";
            nameInputRegister.type = "text";
            nameInputRegister.placeholder = "Username";
            nameInputRegister.maxLength = 15;

            var passwordInputRegister = document.createElement("input");
            passwordInputRegister.id = "passwordInputRegister";
            passwordInputRegister.type = "password";
            passwordInputRegister.placeholder = "Password";
            passwordInputRegister.maxLength = 256;

            var confirmPasswordInputRegister = document.createElement("input");
            confirmPasswordInputRegister.id = "confirmPasswordInputRegister";
            confirmPasswordInputRegister.type = "password";
            confirmPasswordInputRegister.placeholder = "Confirm password";
            confirmPasswordInputRegister.maxLength = 256;

            var RegisterBtn = document.createElement("button");
            RegisterBtn.className = "formBtn";
            RegisterBtn.innerHTML = "Register";
            RegisterBtn.onclick = () => this.register();

            leftContainer.appendChild(title1);
            leftContainer.appendChild(nameInputLogIn);
            leftContainer.appendChild(passwordInputLogIn);
            leftContainer.appendChild(LogInBtn);
            rightContainer.appendChild(title2);
            rightContainer.appendChild(nameInputRegister);
            rightContainer.appendChild(passwordInputRegister);
            rightContainer.appendChild(confirmPasswordInputRegister);
            rightContainer.appendChild(RegisterBtn);
            container.appendChild(leftContainer);
            container.appendChild(document.createElement("hr"));
            container.appendChild(rightContainer);
            document.body.appendChild(container);
        }

        //
        // Pofile
        //

        this.updateUser = (user, selectedImg) => {
            var newname = document.getElementById('nameInput').value;
            var newpassword = document.getElementById('passwordInput').value;
            var confirmPassword = document.getElementById('confirmPasswordInput').value;

            if (!(!newname && !newpassword && !selectedImg && selectedImg !== 0) &&
                (!newname || newname && newname.length > 0 && newname.length < 15) &&
                ((!newpassword && !confirmPassword) || (newpassword && newpassword.length > 0 &&
                    confirmPassword && confirmPassword.length > 0 && newpassword === confirmPassword))) {
                this.socket.emit('requestUpdateUser', {
                    id: user.id,
                    newname: newname,
                    newpassword: newpassword,
                    newPfp: selectedImg
                });
            } else if (newname && (name.length <= 0 || name.length >= 15)) {
                this.sendNotification('error', 'ERROR : incorrect new username');
            } else if (newpassword && password.length <= 0) {
                this.sendNotification('error', 'ERROR : incorrect new password');
            } else if (newpassword !== confirmPassword) {
                this.sendNotification('error', 'ERROR : confirmation password does not match');
            } else if (!newname && !newpassword && !selectedImg) {
                this.sendNotification('error', 'ERROR : no changes detected');
            }
        }

        this.showProfileScreen = user => {
            this.resetScreen();
            document.getElementById("profilRound").className = 'headerSelected';

            var container = document.createElement("div");
            container.id = "container";
            container.className = 'column heightMax';

            var title = document.createElement("p");
            title.id = "title";
            title.innerHTML = "Profile";

            var logoImg = document.createElement("img");
            logoImg.id = 'logoImg';
            logoImg.src = "../img/logo.png";

            var subtitle = document.createElement("p");
            subtitle.id = "subtitle";
            subtitle.innerHTML = "Everything about you in MOGB3.";

            var profileContainer = document.createElement("div");
            profileContainer.id = "profileContainer";

            var profileInfos = document.createElement("p");
            profileInfos.id = "profileInfos";
            profileInfos.innerHTML =
                "<p>Username : " + user.name + "</p>" +
                "<p>PlayCount : " + user.playCount + "</p>" +
                "<p>WinCount : " + user.winCount + "</p>" +
                "<p>Experience : " + user.experience + "</p>" +
                "<p>Score : " + user.score + "</p>";

            var profileLeft = document.createElement("div");
            profileLeft.id = "profileLeft";

            var profileRight = document.createElement("div");
            profileRight.id = "profileRight";

            var selectedImg = null;
            for (let i = 0; i < 16; i++) {
                var profileImage = document.createElement("img");
                profileImage.id = 'pfp' + i;
                profileImage.src = "../img/pfp" + i + ".png";
                profileImage.draggable = false;
                profileImage.onclick = () => {
                    Array.from(document.getElementsByClassName("imgSelected")).forEach(item => item.classList.remove("imgSelected"));
                    document.getElementById('pfp' + i).className = 'imgSelected';
                    selectedImg = i;
                }

                profileRight.appendChild(profileImage);
            }

            var nameInput = document.createElement("input");
            nameInput.id = "nameInput";
            nameInput.type = "text";
            nameInput.placeholder = "New Username";
            nameInput.maxLength = 15;

            var passwordInput = document.createElement("input");
            passwordInput.id = "passwordInput";
            passwordInput.type = "password";
            passwordInput.placeholder = "New Password";
            passwordInput.maxLength = 256;
            passwordInput.autocomplete = "new-password";

            var confirmPasswordInput = document.createElement("input");
            confirmPasswordInput.id = "confirmPasswordInput";
            confirmPasswordInput.type = "password";
            confirmPasswordInput.placeholder = "Confirm Password";
            confirmPasswordInput.maxLength = 256;
            confirmPasswordInput.autocomplete = "new-password";

            var updateUserBtn = document.createElement("button");
            updateUserBtn.id = "updateUserBtn";
            updateUserBtn.innerHTML = "Update Profile";
            updateUserBtn.onclick = () => this.updateUser(user, selectedImg);

            title.appendChild(logoImg);
            container.appendChild(title);
            container.appendChild(subtitle);
            profileContainer.appendChild(profileInfos);
            profileLeft.appendChild(nameInput);
            profileLeft.appendChild(passwordInput);
            profileLeft.appendChild(confirmPasswordInput);
            profileContainer.appendChild(profileLeft);
            profileContainer.appendChild(profileRight);
            container.appendChild(profileContainer);
            container.appendChild(updateUserBtn);
            document.body.appendChild(container);
        }

        //
        // News
        //

        this.showHomeScreen = news => {
            this.resetScreen();
            document.getElementById("header1").className = 'headerSelected';

            var container = document.createElement("div");
            container.id = "container";
            container.className = 'column heightMax';

            var title = document.createElement("p");
            title.id = "title";
            title.innerHTML = "News";

            var logoImg = document.createElement("img");
            logoImg.id = 'logoImg';
            logoImg.src = "../img/logo.png";

            var subtitle = document.createElement("p");
            subtitle.id = "subtitle";
            subtitle.innerHTML = "The latest news about MOGB3.";

            title.appendChild(logoImg);
            container.appendChild(title);
            container.appendChild(subtitle);

            news.forEach(article => {
                var articleElement = document.createElement("div");
                articleElement.className = 'news';
                articleElement.innerHTML =
                    "<div class='title'>" + article.title + "</div>" +
                    "<div class='date'>" + article.date + "</div>" +
                    "<div class='content'>" + article.content + "</div>";
                container.appendChild(articleElement);
            });

            document.body.appendChild(container);
        }

        //
        // Play
        //

        //
        // Title Screen
        //

        this.joinServer = () => {
            var name = document.getElementById('nicknameInput').value;
            if (name && name.length > 0 && name.length <= 15) {
                this.nickname = name;
                this.socket.emit('join', name);
                this.getRoomList(this.socket);
            } else {
                this.sendNotification('error', 'ERROR : incorrect nickname');
            }
        }

        this.showTitleScreen = () => {
            this.resetScreen();
            document.getElementById("header2").className = 'headerSelected';

            var startMenu = document.createElement("div");
            startMenu.id = "container";
            startMenu.className = 'column';

            var startTitle = document.createElement("p");
            startTitle.id = "title";
            startTitle.innerHTML = "MOGB3";

            var logoImg = document.createElement("img");
            logoImg.id = 'logoImg';
            logoImg.src = "../img/logo.png";

            var startSubtitle = document.createElement("p");
            startSubtitle.id = "subtitle";
            startSubtitle.innerHTML = "The best online game ever.";

            var inputContainer = document.createElement("div");
            inputContainer.id = "inputContainer";

            var nicknameInput = document.createElement("input");
            nicknameInput.id = "nicknameInput";
            nicknameInput.type = "text";
            nicknameInput.placeholder = "Nickname";
            nicknameInput.maxLength = 15;
            nicknameInput.autofocus = true;
            if (this.user) nicknameInput.value = this.user.name;

            var joinServerBtn = document.createElement("button");
            joinServerBtn.id = "startButton";
            joinServerBtn.innerHTML = "Play";
            joinServerBtn.onclick = () => this.joinServer();

            startTitle.appendChild(logoImg);
            startMenu.appendChild(startTitle);
            startMenu.appendChild(startSubtitle);
            inputContainer.appendChild(nicknameInput);
            inputContainer.appendChild(joinServerBtn);
            startMenu.appendChild(inputContainer);
            document.body.appendChild(startMenu);
        }

        //
        // Room List
        //

        this.getRoomList = () => {
            this.selectedRoom = null;
            this.socket.emit('requestRoomList');
        }

        this.selectRoom = room => {

            this.selectedRoom = room.name;
            Array.from(document.getElementsByClassName("selected")).forEach(item => item.classList.remove("selected"));
            document.getElementById(room.name).className = 'selected';
            
            if (room.size > room.users.length) document.getElementById('joinRoom').classList.remove("unselectable");
            else document.getElementById("joinRoom").className = 'unselectable';
            
        }

        this.joinRoom = name => {
            this.selectedRoom = null;
            if (name) this.socket.emit('requestJoinRoom', name);
            else {
                this.sendNotification('error', 'ERROR : incorrect room name');
            }
        }

        this.showRoomList = roomList => {
            this.resetScreen();
            document.getElementById("header2").className = 'headerSelected';

            var playerCount = 0;
            roomList.forEach(room => playerCount += room.users.length);

            var roomsMenu = document.createElement("div");
            roomsMenu.id = "container";

            var roomListInfos = document.createElement("p");
            roomListInfos.id = "roomListInfos";
            roomListInfos.innerHTML = playerCount + " player" + (playerCount !== 1 ? "s" : "") + " in " + roomList.length + " room" + (roomList.length !== 1 ? "s" : "");

            var roomsTable = document.createElement("table");
            roomsTable.id = "roomsTable";

            var roomsTableCaption = document.createElement("caption");
            roomsTableCaption.innerHTML = "Room List";

            var roomsTableThead = document.createElement("thead");
            var roomsTableTheadTr = document.createElement("tr");
            var roomsTableTheadTrTh1 = document.createElement("th");
            roomsTableTheadTrTh1.id = "th1";
            roomsTableTheadTrTh1.innerHTML = "Name";
            var roomsTableTheadTrTh2 = document.createElement("th");
            roomsTableTheadTrTh2.id = "th2";
            roomsTableTheadTrTh2.innerHTML = "Players";
            var roomsTableTheadTrTh3 = document.createElement("th");
            roomsTableTheadTrTh3.id = "th3";
            roomsTableTheadTrTh3.innerHTML = "Pass";

            var roomsTableTbody = document.createElement("tbody");
            roomsTableTbody.id = "roomsTableBody";

            var roomsOptions = document.createElement("div");
            roomsOptions.id = "roomsOptions";

            var joinRoomBtn = document.createElement("button");
            joinRoomBtn.id = "joinRoom";
            joinRoomBtn.className = 'unselectable';
            joinRoomBtn.innerHTML = "Join Room";
            joinRoomBtn.onclick = () => this.joinRoom(this.selectedRoom);

            var createRoomBtn = document.createElement("button");
            createRoomBtn.innerHTML = "Create Room";
            createRoomBtn.onclick = () => this.showCreateRoom();

            var changeNickBtn = document.createElement("button");
            changeNickBtn.innerHTML = "Change Nick";
            changeNickBtn.onclick = () => this.showChangeNick();

            var settingsBtn = document.createElement("button");
            settingsBtn.className = 'unselectable';
            settingsBtn.innerHTML = "Settings";
            // settingsBtn.onclick = () => this.showSettings();

            roomsTableTheadTr.appendChild(roomsTableTheadTrTh1);
            roomsTableTheadTr.appendChild(roomsTableTheadTrTh2);
            roomsTableTheadTr.appendChild(roomsTableTheadTrTh3);
            roomsTableThead.appendChild(roomsTableTheadTr);
            roomsTable.appendChild(roomsTableCaption);
            roomsTableCaption.appendChild(roomListInfos);
            roomsTable.appendChild(roomsTableThead);
            roomsTable.appendChild(roomsTableTbody);
            roomsOptions.appendChild(joinRoomBtn);
            roomsOptions.appendChild(createRoomBtn);
            roomsOptions.appendChild(changeNickBtn);
            roomsOptions.appendChild(settingsBtn);
            roomsMenu.appendChild(roomsTable);
            roomsMenu.appendChild(roomsOptions);
            document.body.appendChild(roomsMenu);

            roomList.forEach(room => {
                var tr = document.createElement("tr");
                tr.id = room.name;
                tr.onclick = () => this.selectRoom(room);
                var td1 = document.createElement("td");
                td1.id = 'td1';
                td1.innerHTML = room.name;
                var td2 = document.createElement("td");
                td2.id = 'td2';
                td2.innerHTML = room.users.length + '/' + room.size;
                var td3 = document.createElement("td");
                td3.id = 'td3';
                td3.innerHTML = 'No';
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                roomsTableTbody.appendChild(tr);
            });
        }

        //
        // ChangeNickname
        //

        this.changeNick = () => {
            var name = document.getElementById('nicknameInput').value;
            if (name && name.length > 0 && name.length <= 15) {
                this.nickname = name;
                this.socket.emit('changeNick', name);
                this.getRoomList(this.socket);
            } else {
                this.sendNotification('error', 'ERROR : incorrect nickname');
            }
        }

        this.showChangeNick = () => {
            this.resetScreen();
            document.getElementById("header2").className = 'headerSelected';

            var startMenu = document.createElement("div");
            startMenu.id = "container";
            startMenu.className = 'column';

            var startTitle = document.createElement("p");
            startTitle.id = "title";
            startTitle.innerHTML = "Change Nickname";

            var inputContainer = document.createElement("div");
            inputContainer.id = "inputContainer";

            var nicknameInput = document.createElement("input");
            nicknameInput.id = "nicknameInput";
            nicknameInput.type = "text";
            nicknameInput.placeholder = "New Nickname";
            nicknameInput.maxLength = 15;
            nicknameInput.autofocus = true;

            var joinServerBtn = document.createElement("button");
            joinServerBtn.id = "startButton";
            joinServerBtn.innerHTML = "Change";
            joinServerBtn.onclick = () => this.changeNick();

            var cancelButton = document.createElement("button");
            cancelButton.id = "cancelButton";
            cancelButton.innerHTML = "Cancel";
            cancelButton.onclick = () => this.getRoomList();

            startMenu.appendChild(startTitle);
            inputContainer.appendChild(nicknameInput);
            inputContainer.appendChild(joinServerBtn);
            startMenu.appendChild(inputContainer);
            startMenu.appendChild(cancelButton);
            document.body.appendChild(startMenu);

            this.socket.emit('requestChangeNick');
        }

        //
        // CreateRoom
        //

        this.createRoom = () => {
            this.selectedRoom = null;
            var name = document.getElementById('roomNameInput').value;
            if (name && name.length > 0 && name.length <= 35) this.socket.emit('requestCreateRoom', name);
            else {
                this.sendNotification('error', 'ERROR : incorrect room name');
            }
        }

        this.showCreateRoom = () => {
            this.resetScreen();
            document.getElementById("header2").className = 'headerSelected';

            var createMenu = document.createElement("div");
            createMenu.id = "container";
            createMenu.className = 'column';

            var createTitle = document.createElement("div");
            createTitle.id = "title";
            createTitle.innerHTML = "Create Room";

            var inputContainer = document.createElement("div");
            inputContainer.id = "inputContainer";

            var roomNameInput = document.createElement("input");
            roomNameInput.id = "roomNameInput";
            roomNameInput.type = "text";
            roomNameInput.placeholder = "Enter room name";
            roomNameInput.value = this.nickname + "'s room";
            roomNameInput.maxLength = 35;
            roomNameInput.autofocus = true;

            var createButton = document.createElement("button");
            createButton.id = "createButton";
            createButton.innerHTML = "Create";
            createButton.onclick = () => this.createRoom();

            var cancelButton = document.createElement("button");
            cancelButton.id = "cancelButton";
            cancelButton.innerHTML = "Cancel";
            cancelButton.onclick = () => this.getRoomList();

            createMenu.appendChild(createTitle);
            inputContainer.appendChild(roomNameInput);
            inputContainer.appendChild(createButton);
            createMenu.appendChild(inputContainer);
            createMenu.appendChild(cancelButton);
            document.body.appendChild(createMenu);
        }

        //
        //"Room"
        //

        // this.showStartGameButton = () => {
        //     var button = document.createElement("button");
        //     button.id = "startGameButton";
        //     button.innerHTML = "Start game";
        //     document.getElementById('startGameButtonContainer').appendChild(button);
        // }

        this.showRoom = room => {
            this.resetScreen();
            document.getElementById("header2").className = 'headerSelected';

            var roomMenu = document.createElement("div");
            roomMenu.id = "container";
            roomMenu.className = 'column';

            var roomTitle = document.createElement("p");
            roomTitle.id = "title";
            roomTitle.innerHTML = room.name;

            var startGameButtonContainer = document.createElement("div");
            startGameButtonContainer.id = "startGameButtonContainer";

            var tableContainer = document.createElement("div");
            tableContainer.id = "tableContainer";

            var redTeamTable = document.createElement("table");
            redTeamTable.id = "redTeamTable";
            redTeamTable.className = 'teamTable';
            var redTeamCaption = document.createElement("caption");
            redTeamCaption.innerHTML = "Red team";
            var redTeamBody = document.createElement("tbody");
            redTeamBody.id = "redTeamBody";
            redTeamBody.onclick = () => this.socket.emit('requestSelectTeam', {
                name: room.name,
                team: 'red'
            });

            var noTeam = document.createElement("table");
            noTeam.id = "noTeam";
            var noTeamsCaption = document.createElement("caption");
            noTeamsCaption.innerHTML = "Choose your team";
            var noTeamsBody = document.createElement("tbody");
            noTeamsBody.id = "noTeamsBody";
            noTeamsBody.onclick = () => this.socket.emit('requestSelectTeam', {
                name: room.name,
                team: null
            });

            var blueTeamTable = document.createElement("table");
            blueTeamTable.id = "blueTeamTable";
            blueTeamTable.className = 'teamTable';
            var blueTeamCaption = document.createElement("caption");
            blueTeamCaption.innerHTML = "Blue team";
            var blueTeamBody = document.createElement("tbody");
            blueTeamBody.id = "blueTeamBody";
            blueTeamBody.onclick = () => this.socket.emit('requestSelectTeam', {
                name: room.name,
                team: 'blue'
            });

            room.users.forEach(user => {
                var tr = document.createElement("tr");
                if (user.team) {
                    var pfpImg = document.createElement("img");
                    pfpImg.className = 'pfpImg';
                    pfpImg.src = "../img/pfp" + user.pfp + ".png";

                    var trName = document.createElement("p");
                    trName.innerHTML = user.name;

                    tr.appendChild(pfpImg);
                    tr.appendChild(trName);
                }
                else tr.innerHTML = user.name;

                if (user.team === 'red') redTeamBody.appendChild(tr);
                else if (user.team === 'blue') blueTeamBody.appendChild(tr);
                else if (user.team === null) noTeamsBody.appendChild(tr);
            });

            var leaveButton = document.createElement("button");
            leaveButton.id = "leaveButton";
            leaveButton.innerHTML = "Leave";
            leaveButton.onclick = () => this.socket.emit('requestLeaveRoom', room.name);

            var startButton = null;
            startButton = document.createElement("button");
            startButton.id = "startRoomButton";
            startButton.innerHTML = "Start";
            startButton.onclick = () => this.socket.emit('requestStartGame', room.name);
            if (!room.users.find(user => user.team === 'red') || !room.users.find(user => user.team === 'blue')) {
                startButton.className = "unselectable";
            }

            redTeamTable.appendChild(redTeamCaption);
            redTeamTable.appendChild(redTeamBody);
            noTeam.appendChild(noTeamsCaption);
            noTeam.appendChild(noTeamsBody);
            blueTeamTable.appendChild(blueTeamCaption);
            blueTeamTable.appendChild(blueTeamBody);
            tableContainer.appendChild(redTeamTable);
            tableContainer.appendChild(noTeam);
            tableContainer.appendChild(blueTeamTable);
            roomMenu.appendChild(roomTitle);
            roomMenu.appendChild(startGameButtonContainer);
            roomMenu.appendChild(tableContainer);
            roomMenu.appendChild(startButton);
            roomMenu.appendChild(leaveButton);
            document.body.appendChild(roomMenu);
        };

        this.startGame = room => {
            document.body.innerHTML = "";
            this.canvas = new CanvasDisplay(this.nickname);
        }

        //
        // Rankings
        //

        this.showRankingsScreen = rankings => {
            this.resetScreen();
            document.getElementById("header3").className = 'headerSelected';

            var container = document.createElement("div");
            container.id = "container";
            container.className = 'column heightMax';

            var title = document.createElement("p");
            title.id = "title";
            title.innerHTML = "Rankings";

            var logoImg = document.createElement("img");
            logoImg.id = 'logoImg';
            logoImg.src = "../img/logo.png";

            var table = document.createElement("table");
            table.id = "rankings";

            var thead = document.createElement("thead");
            thead.id = "thead";

            var trh = document.createElement("tr");

            var tdh0 = document.createElement("td");
            tdh0.innerHTML = '';
            var tdh1 = document.createElement("td");
            tdh1.innerHTML = '';
            var tdh2 = document.createElement("td");
            tdh2.innerHTML = 'Win Rate';
            var tdh3 = document.createElement("td");
            tdh3.innerHTML = 'Play Count';
            var tdh4 = document.createElement("td");
            tdh4.innerHTML = 'Score';

            var tbody = document.createElement("tbody");
            tbody.id = "tbody";

            rankings.forEach((user, i) => {
                var trb = document.createElement("tr");

                var tdb0 = document.createElement("td");
                tdb0.innerHTML = '#' + (i + 1);
                var tdb1 = document.createElement("td");
                tdb1.innerHTML = user.name;
                tdb1.className = 'tableName';
                var tdb2 = document.createElement("td");
                tdb2.innerHTML = user.playCount ? Math.round((user.winCount / user.playCount) * 10000) / 100 + '%' : '-';
                var tdb3 = document.createElement("td");
                tdb3.innerHTML = user.playCount;
                var tdb4 = document.createElement("td");
                tdb4.innerHTML = user.score;

                trb.appendChild(tdb0);
                trb.appendChild(tdb1);
                trb.appendChild(tdb2);
                trb.appendChild(tdb3);
                trb.appendChild(tdb4);
                tbody.appendChild(trb);
            });

            title.appendChild(logoImg);
            trh.appendChild(tdh0);
            trh.appendChild(tdh1);
            trh.appendChild(tdh2);
            trh.appendChild(tdh3);
            trh.appendChild(tdh4);
            thead.appendChild(trh);
            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(title);
            container.appendChild(table);
            document.body.appendChild(container);
        }

        //
        // About
        //

        this.showAboutScreen = () => {
            this.resetScreen();
            document.getElementById("header4").className = 'headerSelected';

            var container = document.createElement("div");
            container.id = "container";
            container.className = 'column';

            var title = document.createElement("p");
            title.id = "title";
            title.innerHTML = "About";

            var logoImg = document.createElement("img");
            logoImg.id = 'logoImg';
            logoImg.src = "../img/logo.png";

            var subtitle = document.createElement("p");
            subtitle.id = "subtitle";
            subtitle.innerHTML = "About the absolute legends behind MOGB3.";

            var samy = document.createElement("p");
            samy.className = 'resume';
            samy.innerHTML = 'Samy Vera<br><br>' +
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

            var matteo = document.createElement("p");
            matteo.className = 'resume';
            matteo.innerHTML = 'Mattéo Lecuit<br><br>' +
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

            title.appendChild(logoImg);
            container.appendChild(title);
            container.appendChild(subtitle);
            container.appendChild(samy);
            container.appendChild(matteo);
            document.body.appendChild(container);
        }
    }
}