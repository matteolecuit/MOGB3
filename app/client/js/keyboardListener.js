class KeyboardListener {
    constructor() {
        this.keyCodes = new Map([
            [81, "left"],
            [90, "up"],
            [68, "right"],
            [83, "down"],
            [79, "a"],
            [80, "b"]
        ]);

        this.listen = socket => {
            var pressed = new Map();
            this.keyCodes.forEach(code => pressed.set(code, false));
            var handler = event => {
                if (this.keyCodes.get(event.keyCode) !== undefined) {
                    var down = event.type === "keydown";
                    pressed.set(this.keyCodes.get(event.keyCode), down);
                    event.preventDefault();
                }
                var inputs = {};
                pressed.forEach((value, key) => inputs[key] = value);
                socket.emit('inputs', inputs);
            };
            addEventListener("keydown", handler);
            addEventListener("keyup", handler);
        };
    }
}