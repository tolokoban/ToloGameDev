"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var painter_1 = __importDefault(require("../painter"));
var ListPainter = /** @class */ (function (_super) {
    __extends(ListPainter, _super);
    function ListPainter(scene) {
        var _this = _super.call(this, scene) || this;
        _this.scene = scene;
        _this.painters = [];
        // Count the number of instances of each Painter.
        // It's useful to know when to initialize/destroy common assets.
        _this.paintersCounters = new Map();
        return _this;
    }
    Object.defineProperty(ListPainter.prototype, "id", {
        get: function () { return "ListPainter"; },
        enumerable: false,
        configurable: true
    });
    ListPainter.prototype.initializeCommon = function () { return undefined; };
    ListPainter.prototype.initialize = function () { };
    ListPainter.prototype.paint = function (time) {
        var e_1, _a;
        try {
            for (var _b = __values(this.painters), _c = _b.next(); !_c.done; _c = _b.next()) {
                var painter = _c.value;
                painter.paint(time);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ListPainter.prototype.prepareNextFrame = function (time) {
        var e_2, _a;
        try {
            for (var _b = __values(this.painters), _c = _b.next(); !_c.done; _c = _b.next()) {
                var painter = _c.value;
                painter.prepareNextFrame(time);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ListPainter.prototype.destroy = function () {
        this.clear();
    };
    ListPainter.prototype.destroyCommon = function () { };
    ListPainter.prototype.add = function (painter) {
        if (painter.incrementInstances() === 1) {
            // First instance, we need to initialize common assets.
            var assets = painter.initializeCommon();
            console.log("[" + painter.id + "] new assets = ", assets); // @FIXME: Remove this line written on 2021-01-12 at 22:20
            painter.setCommonAsset(assets);
            painter.initialize(assets);
        }
        else {
            var assets = painter.getCommonAsset();
            console.log("[" + painter.id + "] assets from cache = ", assets); // @FIXME: Remove this line written on 2021-01-12 at 22:20
            painter.initialize(assets);
        }
        this.painters.push(painter);
    };
    ListPainter.prototype.remove = function (painter) {
        var painters = this.painters;
        for (var i = 0; i < painters.length; i++) {
            var p = painters[i];
            if (p === painter) {
                p.destroy();
                if (p.decrementInstances() === 0) {
                    p.destroyCommon();
                }
                painters.splice(i, 1);
                return;
            }
        }
    };
    ListPainter.prototype.clear = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.painters), _c = _b.next(); !_c.done; _c = _b.next()) {
                var painter = _c.value;
                painter.destroy();
                if (painter.decrementInstances() === 0) {
                    painter.destroyCommon();
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.painters.splice(0, this.painters.length);
    };
    return ListPainter;
}(painter_1.default));
exports.default = ListPainter;
//# sourceMappingURL=list-painter.js.map