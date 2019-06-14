var MobilImage = require("tgd.mobil-image");
require("tgd").init();

var x, y;


function main() {
    var ctx = this.context;
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    x = w / 2;
    y = h / 2;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.font = "bold 40pt monospace";
    ctx.fillText("Click!", 10, 40);
    this.addListener("tap", onTap);
    this.draw = wait;
}

function onTap() {
    this.removeListener("tap", onTap);
    this.loadImages(
        {
            back: "background.jpg",
            cyberlab: "cyberlab.png"
        },
        onLoad
    );
}

function attractor(runtime) {
    this.gotoAtSpeed(runtime.pointerX, runtime.pointerY, 100);
    this.flipX = (this.x < runtime.pointerX);
}

function onLoad() {
    this.draw = start;
    var cyberlab = new MobilImage(
        {
            x: x,
            y: y,
            img: "cyberlab",
            move: attractor
        }
    );
    this.addMobil(cyberlab);
}

function wait() {}


function start() {
    var ctx = this.context;
    ctx.drawImage(this.getImage("back"), 0, 0);
}
