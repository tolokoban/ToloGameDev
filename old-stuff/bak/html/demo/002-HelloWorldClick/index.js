require("tgd").init();

function main() {
    var ctx = this.context;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '80pt serif';
    ctx.fillStyle = "black";
    ctx.fillText("Hello", 20, 80);
    if (this.mouseButtons[0] > 0) {
        this.draw = world;
    }
}

function world() {
    var ctx = this.context;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '80pt serif';
    ctx.fillStyle = "white";
    ctx.fillText("World", 20, 80);
    if (this.mouseButtons[0] < 0) {
        this.draw = main;
    }
}
