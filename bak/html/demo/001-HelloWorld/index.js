require("tgd").init();

function main() {
    var ctx = this.context;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = 'italic 20pt serif';
    ctx.fillStyle = "black";
    ctx.fillText("Hello world!", 51, 51);
    ctx.fillStyle = "cyan";
    ctx.fillText("Hello world!", 50, 50);
}
