"use strict";
exports.__esModule = true;
var Card_1 = require("../lib/Card");
var Play_1 = require("./Play");
var WallEntity_1 = require("../entity/WallEntity");
var XHRApi_1 = require("../lib/XHRApi");
var initCards;
(function (initCards) {
    function title() {
        Card_1.Card.create('main-menu', new Card_1.Card('Game Kejar-Kejaran', [
            Card_1.Card.button('Play', function () { return Card_1.Card.show('play'); }),
            Card_1.Card.button('Control', function () { return Card_1.Card.show('control'); }),
            Card_1.Card.button('Help', function () { return Card_1.Card.show('help'); }),
            Card_1.Card.button('About', function () { return Card_1.Card.show('about'); })
        ]));
        Card_1.Card.create('play', new Card_1.Card('Play', [
            Card_1.Card.button('Online', function () { return Card_1.Card.show('online'); }),
            Card_1.Card.button('Offline', function () {
                Card_1.Card.hide();
                Play_1.initPlay.offline();
            }),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('main-menu'); })
        ]));
        Card_1.Card.create('control', new Card_1.Card('Play', [
            Card_1.Card.label('Pengejar'),
            Card_1.Card.pre('\ta : Kiri | w : Atas | d : Kanan | s : Bawah'),
            Card_1.Card.label('Pelari'),
            Card_1.Card.pre('\tj : Kiri | i : Atas | l : Kanan | k : Bawah'),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('main-menu'); })
        ]));
        Card_1.Card.create('help', new Card_1.Card('Help', [
            Card_1.Card.pre('\tApabila pengejar berhasil menangkap pelari,\n' +
                '\tmaka pengejar yang menang\n' +
                '\n' +
                '\tNamun apabila waktu habis terlebih dahulu\n' +
                '\tmaka pelari yang menang\n'),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('main-menu'); })
        ]));
        Card_1.Card.create('about', new Card_1.Card('About', [
            Card_1.Card.label('Director : Muhamad Rizal'),
            Card_1.Card.label('Designer : Reyhan Yulianata'),
            Card_1.Card.label('Programmer : Aldi Nur Hendra'),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('main-menu'); })
        ]));
    }
    initCards.title = title;
    function online() {
        var roleTextHost = document.createElement('pre');
        var roleTextGuest = document.createElement('pre');
        var startButton = Card_1.Card.button('Mulai', function () {
            XHRApi_1.xhr.post('/api/room/' + Play_1.initPlay.roomName + '/start', {}, function (res) {
                Card_1.Card.hide();
                Play_1.initPlay.online();
                console.log(res);
            });
        });
        Card_1.Card.create('online', new Card_1.Card('Online', [
            Card_1.Card.button('Buat Room', function () { return Card_1.Card.show('room@create'); }),
            Card_1.Card.button('Join Room', function () { return Card_1.Card.show('room@join'); }),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('play'); })
        ]));
        Card_1.Card.create('room@create', new Card_1.Card('Buat Room', [
            Card_1.Card.label('Masukkan Nama Room'),
            Card_1.Card.input('roomCreate'),
            Card_1.Card.button('Buat Room', function () {
                var roomName = Card_1.Card.value('roomCreate');
                if (roomName) {
                    Play_1.initPlay.roomName = roomName;
                    Play_1.initPlay.yourRole = 'chaser';
                    Play_1.initPlay.enemyRole = 'runner';
                    XHRApi_1.xhr.post('/api/room/create', { name: Play_1.initPlay.roomName, host: Play_1.initPlay.yourRole, guest: Play_1.initPlay.enemyRole }, function (res) {
                        function checkButton() {
                            XHRApi_1.xhr.get('/api/room/' + roomName + '/wait', function (res) {
                                if (res == 'ready') {
                                    startButton.removeAttribute('disabled');
                                }
                                else {
                                    startButton.setAttribute('disabled', 'disabled');
                                }
                                checkButton();
                                console.log(res);
                            });
                        }
                        while (roleTextHost.lastChild) {
                            roleTextHost.removeChild(roleTextHost.lastChild);
                        }
                        var yourRole = Play_1.initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        var enemyRole = Play_1.initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        roleTextHost.appendChild(document.createTextNode('\t\tHost : ' + yourRole + '\n'));
                        roleTextHost.appendChild(document.createTextNode('\t\tGuest : ' + enemyRole + '\n'));
                        startButton.setAttribute('disabled', 'disabled');
                        Card_1.Card.show('room@host-waiting');
                        checkButton();
                        console.log(res);
                    });
                }
                else {
                    alert('Harap isi Nama Room');
                }
            }),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('online'); })
        ]));
        Card_1.Card.create('room@join', new Card_1.Card('Join Room', [
            Card_1.Card.label('Masukkan Nama Room'),
            Card_1.Card.input('roomJoin'),
            Card_1.Card.button('Join Room', function () {
                var roomName = Card_1.Card.value('roomJoin');
                Play_1.initPlay.roomName = roomName;
                XHRApi_1.xhr.get('/api/room/' + roomName + '/join', function (res) {
                    if (res == 'Not Found') {
                        alert('Room Not Found');
                    }
                    else {
                        var checkSwitch_1 = function () {
                            XHRApi_1.xhr.get('/api/room/' + roomName + '/switch', function (res) {
                                var roomInfo = JSON.parse(res);
                                Play_1.initPlay.yourRole = roomInfo.guest;
                                Play_1.initPlay.enemyRole = roomInfo.host;
                                while (roleTextGuest.lastChild) {
                                    roleTextGuest.removeChild(roleTextGuest.lastChild);
                                }
                                var yourRole = Play_1.initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                                var enemyRole = Play_1.initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                                roleTextGuest.appendChild(document.createTextNode('\t\tHost : ' + enemyRole + '\n'));
                                roleTextGuest.appendChild(document.createTextNode('\t\tGuest : ' + yourRole + '\n'));
                                checkSwitch_1();
                                console.log(res);
                            });
                        };
                        var roomInfo = JSON.parse(res);
                        Play_1.initPlay.yourRole = roomInfo.guest;
                        Play_1.initPlay.enemyRole = roomInfo.host;
                        while (roleTextGuest.lastChild) {
                            roleTextGuest.removeChild(roleTextGuest.lastChild);
                        }
                        var yourRole = Play_1.initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        var enemyRole = Play_1.initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        roleTextGuest.appendChild(document.createTextNode('\t\tHost : ' + enemyRole + '\n'));
                        roleTextGuest.appendChild(document.createTextNode('\t\tGuest : ' + yourRole + '\n'));
                        Card_1.Card.show('room@guest-waiting');
                        checkSwitch_1();
                        XHRApi_1.xhr.get('/api/room/' + roomName + '/waitPlay', function (res) {
                            Card_1.Card.hide();
                            Play_1.initPlay.online();
                            console.log(res);
                        });
                        console.log(res);
                    }
                });
            }),
            Card_1.Card.backButton('Kembali', function () { return Card_1.Card.show('play'); })
        ]));
        Card_1.Card.create('room@host-waiting', new Card_1.Card('Nama Room', [
            roleTextHost,
            Card_1.Card.button('Tukar Role', function () {
                if (Play_1.initPlay.yourRole == 'chaser') {
                    Play_1.initPlay.yourRole = 'runner';
                    Play_1.initPlay.enemyRole = 'chaser';
                }
                else {
                    Play_1.initPlay.yourRole = 'chaser';
                    Play_1.initPlay.enemyRole = 'runner';
                }
                while (roleTextHost.lastChild) {
                    roleTextHost.removeChild(roleTextHost.lastChild);
                }
                var yourRole = Play_1.initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                var enemyRole = Play_1.initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                XHRApi_1.xhr.post('/api/room/' + Play_1.initPlay.roomName + '/switch', { name: Play_1.initPlay.roomName, host: Play_1.initPlay.yourRole, guest: Play_1.initPlay.enemyRole }, function (res) {
                    roleTextHost.appendChild(document.createTextNode('\t\tHost : ' + yourRole + '\n'));
                    roleTextHost.appendChild(document.createTextNode('\t\tGuest : ' + enemyRole + '\n'));
                    console.log(res);
                });
            }),
            startButton,
            Card_1.Card.backButton('Keluar', function () { return Card_1.Card.show('room@create'); })
        ]));
        Card_1.Card.create('room@guest-waiting', new Card_1.Card('Nama Room', [
            roleTextGuest,
            Card_1.Card.button('Siap', function () {
                XHRApi_1.xhr.post('/api/room/' + Play_1.initPlay.roomName + '/ready', { status: 'ready' }, function (res) {
                    console.log(res);
                });
            }),
            Card_1.Card.backButton('Keluar', function () { return Card_1.Card.show('room@join'); })
        ]));
    }
    initCards.online = online;
    function offline() {
        Card_1.Card.create('offline@chaser-win', new Card_1.Card('Pengejar Menang', [
            Card_1.Card.button('Main Lagi', function () {
                Play_1.initPlay.pengejar.destroy();
                WallEntity_1.WallEntity.clearAll();
                Card_1.Card.hide();
                Play_1.initPlay.offline();
            }),
            Card_1.Card.backButton('Keluar', function () {
                Play_1.initPlay.pengejar.destroy();
                WallEntity_1.WallEntity.clearAll();
                Card_1.Card.show('main-menu');
            })
        ]));
        Card_1.Card.create('offline@runner-win', new Card_1.Card('Pelari Menang', [
            Card_1.Card.button('Main Lagi', function () {
                Play_1.initPlay.pelari.destroy();
                WallEntity_1.WallEntity.clearAll();
                Card_1.Card.hide();
                Play_1.initPlay.offline();
            }),
            Card_1.Card.backButton('Keluar', function () {
                Play_1.initPlay.pelari.destroy();
                WallEntity_1.WallEntity.clearAll();
                Card_1.Card.show('main-menu');
            })
        ]));
    }
    initCards.offline = offline;
})(initCards = exports.initCards || (exports.initCards = {}));
