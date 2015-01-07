require("tgd").init();

function main() {
    var ctx = this.context;
    var y = (this.timestamp / 20) % ctx.canvas.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = 'bold 32pt serif';
    ctx.strokeStyle = "black";
    ctx.fillStyle = "orange";
    ctx.fillText("{{name}}", 10, y);
    ctx.strokeText("{{name}}", 10, y);
}
