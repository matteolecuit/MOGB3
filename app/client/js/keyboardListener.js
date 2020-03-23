class KeyboardListener {
    constructor() {
        this.keys = {};

        this.keyCodes = {
            ArrowLeft: "left",
            ArrowUp: "up",
            ArrowRight: "right",
            ArrowDown: "down",
            w: "a",
            Shift: "b"
        };

        this.handler = event => {
            if (event.key in this.keyCodes) this.keys[this.keyCodes[event.key]] = event.type === "keydown";
        }

        addEventListener("keydown", this.handler);
        addEventListener("keyup", this.handler);
    }
}