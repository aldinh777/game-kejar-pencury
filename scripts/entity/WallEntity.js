const Entity = require("../lib/Entity");

class WallEntity extends Entity {
    constructor(element, position, hitbox, hitboxStart) {
        super(element, 0, position, hitbox, hitboxStart);
        this.deleteKeymap('left');
        this.deleteKeymap('right');
        this.deleteKeymap('up');
        this.deleteKeymap('down');
        WallEntity.layer.appendChild(element);
    }
    static drawPoint(x, y) {
        WallEntity.walls.push(new WallEntity(Entity.createElement('div', { className: 'wall' }), { x: x * WallEntity.gap, y: y * WallEntity.gap }, { x: 32, y: 32 }));
    }
    static drawVerticalLine(x, y, size) {
        for (let i = 0; i < size; i++) {
            WallEntity.drawPoint(x, y + i);
        }
    }
    static drawHorizontalLine(x, y, size) {
        for (let i = 0; i < size; i++) {
            WallEntity.drawPoint(x + i, y);
        }
    }
    static sign(entity, callback) {
        for (const wall of WallEntity.walls) {
            entity.onCollision(wall, callback);
        }
    }
    static clearAll() {
        while (WallEntity.walls.length) {
            const wall = WallEntity.walls.pop();
            WallEntity.layer.removeChild(wall.element);
        }
    }
}
WallEntity.walls = new Array();
WallEntity.gap = 32;

module.exports = WallEntity;
