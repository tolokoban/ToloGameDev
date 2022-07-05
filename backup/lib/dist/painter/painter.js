"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalId = 0;
var Painter = /** @class */ (function () {
    function Painter(scene) {
        this.scene = scene;
        this.instanceId = globalId++;
    }
    Object.defineProperty(Painter.prototype, "key", {
        get: function () { return this.scene.id + "/" + this.id; },
        enumerable: false,
        configurable: true
    });
    Painter.prototype.getCommonAsset = function () {
        return Painter.instancesCommonAssets
            .get(this.key);
    };
    Painter.prototype.setCommonAsset = function (asset) {
        Painter.instancesCommonAssets.set(this.key, asset);
    };
    Painter.prototype.countInstances = function () {
        var count = Painter.instancesCounter.get(this.key);
        return typeof count === 'number' ? count : 0;
    };
    Painter.prototype.incrementInstances = function () {
        var count = this.countInstances() + 1;
        Painter.instancesCounter.set(this.key, count);
        return count;
    };
    Painter.prototype.decrementInstances = function () {
        var count = Math.max(0, this.countInstances() - 1);
        Painter.instancesCounter.set(this.key, count);
        return count;
    };
    // Key: Scene ID.
    Painter.instancesCounter = new Map();
    Painter.instancesCommonAssets = new Map();
    return Painter;
}());
exports.default = Painter;
//# sourceMappingURL=painter.js.map