const keyDownListener = new Array();

window.onkeydown = function (ev) {
    for (const entity of keyDownListener) {
        for (const keymap of entity.getKeymaps()) {
            if (keymap.key.toUpperCase() == ev.key.toUpperCase()) {
                keymap.callback(ev);
            }
        }
    }
};

class Entity {
    constructor(element, range, position, hitbox, hitboxStart) {
        this.keyMaps = [
            { name: 'right', key: 'd', callback: () => { this.moveRight(); } },
            { name: 'left', key: 'a', callback: () => { this.moveLeft(); } },
            { name: 'down', key: 's', callback: () => { this.moveDown(); } },
            { name: 'up', key: 'w', callback: () => { this.moveUp(); } },
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
    static createElement(tag, setting) {
        const elem = document.createElement(tag);
        if (setting) {
            for (const key in setting) {
                const existedElem = (key == 'id') ? document.getElementById(setting['id']) : null;
                if (existedElem) {
                    return existedElem;
                } else {
                    elem[key] = setting[key];
                }
            }
        }
        elem.classList.add('entity');
        this.layer.appendChild(elem);
        return elem;
    }
    checkCollision(x, y) {
        for (const listener of this.collisionListeners) {
            const self = this.getHitbox(x, y);
            const target = listener.entity.getHitbox();
            const collisionX = self.maxX > target.minX && self.minX < target.maxX;
            const collisionY = self.maxY > target.minY && self.minY < target.maxY;
            if (collisionX && collisionY) {
                if (listener.callback()) {
                    return true;
                }
            }
        }
        return false;
    }
    move(x, y) {
        if (this.checkCollision(x, y)) {
            return;
        }
        this.position.x = x;
        this.position.y = y;
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    }
    moveRight() {
        this.move(this.position.x + this.range, this.position.y);
    }
    moveLeft() {
        this.move(this.position.x - this.range, this.position.y);
    }
    moveDown() {
        this.move(this.position.x, this.position.y + this.range);
    }
    moveUp() {
        this.move(this.position.x, this.position.y - this.range);
    }
    getHitbox(x, y) {
        return {
            minX: (x == 0 ? 0 : x || this.position.x) + this.hitboxStart.x,
            minY: (y == 0 ? 0 : y || this.position.y) + this.hitboxStart.y,
            maxX: (x == 0 ? 0 : x || this.position.x) + this.hitbox.x,
            maxY: (y == 0 ? 0 : y || this.position.y) + this.hitbox.y
        };
    }
    addKeymap(name, key, callback) {
        this.keyMaps.push({ name, key, callback });
    }
    deleteKeymap(name) {
        this.keyMaps = this.keyMaps.filter((keymap) => {
            return keymap.name != name;
        });
    }
    getKeymaps() {
        return this.keyMaps;
    }
    remap(name, remapKey, callback) {
        this.keyMaps = this.keyMaps.map((keymap) => {
            if (keymap.name == name) {
                return { name, key: remapKey, callback: callback || keymap.callback };
            }
            return keymap;
        });
    }
    destroy() {
        this.position = { x: 0, y: 0 };
        this.hitbox = { x: 0, y: 0 };
        this.hitboxStart = { x: 0, y: 0 };
        this.element.parentNode.removeChild(this.element);
        this.keyMaps = [];
    }
    onCollision(entity, callback) {
        this.collisionListeners.push({ entity, callback });
    }
    onBothCollision(entity, callback) {
        this.collisionListeners.push({ entity, callback });
        entity.collisionListeners.push({ entity: this, callback });
    }
}
Entity.layer = document.getElementById('main');

module.exports = Entity;
