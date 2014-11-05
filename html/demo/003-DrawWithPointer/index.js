require("tgd").init();
var x, y;


function main() {
    var ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.draw = draw;
}


function draw() {
    var btn = this.mouseButtons[0];
    if (btn == 1) {
        x = this.pointerX;
        y = this.pointerY;
    }
    else if (btn > 1) {
        var ctx = this.context;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = this.pointerX;
        y = this.pointerY;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    if (this.mouseButtons[2] > 0) {
        this.draw = main;
    }
}
