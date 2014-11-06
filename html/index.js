var Path = require("path");
var FS = require("fs");

window.addEventListener(
    'DOMContentLoaded',
    function() {
        var demodir = Path.join(Common.pwd(), "demo");
        var ul = window.document.getElementById("demos");
        FS.readdir(
            demodir,
            function(err, files) {
                if (err) {
                    ul.textContent = err;
                } else {
                    files.forEach(
                        function(filename) {
                            var file = Path.join(demodir, filename);
                            var stat = FS.statSync(file);
                            if (stat.isDirectory()) {
                                var detailFile = Path.join(file, "detail.json");
                                if (FS.existsSync(detailFile)) {
                                    var detail = JSON.parse(FS.readFileSync(detailFile));
                                    var li = window.document.createElement("li");
                                    var a = window.document.createElement("a");
                                    a.setAttribute("href", Path.join(file, "index.html"));
                                    a.textContent = detail.name;
                                    li.appendChild(a);
                                    ul.appendChild(li);
                                }
                            }
                        } 
                    );
                }
            }
        );
    }
);
