class CanvasDisplay {
    constructor() {
        this.frame = 0;
        this.zoom = 1;
        this.debugMode = true;

        this.update = game => {
            this.frame++;

            this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.cx.fillStyle = '#0f0';
            game.bullets.forEach(bullet => {
                this.cx.fillRect(bullet.pos.x * this.zoom, bullet.pos.y * this.zoom, bullet.size.x * this.zoom, bullet.size.y * this.zoom);
            });
            
            game.users.forEach(user => {
                this.cx.fillStyle = user.active ? user.team === 'blue' ? '#00f' : '#f00' : '#8888';
                this.cx.fillRect(user.pos.x * this.zoom, user.pos.y * this.zoom, user.size.x * this.zoom, user.size.y * this.zoom);
            });
        };

        this.flipHorizontally = around => {
            this.cx.translate(around, 0);
            this.cx.scale(-1, 1);
            this.cx.translate(-around, 0);
        };

        this.resize = () => {
            if (innerWidth >= 1920 && innerHeight >= 1080) {
                this.zoom = 4;
                this.cx.scale(this.zoom, this.zoom);
                this.canvas.width = 1920;
                this.canvas.height = 1080;
            } else if (innerWidth >= 1440 && innerHeight >= 810) {
                this.zoom = 3;
                this.cx.scale(this.zoom, this.zoom);
                this.canvas.width = 1440;
                this.canvas.height = 810;
            } else if (innerWidth >= 960 && innerHeight >= 540) {
                this.zoom = 2;
                this.cx.scale(this.zoom, this.zoom);
                this.canvas.width = 960;
                this.canvas.height = 540;
            } else {
                this.zoom = 1;
                this.cx.scale(this.zoom, this.zoom);
                this.canvas.width = 480;
                this.canvas.height = 270;
            }
            this.cx.imageSmoothingEnabled = false;
        };

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.canvas);
    }
}