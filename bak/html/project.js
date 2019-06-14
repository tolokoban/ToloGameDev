var Path = require("path");

var projectFolder = null;
var packageJSON = null;

window.addEventListener(
    "DOMContentLoaded",
    function() {
        var prjId = window.location.search.substr(1);
        projectFolder = Path.join(Common.pwd(), "..");
        projectFolder = Path.join(projectFolder, "project");
        projectFolder = Path.join(projectFolder, prjId);
        var detailFile = Path.join(projectFolder, "package.json");        
        packageJSON = JSON.parse(FS.readFileSync(detailFile));
        window.document.querySelector("#title").textContent = packageJSON.name;
        window.document.querySelector("#a").setAttribute(
            "href",
            "../project/" + prjId + "/html/index.html"
        );
    }
);


function upgrade() {
    var dirLibSrc = Path.normalize(Path.join(Common.pwd(), "../node_modules"));
    var dirLibDst = Path.join(projectFolder, "html");
    dirLibDst = Path.join(dirLibDst, "lib");
    var files = FS.readdirSync(dirLibSrc);
    files.forEach(
        function(file) {
            if (file.substr(0, 3) != 'tgd') return;
            var content = FS.readFileSync(Path.join(dirLibSrc, file));
            FS.writeFileSync(
                Path.join(dirLibDst, file),
                "window['TFW::" + file.substr(0, file.length - 3)
                    + "'] = function(module, exports){\n"
                    + content
                    + "};"                        
            );
        } 
    );    
    alert("La bibliothèque a été mise à jour.");
}