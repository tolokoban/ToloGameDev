var vitesse = 3;   // Colonnes par secondes.
var largeurColonne = 32;
var tableau1 = {
    plateformes: [
        [10, 0, 12],
        [3, 7, 10],
        [13, 4, 3],
        [18, 8, 14],
        [15, 6, 4],
        [23, 2, 4],
        [8, 5, 3]
    ]
};

var TGD = require("tgd");
TGD.init();
var TiledMap = require("tgd.tiled-map");
var MobilImage = require("tgd.mobil-image");
var map = new TiledMap(
    {
        tileWidth: 32,
        tileHeight: 32,
        cols: 40,
        rows: 10        
    }
);
var beginTime = null;

function main() {
    var ctx = this.context;
    this.loadImages({wall: "wall.png"});
    compilerTableau(tableau1);
    map.mapWidth = ctx.canvas.width;
    map.mapHeight = ctx.canvas.height;
    this.draw = null;
    this.addListener("tap", onTap);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillText(10, 10, "Click!");
}

function onTap() {
    this.draw = loop;
    map.origX = 0;
    map.origY = 0;
    map.origSpeedX = 100;
    this.add(map);
}

function loop() {
    var ctx = this.context;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function compilerTableau(tab) {
    var wall = new MobilImage({img: "wall"});
    map.clear();
    tab.plateformes.forEach(
        function(plateforme) {
            var x = plateforme[0];
            var y = plateforme[1];
            var w = plateforme[2];
            for (var i = 0 ; i < w ; i++) {
                map.setTile(x + i, y, wall);
            }
        }
    );
}