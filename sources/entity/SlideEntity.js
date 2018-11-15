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
var SlideEntity = /** @class */ (function (_super) {
    __extends(SlideEntity, _super);
    function SlideEntity(element, speed, range, position, hitbox, hitboxStart) {
        var _this = _super.call(this, element, range, position, hitbox, hitboxStart) || this;
        _this.speed = speed || 10;
        _this.direction = 'none';
        return _this;
    }
    SlideEntity.prototype.slide = function () {
        var _this = this;
        if (!this.isMoving) {
            this.isMoving = true;
            this.direction = this.queueDirection;
            this.queueDirection = 'none';
            var slideInterval_1 = setInterval(function () {
                switch (_this.direction) {
                    case 'left':
                        _super.prototype.moveLeft.call(_this);
                        break;
                    case 'right':
                        _super.prototype.moveRight.call(_this);
                        break;
                    case 'up':
                        _super.prototype.moveUp.call(_this);
                        break;
                    case 'down':
                        _super.prototype.moveDown.call(_this);
                        break;
                    case 'none':
                        clearInterval(slideInterval_1);
                        _this.isMoving = false;
                        if (_this.queueDirection != 'none') {
                            _this.slide();
                        }
                }
            }, 1000 / this.speed);
        }
    };
    SlideEntity.prototype.stop = function () {
        this.direction = 'none';
    };
    SlideEntity.prototype.moveLeft = function () {
        this.queueDirection = 'left';
        this.slide();
    };
    SlideEntity.prototype.moveRight = function () {
        this.queueDirection = 'right';
        this.slide();
    };
    SlideEntity.prototype.moveUp = function () {
        this.queueDirection = 'up';
        this.slide();
    };
    SlideEntity.prototype.moveDown = function () {
        this.queueDirection = 'down';
        this.slide();
    };
    return SlideEntity;
}(Entity_1.Entity));
exports.SlideEntity = SlideEntity;
