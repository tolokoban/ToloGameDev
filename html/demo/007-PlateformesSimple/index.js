var TiledMap = require("tgd.tiled-map");
var MobilImage = require("tgd.mobil-image");
var Keyboard = require("tgd.keyboard");



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

function init() {
    this.clear();
    var ctx = this.context;
    this.loadImages(
        {
            skull: "skull.png",
            moon: "moon.png",
            rip: "rip.png",
            wall1: "wall1.png",
            wall2: "wall2.png",
            ghost: "ghost.png",
            arthur: "arthur.png",
            arthurMove1: "arthur-run1.png",
            arthurMove2: "arthur-run2.png",
            arthurJump: "arthur-jump.png"
        },
        onLoaded
    );
    map.mapWidth = ctx.canvas.width;
    map.mapHeight = ctx.canvas.height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

require("tgd").init(init);



function onLoaded() {
    var ctx = this.context;
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
    var decor = window.Tableaux[0].decor;
    map.initTiles(decor);
    map.origX = 0;
    map.origY = 0;
    this.add(map);
    this.start(loop);
}

function moveArthur(runtime) {
    var tile = map.getTileAtXY(this.x, this.y);
    if (tile && tile.type == -1) {
        alert("T'es mort !");
        init.call(runtime);
        return;
    }
    var tileDown = map.getTileAtXY(this.x, this.y + 16);
    var tileRight = map.getTileAtXY(this.x + 16, this.y);
    var tileLeft = map.getTileAtXY(this.x - 16, this.y);
    if (this.jump) {
        // Arthur est en l'air.
        this.mode = "jump";
        if (tileDown && tileDown.type == 1) {
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
        if (this.sx > 0 && tileRight && tileRight.type == 1) {
            this.ax = 0;
            this.sx = 0;
        }
        if (this.sx < 0 && tileLeft && tileLeft.type == 1) {
            this.ax = 0;
            this.sx = 0;
        }
        if (tileDown && tileDown.type == 1) {
            // Le sol ferme : on peut sauter.
            if (Keyboard.isPressed(Keyboard.UP)) {
                this.ay = 350;
                this.sy = -250;
                this.jump = 1;
            } else {
                this.jump = 0;
                this.ay = 0;
                this.sy = 0;
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
    ctx.drawImage(this.getImage("moon"), ctx.canvas.width - 64, 8);
}
