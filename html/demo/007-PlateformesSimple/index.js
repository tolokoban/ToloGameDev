var TGD = require("tgd");
TGD.init();
var TiledMap = require("tgd.tiled-map");
var MobilImage = require("tgd.mobil-image");
var Keyboard = require("tgd.keyboard");


var decor = {
    wall1: new MobilImage({img: "wall1"}),
    wall2: new MobilImage({img: "wall2"})
};

var P = function(i, j, w, h) {
    return i % 2 ? "wall1" : "wall2";
};

var tableau1 = [
        [P, 0, 14, 40]
];

var map = new TiledMap(
    {
        tileWidth: 32,
        tileHeight: 32,
        cols: 40,
        rows: 15
    }
);
var beginTime = null;
var arthur;

function main() {
    var ctx = this.context;
    this.loadImages(
        {
            wall1: "wall1.png",
            wall2: "wall2.png",
            ghost: "ghost.png",
            arthur: "arthur.png",
            arthurMove1: "arthur-run1.png",
            arthurMove2: "arthur-run2.png",
            arthurJump: "arthur-jump.png"
        }
    );
    map.mapWidth = ctx.canvas.width;
    map.mapHeight = ctx.canvas.height;
    this.draw = null;
    this.addListener("tap", onTap);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillText("Click!", 10, 10);
}

function onTap() {
    var ctx = this.context;
    this.draw = loop;
    this.removeListener("tap", onTap);
    arthur = new MobilImage(
        {
            img: {
                stop: "arthur",
                move: ["arthurMove1", "arthurMove2"],
                jump: "arthurJump"
            },
            x: 1 * ctx.canvas.width / 4,
            y: 3 * ctx.canvas.height / 4,
            move: moveArthur
        }
    );

    map.add(arthur);
    map.setTarget(arthur, arthur.x, arthur.y);
    map.initTiles(decor, tableau1);
    map.origX = 0;
    map.origY = 0;
    this.add(map);
}

function moveArthur(runtime) {
    var tileDown = map.getTileAtXY(this.x, this.y + 16);
    if (this.jump) {
        // Arthur est en l'air.
        this.mode = "jump";
        if (tileDown) {
            this.sy = 0;
            this.sx = 0;
            this.ax = 0;
            this.ay = 0;
            this.jump = false;
            this.y = 16 + map.tileHeight * Math.floor(this.y / map.tileHeight);
        }
        // Limiter la vitesse max de chute.
        if (this.sy > 400) this.sy = 400;
        if (this.sx > 200) this.sx = 200;
        if (this.sx < -200) this.sx = -200;
    } else {
        // Arthur a les pieds au sol.
        this.mode = "stop";
        if (Keyboard.isPressed(Keyboard.RIGHT)) {
            this.ax = 200;
            this.flipX = false;
            this.mode = "move";
        }
        else if (Keyboard.isPressed(Keyboard.LEFT)) {
            this.ax = -200;
            this.flipX = true;
            this.mode = "move";
        }
        else {
            this.sx = 0;
        }
        if (tileDown) {
            // Le sol ferme : on peut sauter.
            if (Keyboard.isPressed(Keyboard.UP)) {
                this.ay = 350;
                this.sy = -250;
                this.jump = 1;
            }
        } else {
            // Rien sous les pieds : arthur tombe.
            this.jump = true;
            this.vy = 0;
            this.ay = 350;
        }
    }
    // Limiter les mouvements à la taille du tableau.
    if (this.x < 16) this.x = 16;
    if (this.x > map.cols * map.tileWidth - 16) this.x = map.cols * map.tileWidth - 16;
    if (this.y < 16) this.y = 16;
    if (this.y > map.rows * map.tileHeight - 16) this.y = map.rows * map.tileHeight - 16;
}

function loop() {
    var ctx = this.context;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
