require("tgd").init();
var x, y;
var dessiner = false;

function main() {
    this.addListener("tap3", onTap3);
    this.addListener("touchstart", onTouchstart);
    this.addListener("touchend", onTouchend);
    this.draw = clear;
}

function onTap3() {
    this.draw = clear;
}

function onTouchstart() {
    x = this.pointerX;
    y = this.pointerY;
    dessiner = true;
}

function onTouchend() {
    dessiner = false;
}

function clear() {
    var ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.draw = draw;
}

function draw() {
    if (dessiner) {
        var ctx = this.context;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(x, y);
        x = this.pointerX;
        y = this.pointerY;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}
