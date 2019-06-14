require("tgd").init();
var name = "?";


function main() {
    this.addListener(
        "tap",
        function() {
            this.draw = ask;
        }
    );
    var ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "bold 40pt monospace";
    ctx.fillText("Click!", 10, 40);
}


function ask() {
    var ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    name = window.prompt("What's your name?");
    this.draw = hello;
}


function hello() {
    var ctx = this.context;
    ctx.font = "bold 20pt sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("Hello " + name + "!", 10, 40);
    ctx.fillText("How are you?", 10, 80);

    if (this.mouseButtons[2] == 1) {
        this.draw = main;
    }
}
