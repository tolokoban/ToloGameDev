var require = function() {
    var modules = {};
    
    return function(id, body) {
        var mod;
        body = window["TFW::" + id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module not found: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            console.log("Module initialized: " + id);
        }
        return mod;
    }
}();