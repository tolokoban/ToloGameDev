window.Tableaux = function() {
    var MobilImage = require("tgd.mobil-image");

    var tiles = {
        rip: new MobilImage({img: "rip"}, {type: 1}),
        wall: new MobilImage({img: "wall"}, {type: 0}),
        wall1: new MobilImage({img: "wall1"}, {type: 1}),
        wall2: new MobilImage({img: "wall2"}, {type: 1}),
        skull: new MobilImage({img: "skull"}, {type: -1}),
        exit: new MobilImage({img: "exit"}, {type: 666})
    };

    var P = function(i, j, w, h) {
        if (j == 0) {
            return i % 2 ? tiles.wall1 : tiles.wall2;
        }
        return tiles.wall;
    };
    var R = function() { return tiles.rip; };
    var S = function() { return tiles.skull; };
    var X = function() { return tiles.exit; };

    return [
        {
            cols: 100,
            rows: 10,
            decor: [
                [R, 10, 8],
                [S, 15, 8],
                [R, 16, 8],
                [R, 20, 8],
                [P, 22, 6, 8],
                [R, 30, 8],
                [P, 0, 9, 100, 4],
                [X, 99, 8]
            ]
        }
    ];
}();
