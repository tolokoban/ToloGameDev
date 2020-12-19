var f = function() {
    var canvas = null;    
    var resize = function() {
        if (!canvas) {
        }
        var canvasW = parseFloat(canvas.getAttribute("width"));
        var canvasH = parseFloat(canvas.getAttribute("height"));
        var screenW = window.innerWidth;
        var screenH = window.innerHeight;
        var factorW = screenW / canvasW;
        var factorH = screenH / canvasH;
        var factor = Math.min(factorW, factorH);
        var w = Math.floor(canvasW * factor);
        var h = Math.floor(canvasH * factor);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.style.left = Math.floor((screenW - w) / 2) + "px";
        canvas.style.top = Math.floor((screenH - h) / 2) + "px";
    };

    window.addEventListener(
        'DOMContentLoaded',
        function() {
            canvas = window.document.querySelector("canvas");
            window.onresize = resize;
            resize();
        }
    );
}();
