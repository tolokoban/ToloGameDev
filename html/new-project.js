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
    var dirTemplate = Path.join(Common.pwd(), "template");
    dirTemplate = Path.join(dirTemplate, "default");
    Template.copy(dirTemplate, dirProject, {name: name});

    // Copy the TGD library.
    var dirModules = Path.join(dirProject, "node_modules");
    if (false == FS.existsSync(dirModules)) {
        FS.mkdirSync(dirModules);
    }
    var dirLibrary = Path.join(Common.pwd(), "node_modules");
    FS.readdir(
        dirLibrary,
        function(err, files) {
            if (err) {
                console.error(err);
                return;
            }
            files.forEach(
                function(file) {
                    var newFile = FS.createWriteStream(Path.join(dirLibrary, file));     
                    var oldFile = FS.createReadStream(Path.join(dirModules, file));
                    oldFile.pipe(newFile);
                } 
            );
        }
    );

    // Back to the main page.
    window.location.href = "index.html";
}
