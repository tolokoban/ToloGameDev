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

var beginTime = null;
var tableauCourant = null;

function main() {
    beginTime = this.timestamp;
    compilerTableau(tableau1);
    tableauCourant = tableau1;
    this.draw = loop;
}

function loop() {
    var ctx = this.context;
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    var nbColonnes = Math.ceil(w / largeurColonne) + 1;
    var millisecondes = (this.timestamp - beginTime);
    while (millisecondes > 10000) {
        millisecondes -= 10000;
    }
    var indexColonne = (millisecondes * vitesse) / 1000.0;
    var decalage = indexColonne - Math.floor(indexColonne);
    indexColonne = Math.floor(indexColonne);
    for (var i = 0 ; i < nbColonnes ; i++) {
        var colDef = tableauCourant.colonnes[indexColonne + i];
        if (!colDef) continue;
        colDef.plateformes.forEach(
            function(y) {
                afficherMurPlateforme(ctx, i - decalage, y);
            } 
        );
    }
}

function afficherMurPlateforme(ctx, x, y) {
    x *= largeurColonne;
    y *= largeurColonne;
    ctx.fillStyle = "#0f0";
    ctx.fillRect(x, y, largeurColonne, largeurColonne);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, largeurColonne, largeurColonne);
}

function compilerTableau(tab) {
    var resultat = {};
    tab.plateformes.forEach(
        function(plateforme) {
            var x = plateforme[0];
            var y = plateforme[1];
            var w = plateforme[2];
            for (var i = 0 ; i < w ; i++) {
                var colonne = resultat[x + i];
                if (typeof colonne === 'undefined') {
                    colonne = {plateformes: []};
                    resultat[x + i] = colonne;
                }
                colonne.plateformes.push(y);                
            }
        }
    );
    tab.colonnes = resultat;
}