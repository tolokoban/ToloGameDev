
var Path = require("path");
var FS = require("fs");
var Template = require("template");

function createProject() {
    var dir = Path.join(Common.pwd(), "..");
    dir = Path.join(dir, "project");
    if (false == FS.existsSync(dir)) {
        FS.mkdirSync(dir);
    }
    var name = window.document.getElementById("name").value.trim();
    if (name.length == 0) {
        window.document.getElementById("name").focus();
        alert("Missing project's name!");
        return;
    }
    var width = parseFloat(window.document.getElementById("width").value.trim());
    var height = parseFloat(window.document.getElementById("height").value.trim());

    // Looking for a free name for the new project.
    var projectNumber = 0;
    var dirProject;
    for(;;) {
        var prjId = "" + projectNumber;
        while (prjId.length < 4) prjId = "0" + prjId;
        dirProject = Path.join(dir, prjId);
        if (false == FS.existsSync(dirProject)) break;
        projectNumber++;
    }
    FS.mkdirSync(dirProject);

    // Copy the TGD library.
    var scripts = "";
    var dirLibDst = Path.join(dirProject, "html");
    if (!FS.existsSync(dirLibDst)) {
        FS.mkdirSync(dirLibDst);
    }
    dirLibDst = Path.join(dirLibDst, "lib");
    if (!FS.existsSync(dirLibDst)) {
        FS.mkdirSync(dirLibDst);
    }
    var dirLibSrc = Path.normalize(Path.join(Common.pwd(), "../node_modules"));
    var files = FS.readdirSync(dirLibSrc);
    files.forEach(
        function(file) {
            if (file.substr(0, 3) != 'tgd') return;
            scripts += "    <script src='lib/" + file + "'></script>\n";
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

    // Copy rest of template.
    var dirTemplate = Path.join(Common.pwd(), "template");
    dirTemplate = Path.join(dirTemplate, "default");
    Template.copy(
        dirTemplate, 
        dirProject, 
        {
            name: name, 
            width: width, 
            height: height, 
            scripts: scripts
        }
    );

    // Back to the main page.
    window.location.href = "index.html";
}
