class CanvasDisplay {
    constructor(nickname) {
        this.frame = 0;
        this.debugMode = true;
        this.nickname = nickname;

        this.redImg = document.createElement("img");
        this.redImg.src = "../img/red.png";
        this.blueImg = document.createElement("img");
        this.blueImg.src = "../img/blue.png";
        this.tileImg = document.createElement("img");
        this.tileImg.src = "../img/tile.png";

        this.update = game => {
            let cx = this.cx;
            let zoom = 3;
            cx.lineWidth = zoom;
            cx.save();
            cx.scale(zoom, zoom);

            let player = game.users.find(user => user.name === this.nickname);

            // viewport
            let viewport = {};
            viewport.width = 640;
            viewport.height = 480;
            viewport.top = -player.pos.x;
            viewport.left = -player.pos.y;
            viewport.xOffset = viewport.top % 1;
            viewport.yOffset = viewport.left % 1;

            // background
            cx.fillStyle = '#1122';
            cx.fillRect(0, 0, this.canvas.width / zoom, this.canvas.height / zoom);

            cx.translate(
                this.canvas.width / zoom / 2 + viewport.top,
                this.canvas.height / zoom / 2 + viewport.left
            );

            cx.fillStyle = '#222';
            cx.fillRect(
                0, 0,
                viewport.width, viewport.height
            );
            for (let x = 0; x < viewport.width; x+=16) {
                for (let y = 0; y < viewport.height; y+=16) {
                    cx.drawImage(this.tileImg,
                        0, 0, 16, 16,
                        x, y, 16, 16,
                    );
                }
            }

            //bullets
            cx.fillStyle = '#fff';
            cx.strokeStyle = '#0ff';
            game.bullets.forEach(bullet => {
                cx.beginPath();
                cx.arc(
                    bullet.pos.x + bullet.size.x / 2,
                    bullet.pos.y + bullet.size.y / 2,
                    bullet.size.x / 2,
                    0, 2 * Math.PI
                );
                cx.fill();
                cx.stroke();
            });
            
            //players
            game.users.forEach(user => {
                let posX = 1;
                if (user.dir.x === 0) {
                    if (user.dir.y === -1) posX = 3;
                    else posX = 1;
                }
                else if (user.dir.x === -1) posX = 0;
                else if (user.dir.x === 1) posX = 2;
                cx.globalAlpha = user.active ? 1 : 0.25;
                cx.drawImage(user.team === "red" ? this.redImg : this.blueImg,
                    posX * 16, 0, 16, 16,
                    user.pos.x, user.pos.y,
                    user.size.x, user.size.y,
                );
                cx.globalAlpha = 1;

                cx.fillStyle = "#fff";
                cx.textAlign = 'center';
                cx.font = 12 + 'px sans-serif';
                cx.fillText(user.name,
                    user.pos.x + user.size.x / 2,
                    user.pos.y - 8
                );
            });

            this.frame++;

            cx.restore();
        };

        this.flipHorizontally = around => {
            this.cx.translate(around, 0);
            this.cx.scale(-1, 1);
            this.cx.translate(-around, 0);
        };

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext('2d');
        this.resize = () => {
            this.canvas.width = innerWidth;
            this.canvas.height = innerHeight;
            this.cx.imageSmoothingEnabled = false;
        }
        this.resize();
        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.canvas);
    }
}