"use strict";
exports.__esModule = true;
var SlideEntity_1 = require("../entity/SlideEntity");
var Entity_1 = require("../lib/Entity");
var WallEntity_1 = require("../entity/WallEntity");
var Card_1 = require("../lib/Card");
var XHRApi_1 = require("../lib/XHRApi");
var initPlay;
(function (initPlay) {
    var globalTimeLimit = 60;
    initPlay.roomName = "yoyo";
    function timerStart() {
        var timeLimit = globalTimeLimit;
        var countDown = function () {
            timeLimit--;
            if (timeLimit <= 0) {
                clearInterval(initPlay.countStart);
                initPlay.pengejar.destroy();
                Card_1.Card.show('offline@runner-win');
            }
        };
        initPlay.countStart = setInterval(countDown, 1000);
    }
    function online() {
        timerStart();
        WallEntity_1.WallEntity.drawHorizontalLine(0, 0, 32);
        WallEntity_1.WallEntity.drawHorizontalLine(0, 19, 32);
        WallEntity_1.WallEntity.drawVerticalLine(0, 0, 20);
        WallEntity_1.WallEntity.drawVerticalLine(31, 0, 20);
        initPlay.pengejar = new SlideEntity_1.SlideEntity(Entity_1.Entity.createElement('div', { id: 'chaser' }), 1000, 4, { x: 1 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        initPlay.pelari = new SlideEntity_1.SlideEntity(Entity_1.Entity.createElement('div', { id: 'runner' }), 1000, 4, { x: 30 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        WallEntity_1.WallEntity.sign(initPlay.pengejar, function () {
            initPlay.pengejar.stop();
            return true;
        });
        WallEntity_1.WallEntity.sign(initPlay.pelari, function () {
            initPlay.pelari.stop();
            return true;
        });
        initPlay.pengejar.onBothCollision(initPlay.pelari, function () {
            clearInterval(initPlay.countStart);
            initPlay.pelari.destroy();
            Card_1.Card.show('offline@chaser-win');
            return true;
        });
        var watchDog = function () {
            XHRApi_1.xhr.get('/api/room/' + initPlay.roomName + '/watch', function (res) {
                var obj = JSON.parse(res);
                var entity = obj.role == 'chaser' ? initPlay.pengejar : initPlay.pelari;
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
        console.log(initPlay.yourRole);
        if (initPlay.yourRole == 'chaser') {
            initPlay.pelari.deleteKeymap('left');
            initPlay.pelari.deleteKeymap('up');
            initPlay.pelari.deleteKeymap('right');
            initPlay.pelari.deleteKeymap('down');
            watchDog();
            initPlay.pengejar.remap('left', 'a', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'left', role: 'chaser' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('up', 'w', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'up', role: 'chaser' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('right', 'd', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'right', role: 'chaser' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pengejar.remap('down', 's', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'down', role: 'chaser' }, function (res) {
                    console.log(res);
                });
            });
        }
        else {
            initPlay.pengejar.deleteKeymap('left');
            initPlay.pengejar.deleteKeymap('up');
            initPlay.pengejar.deleteKeymap('right');
            initPlay.pengejar.deleteKeymap('down');
            watchDog();
            initPlay.pelari.remap('left', 'a', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'left', role: 'runner' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('up', 'w', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'up', role: 'runner' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('right', 'd', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'right', role: 'runner' }, function (res) {
                    console.log(res);
                });
            });
            initPlay.pelari.remap('down', 's', function () {
                XHRApi_1.xhr.post('/api/room/' + initPlay.roomName + '/move', { dir: 'down', role: 'runner' }, function (res) {
                    console.log(res);
                });
            });
        }
    }
    initPlay.online = online;
    function offline() {
        timerStart();
        WallEntity_1.WallEntity.drawHorizontalLine(0, 0, 32);
        WallEntity_1.WallEntity.drawHorizontalLine(0, 19, 32);
        WallEntity_1.WallEntity.drawVerticalLine(0, 0, 20);
        WallEntity_1.WallEntity.drawVerticalLine(31, 0, 20);
        initPlay.pengejar = new SlideEntity_1.SlideEntity(Entity_1.Entity.createElement('div', { id: 'chaser' }), 1000, 4, { x: 1 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        initPlay.pelari = new SlideEntity_1.SlideEntity(Entity_1.Entity.createElement('div', { id: 'runner' }), 1000, 4, { x: 30 * 32, y: 1 * 32 }, { x: 32, y: 32 });
        initPlay.pelari.remap('left', 'j');
        initPlay.pelari.remap('up', 'i');
        initPlay.pelari.remap('right', 'l');
        initPlay.pelari.remap('down', 'k');
        WallEntity_1.WallEntity.sign(initPlay.pengejar, function () {
            initPlay.pengejar.stop();
            return true;
        });
        WallEntity_1.WallEntity.sign(initPlay.pelari, function () {
            initPlay.pelari.stop();
            return true;
        });
        initPlay.pengejar.onBothCollision(initPlay.pelari, function () {
            clearInterval(initPlay.countStart);
            initPlay.pelari.destroy();
            Card_1.Card.show('offline@chaser-win');
            return true;
        });
    }
    initPlay.offline = offline;
})(initPlay = exports.initPlay || (exports.initPlay = {}));
