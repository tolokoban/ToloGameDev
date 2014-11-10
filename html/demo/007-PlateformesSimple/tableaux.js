window.Tableaux = function() {
    var MobilImage = require("tgd.mobil-image");

    var tiles = {
        rip: new MobilImage({img: "rip"}, {type: 1}),
        wall1: new MobilImage({img: "wall1"}, {type: 1}),
        wall2: new MobilImage({img: "wall2"}, {type: 1}),
        skull: new MobilImage({img: "skull"}, {type: -1})
    };

    var P = function(i, j, w, h) {
        return i % 2 ? tiles.wall1 : tiles.wall2;
    };
    var R = function() { return tiles.rip; };
    var S = function() { return tiles.skull; };

    return [
        {
            decor: [
                [R, 10, 13],
                [S, 15, 13],
                [R, 17, 13],
                [R, 20, 13],
                [R, 30, 13],
                [P, 0, 14, 40]
            ]
        }
    ];
}();
