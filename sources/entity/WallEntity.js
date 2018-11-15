"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Entity_1 = require("../lib/Entity");
var WallEntity = /** @class */ (function (_super) {
    __extends(WallEntity, _super);
    function WallEntity(element, position, hitbox, hitboxStart) {
        var _this = _super.call(this, element, 0, position, hitbox, hitboxStart) || this;
        _this.deleteKeymap('left');
        _this.deleteKeymap('right');
        _this.deleteKeymap('up');
        _this.deleteKeymap('down');
        WallEntity.layer.appendChild(element);
        return _this;
    }
    WallEntity.drawPoint = function (x, y) {
        WallEntity.walls.push(new WallEntity(Entity_1.Entity.createElement('div', { className: 'wall' }), { x: x * WallEntity.gap, y: y * WallEntity.gap }, { x: 32, y: 32 }));
    };
    WallEntity.drawVerticalLine = function (x, y, size) {
        for (var i = y; i < size; i++) {
            WallEntity.drawPoint(x, y + i);
        }
    };
    WallEntity.drawHorizontalLine = function (x, y, size) {
        for (var i = x; i < size; i++) {
            WallEntity.drawPoint(x + i, y);
        }
    };
    WallEntity.sign = function (entity, callback) {
        for (var _i = 0, _a = WallEntity.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            entity.onCollision(wall, callback);
        }
    };
    WallEntity.clearAll = function () {
        while (WallEntity.walls.length) {
            var wall = WallEntity.walls.pop();
            WallEntity.layer.removeChild(wall.element);
        }
    };
    WallEntity.walls = new Array();
    WallEntity.gap = 32;
    return WallEntity;
}(Entity_1.Entity));
exports.WallEntity = WallEntity;
