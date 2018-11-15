"use strict";
exports.__esModule = true;
var keyDownListener = new Array();
window.onkeydown = function (ev) {
    for (var _i = 0, keyDownListener_1 = keyDownListener; _i < keyDownListener_1.length; _i++) {
        var entity = keyDownListener_1[_i];
        for (var _a = 0, _b = entity.getKeymaps(); _a < _b.length; _a++) {
            var keymap = _b[_a];
            if (keymap.key.toUpperCase() == ev.key.toUpperCase()) {
                keymap.callback(ev);
            }
        }
    }
};
var Entity = /** @class */ (function () {
    function Entity(element, range, position, hitbox, hitboxStart) {
        var _this = this;
        this.keyMaps = [
            { name: 'right', key: 'd', callback: function () { _this.moveRight(); } },
            { name: 'left', key: 'a', callback: function () { _this.moveLeft(); } },
            { name: 'down', key: 's', callback: function () { _this.moveDown(); } },
            { name: 'up', key: 'w', callback: function () { _this.moveUp(); } },
        ];
        this.collisionListeners = new Array();
        this.element = element;
        this.range = range || (range == 0 ? 0 : 1);
        this.position = position || { x: 0, y: 0 };
        this.hitbox = hitbox || { x: 0, y: 0 };
        this.hitboxStart = hitboxStart || { x: 0, y: 0 };
        this.move(this.position.x, this.position.y);
        keyDownListener.push(this);
    }
    Entity.createElement = function (tag, setting) {
        var elem = document.createElement(tag);
        if (setting) {
            for (var key in setting) {
                elem[key] = setting[key];
            }
        }
        elem.classList.add('entity');
        this.layer.appendChild(elem);
        return elem;
    };
    Entity.prototype.checkCollision = function (x, y) {
        for (var _i = 0, _a = this.collisionListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            var self_1 = this.getHitbox(x, y);
            var target = listener.entity.getHitbox();
            var collisionX = self_1.maxX > target.minX && self_1.minX < target.maxX;
            var collisionY = self_1.maxY > target.minY && self_1.minY < target.maxY;
            if (collisionX && collisionY) {
                if (listener.callback()) {
                    return true;
                }
            }
        }
        return false;
    };
    Entity.prototype.move = function (x, y) {
        if (this.checkCollision(x, y)) {
            return;
        }
        this.position.x = x;
        this.position.y = y;
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    };
    Entity.prototype.moveRight = function () {
        this.move(this.position.x + this.range, this.position.y);
    };
    Entity.prototype.moveLeft = function () {
        this.move(this.position.x - this.range, this.position.y);
    };
    Entity.prototype.moveDown = function () {
        this.move(this.position.x, this.position.y + this.range);
    };
    Entity.prototype.moveUp = function () {
        this.move(this.position.x, this.position.y - this.range);
    };
    Entity.prototype.getHitbox = function (x, y) {
        return {
            minX: (x == 0 ? 0 : x || this.position.x) + this.hitboxStart.x,
            minY: (y == 0 ? 0 : y || this.position.y) + this.hitboxStart.y,
            maxX: (x == 0 ? 0 : x || this.position.x) + this.hitbox.x,
            maxY: (y == 0 ? 0 : y || this.position.y) + this.hitbox.y
        };
    };
    Entity.prototype.addKeymap = function (name, key, callback) {
        this.keyMaps.push({ name: name, key: key, callback: callback });
    };
    Entity.prototype.deleteKeymap = function (name) {
        this.keyMaps = this.keyMaps.filter(function (keymap) {
            return keymap.name != name;
        });
    };
    Entity.prototype.getKeymaps = function () {
        return this.keyMaps;
    };
    Entity.prototype.remap = function (name, remapKey, callback) {
        this.keyMaps = this.keyMaps.map(function (keymap) {
            if (keymap.name == name) {
                return { name: name, key: remapKey, callback: callback || keymap.callback };
            }
            return keymap;
        });
    };
    Entity.prototype.destroy = function () {
        this.position = { x: 0, y: 0 };
        this.hitbox = { x: 0, y: 0 };
        this.hitboxStart = { x: 0, y: 0 };
        this.element.parentNode.removeChild(this.element);
        this.keyMaps = [];
    };
    Entity.prototype.onCollision = function (entity, callback) {
        this.collisionListeners.push({ entity: entity, callback: callback });
    };
    Entity.prototype.onBothCollision = function (entity, callback) {
        this.collisionListeners.push({ entity: entity, callback: callback });
        entity.collisionListeners.push({ entity: this, callback: callback });
    };
    Entity.layer = document.getElementById('main');
    return Entity;
}());
exports.Entity = Entity;
