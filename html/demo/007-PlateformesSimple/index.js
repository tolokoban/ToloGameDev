var TiledMap = require("tgd.tiled-map");
var MobilImage = require("tgd.mobil-image");
var Keyboard = require("tgd.keyboard");

var map;
var beginTime = null;
var arthur;
var progress = 0;

function init() {
    this.draw = loadingImages;
    this.clear();
    var ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.loadImages(
        {
            exit: "exit.png",
            skull: "skull.png",
            moon: "moon.png",
            rip: "rip.png",
            wall: "wall.png",
            wall1: "wall1.png",
            wall2: "wall2.png",
            ghost: "ghost.png",
            arthur: "arthur.png",
            arthurMove1: "arthur-run1.png",
            arthurMove2: "arthur-run2.png",
            arthurJump: "arthur-jump.png"
        },
        onLoaded,
        function(v) {
            progress = v;
        }
    );
}

require("tgd").init(init);

function loadingImages() {
    var ctx = this.context;
    var color = 255 - 255 * progress;
    ctx.fillStyle = this.rgb(color, color, color);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


function onLoaded() {
    var tab = window.Tableaux[0];
    var ctx = this.context;
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    arthur = new MobilImage(
        {
            img: {
                stop: "arthur",
                move: ["arthurMove1", "arthurMove2"],
                jump: "arthurJump"
            },
            x: 1 * w / 4,
            y: 3 * h / 4,
            move: moveArthur
        }
    );
    map = new TiledMap(
        {
            tileWidth: 32,
            tileHeight: 32,
            cols: 100, //window.Tableaux[0].cols,
            rows: 10 //window.Tableaux[0].rows
        }
    );
    map.mapWidth = w;
    map.mapHeight = h;
    map.clear();
    map.add(arthur);
    map.setTarget(arthur, arthur.x, arthur.y);
    var decor = tab.decor;
    map.initTiles(decor);
    map.origX = 0;
    map.origY = 0;
    this.add(map);
    this.start(loop);
}

function moveArthur(runtime) {
    if (arthur.killed) {
        var elapsedTime = runtime.timestamp - arthur.killed;
        arthur.rotation = (arthur.sx >= 0 ? 1 : -1) * elapsedTime * .5;
        if (elapsedTime > 3000) {
            runtime.draw = init;
        }
        return;
    }
    var tile = map.getTileAtXY(this.x, this.y);
    if (tile && tile.type == -1) {
        // Tuile mortelle.
        arthur.killed = runtime.timestamp;
        map.setTarget(null);
        arthur.ax = 0;
        arthur.sx = -arthur.sx;
        arthur.sy = -300;
        arthur.ay = 500;
        return;
    }
    // Limiter la vitesse max de chute et de déplacement.
    if (this.sy > 400) this.sy = 400;
    if (this.sx > 100) this.sx = 100;
    if (this.sx < -100) this.sx = -100;

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
    } else {
        // Arthur a les pieds au sol.
        this.mode = "stop";
        if (Keyboard.isPressed(Keyboard.RIGHT)) {
            this.ax = 300;
            this.flipX = false;
            this.mode = "move";
        }
        else if (Keyboard.isPressed(Keyboard.LEFT)) {
            this.ax = -300;
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
                this.ay = 400;
                this.sy = -200;
                this.ax = 0;
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
    ctx.fillStyle = "#fff";
    ctx.fillText("Speed: " + Math.floor(arthur.sx), 10, 10);
}
