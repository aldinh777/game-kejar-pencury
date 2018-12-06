const SlideEntity = require("../entity/SlideEntity");
const Entity = require("../lib/Entity");
const WallEntity = require("../entity/WallEntity");
const Card = require("../lib/Card");
const XHRApi = require("../lib/XHRApi");

class initPlay {
    static timerStart() {
        let timeLimit = initPlay.globalTimeLimit;
        const countDown = () => {
            timeLimit--;
            if (timeLimit <= 0) {
                clearInterval(initPlay.countStart);
                initPlay.pengejar.destroy();
                Card.show('offline@runner-win');
            }
        };
        initPlay.countStart = setInterval(countDown, 1000);
    }
    static initialMap() {
        WallEntity.drawHorizontalLine(0, 0, 32);
        WallEntity.drawHorizontalLine(0, 19, 32);
        WallEntity.drawVerticalLine(0, 0, 20);
        WallEntity.drawVerticalLine(31, 0, 20);
        
        WallEntity.drawHorizontalLine(31-10, 5, 6);
        WallEntity.drawVerticalLine(5, 1, 5);
        WallEntity.drawVerticalLine(31-5, 1, 5);

        WallEntity.drawHorizontalLine(6, 19-5, 6);
        WallEntity.drawVerticalLine(5, 19-5, 5);
        WallEntity.drawVerticalLine(31-5, 19-5, 5);

        WallEntity.drawPoint(4, 7);
        WallEntity.drawPoint(6, 6);

        WallEntity.drawPoint(20, 14);
        WallEntity.drawPoint(12, 5);

        WallEntity.drawPoint(31-6, 19-6);
        WallEntity.drawPoint(31-4, 19-7);
        
    }
    static online(roomName, yourRole) {
        initPlay.pengejar = new SlideEntity(Entity.createElement('div', { id: 'chaser' }), 1000, 4, { x: 1 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        initPlay.pelari = new SlideEntity(Entity.createElement('div', { id: 'runner' }), 1000, 4, { x: 30 * 32, y: 1 * 32 }, { x: 32, y: 32 });

        initPlay.initialMap();

        WallEntity.sign(initPlay.pengejar, () => {
            initPlay.pengejar.stop();
            return true;
        });
        WallEntity.sign(initPlay.pelari, () => {
            initPlay.pelari.stop();
            return true;
        });
        initPlay.pengejar.onBothCollision(initPlay.pelari, () => {
            clearInterval(initPlay.countStart);
            initPlay.pelari.destroy();
            Card.show('offline@chaser-win');
            return true;
        });
        const watchDog = () => {
            const xhr = new XHRApi();
            xhr.get('/api/room/' + roomName + '/watch', (res) => {
                const obj = JSON.parse(res);
                const entity = obj.role == 'chaser' ? initPlay.pengejar : initPlay.pelari;
                switch (obj.dir) {
                    case 'left':
                        entity.moveLeft();
                        break;
                    case 'up':
                        entity.moveUp();
                        break;
                    case 'right':
                        entity.moveRight();
                        break;
                    case 'down':
                        entity.moveDown();
                        break;
                }
                watchDog();
            });
        };
        console.log(yourRole);
        if (yourRole == 'chaser') {
            initPlay.pelari.deleteKeymap('left');
            initPlay.pelari.deleteKeymap('up');
            initPlay.pelari.deleteKeymap('right');
            initPlay.pelari.deleteKeymap('down');
            initPlay.pengejar.remap('left', 'a', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'left', role: 'chaser' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('up', 'w', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'up', role: 'chaser' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('right', 'd', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'right', role: 'chaser' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('down', 's', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'down', role: 'chaser' }, (res) => {
                    console.log(res);
                });
            });
        }
        else {
            initPlay.pengejar.deleteKeymap('left');
            initPlay.pengejar.deleteKeymap('up');
            initPlay.pengejar.deleteKeymap('right');
            initPlay.pengejar.deleteKeymap('down');
            initPlay.pelari.remap('left', 'a', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'left', role: 'runner' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('up', 'w', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'up', role: 'runner' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('right', 'd', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'right', role: 'runner' }, (res) => {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('down', 's', () => {
                const xhr = new XHRApi();
                xhr.post('/api/room/' + roomName + '/move', { dir: 'down', role: 'runner' }, (res) => {
                    console.log(res);
                });
            });
        }
        watchDog();
        initPlay.timerStart();
    }
    static offline() {
        initPlay.pengejar = new SlideEntity(Entity.createElement('div', { id: 'chaser' }), 1000, 4, { x: 1 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        initPlay.pelari = new SlideEntity(Entity.createElement('div', { id: 'runner' }), 1000, 4, { x: 30 * 32, y: 1 * 32 }, { x: 32, y: 32 });

        initPlay.initialMap();

        initPlay.pelari.remap('left', 'j');
        initPlay.pelari.remap('up', 'i');
        initPlay.pelari.remap('right', 'l');
        initPlay.pelari.remap('down', 'k');
        WallEntity.sign(initPlay.pengejar, () => {
            initPlay.pengejar.stop();
            return true;
        });
        WallEntity.sign(initPlay.pelari, () => {
            initPlay.pelari.stop();
            return true;
        });
        initPlay.pengejar.onBothCollision(initPlay.pelari, () => {
            clearInterval(initPlay.countStart);
            initPlay.pelari.destroy();
            Card.show('offline@chaser-win');
            return true;
        });
        initPlay.timerStart();
    }
}
initPlay.globalTimeLimit = 30;

module.exports = initPlay;
