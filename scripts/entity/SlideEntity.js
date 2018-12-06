const Entity = require("../lib/Entity");

module.exports = class SlideEntity extends Entity {
    constructor(element, speed, range, position, hitbox, hitboxStart) {
        super(element, range, position, hitbox, hitboxStart);
        this.speed = speed || 10;
        this.direction = 'none';
    }
    slide() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.direction = this.queueDirection;
            this.queueDirection = 'none';
            const slideInterval = setInterval(() => {
                switch (this.direction) {
                    case 'left':
                        this.element.style.transform = 'scale(-1, 1)';
                        super.moveLeft();
                        break;
                    case 'right':
                        this.element.style.transform = 'scale(1, 1)';
                        super.moveRight();
                        break;
                    case 'up':
                        super.moveUp();
                        break;
                    case 'down':
                        super.moveDown();
                        break;
                    case 'none':
                        clearInterval(slideInterval);
                        this.isMoving = false;
                        if (this.queueDirection != 'none') {
                            this.slide();
                        }
                }
            }, 1000 / this.speed);
        }
    }
    stop() {
        this.direction = 'none';
    }
    moveLeft() {
        this.queueDirection = 'left';
        this.slide();
    }
    moveRight() {
        this.queueDirection = 'right';
        this.slide();
    }
    moveUp() {
        this.queueDirection = 'up';
        this.slide();
    }
    moveDown() {
        this.queueDirection = 'down';
        this.slide();
    }
}
