var f = function() {
    var canvas = null;

    window.onresize = function() {
        if (!canvas) {
            canvas = window.document.querySelector("canvas");
        }
        var canvasW = parseFloat(canvas.getAttribute("width"));
        var canvasH = parseFloat(canvas.getAttribute("height"));
        var screenW = window.innerWidth;
        var screenH = window.innerHeight;
        var factorW = screenW / canvasW;
        var factorH = screenH / canvasH;
        var factor = Math.min(factorW, factorH);
        canvas.style.width = Math.floor(canvasW * factor) + "px";
        canvas.style.height = Math.floor(canvasH * factor) + "px";
    };
}();
