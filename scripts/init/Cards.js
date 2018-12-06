const Card = require("../lib/Card");
const initPlay = require("./Play");
const WallEntity = require("../entity/WallEntity");
const XHRApi = require("../lib/XHRApi");

class initCard {
    static title() {
        Card.create('main-menu', new Card('Game Kejar-Kejaran', [
            Card.button('', 'main.png',() => Card.show('play')),
            Card.button('', 'cara main.png',() => Card.show('control')),
            // Card.button('Help', () => Card.show('help')),
            Card.button('', 'credit.png', () => Card.show('about'))
        ]));
        Card.create('play', new Card('Play', [
            Card.button('', 'online.png', () => Card.show('online')),
            Card.button('', 'offline.png', () => {
                document.getElementById('main').style.backgroundImage = `url('/images/gajaraya/background.png')`;
                document.getElementById('main').style.backgroundSize = `32px 32px')`;
                Card.hide();
                initPlay.offline();
            }),
            Card.backButton('Kembali', () => Card.show('main-menu'))
        ]));
        Card.create('control', new Card('Play', [
            Card.label('Pengejar'),
            Card.pre('\ta : Kiri | w : Atas | d : Kanan | s : Bawah'),
            Card.label('Pelari'),
            Card.pre('\tj : Kiri | i : Atas | l : Kanan | k : Bawah'),
            Card.backButton('Kembali', () => Card.show('main-menu'))
        ]));
        Card.create('help', new Card('Help', [
            Card.pre('\tApabila pengejar berhasil menangkap pelari,\n' +
                '\tmaka pengejar yang menang\n' +
                '\n' +
                '\tNamun apabila waktu habis terlebih dahulu\n' +
                '\tmaka pelari yang menang\n'),
            Card.backButton('Kembali', () => Card.show('main-menu'))
        ]));
        Card.create('about', new Card('About', [
            Card.label('Director : Muhamad Rizal'),
            Card.label('Designer : Reyhan Yulianata'),
            Card.label('Programmer : Aldi Nur Hendra'),
            Card.backButton('Kembali', () => Card.show('main-menu'))
        ]));
    }
    
    static online() {
        const xhr = new XHRApi();
        const roleTextHost = document.createElement('pre');
        const roleTextGuest = document.createElement('pre');

        const startButton = Card.button('Mulai', () => {
            xhr.post('/api/room/' + initCard.roomName + '/start', {}, (res) => {
                document.getElementById('main').style.backgroundImage = `url('/images/gajaraya/background.png')`;
                document.getElementById('main').style.backgroundSize = `32px 32px'`;
                Card.hide();
                initPlay.online(initCard.roomName, initCard.yourRole);
                console.log(res);
            });
        });
        Card.create('online', new Card('Online', [
            Card.button('', 'buat room.png', () => Card.show('room@create')),
            Card.button('', 'cari room.png', () => Card.show('room@join')),
            Card.backButton('Kembali', () => Card.show('play'))
        ]));
        Card.create('room@create', new Card('Buat Room', [
            Card.label('Masukkan Nama Room'),
            Card.input('roomCreate'),
            Card.button('', 'buat room.png', () => {
                const roomName = Card.value('roomCreate');
                if (roomName) {
                    initCard.roomName = roomName;
                    initCard.yourRole = 'chaser';
                    initCard.enemyRole = 'runner';
                    xhr.post('/api/room/create', { name: initCard.roomName, host: initCard.yourRole, guest: initCard.enemyRole }, (res) => {
                        while (roleTextHost.lastChild) {
                            roleTextHost.removeChild(roleTextHost.lastChild);
                        }
                        xhr.get('/api/room/' + initCard.roomName + '/wait', (res) => {
                            startButton.removeAttribute('disabled');
                            console.log(res);
                        });
                        const yourRole = initCard.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        const enemyRole = initCard.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        roleTextHost.appendChild(document.createTextNode('\t\tHost : ' + yourRole + '\n'));
                        roleTextHost.appendChild(document.createTextNode('\t\tGuest : ' + enemyRole + '\n'));
                        startButton.setAttribute('disabled', 'disabled');
                        Card.show('room@host-waiting');
                        console.log(res);
                    });
                }
                else {
                    alert('Harap isi Nama Room');
                }
            }),
            Card.backButton('Kembali', () => Card.show('online'))
        ]));
        Card.create('room@join', new Card('Join Room', [
            Card.label('Masukkan Nama Room'),
            Card.input('roomJoin'),
            Card.button('', 'cari room.png', () => {
                const roomName = Card.value('roomJoin');
                initCard.roomName = roomName;
                xhr.get('/api/room/' + initCard.roomName + '/join', (res) => {
                    if (res == 'Not Found') {
                        alert('Room Not Found');
                    }
                    else {
                        const checkSwitch = ()=> {
                            xhr.get('/api/room/' + initCard.roomName + '/switch', (res) => {
                                const roomInfo = JSON.parse(res);
                                initCard.yourRole = roomInfo.guest;
                                initCard.enemyRole = roomInfo.host;
                                while (roleTextGuest.lastChild) {
                                    roleTextGuest.removeChild(roleTextGuest.lastChild);
                                }
                                const yourRole = initCard.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                                const enemyRole = initCard.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                                roleTextGuest.appendChild(document.createTextNode('\t\tHost : ' + enemyRole + '\n'));
                                roleTextGuest.appendChild(document.createTextNode('\t\tGuest : ' + yourRole + '\n'));
                                checkSwitch();
                                console.log(res);
                            });
                        };
                        const roomInfo = JSON.parse(res);
                        initCard.yourRole = roomInfo.guest;
                        initCard.enemyRole = roomInfo.host;
                        while (roleTextGuest.lastChild) {
                            roleTextGuest.removeChild(roleTextGuest.lastChild);
                        }
                        const yourRole = initCard.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        const enemyRole = initCard.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                        roleTextGuest.appendChild(document.createTextNode('\t\tHost : ' + enemyRole + '\n'));
                        roleTextGuest.appendChild(document.createTextNode('\t\tGuest : ' + yourRole + '\n'));
                        Card.show('room@guest-waiting');
                        xhr.get('/api/room/' + initCard.roomName + '/waitPlay', (res) => {
                            Card.hide();
                            initPlay.online(initCard.roomName, initCard.yourRole);
                            console.log(res);
                        });
                        checkSwitch();
                        console.log(res);
                    }
                });
            }),
            Card.backButton('Kembali', () => Card.show('play'))
        ]));
        Card.create('room@host-waiting', new Card('Nama Room', [
            roleTextHost,
            Card.button('Tukar Role', () => {
                if (initCard.yourRole == 'chaser') {
                    initCard.yourRole = 'runner';
                    initCard.enemyRole = 'chaser';
                }
                else {
                    initCard.yourRole = 'chaser';
                    initCard.enemyRole = 'runner';
                }
                while (roleTextHost.lastChild) {
                    roleTextHost.removeChild(roleTextHost.lastChild);
                }
                const yourRole = initCard.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
                const enemyRole = initCard.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
                xhr.post('/api/room/switch', { name: initCard.roomName, host: initCard.yourRole, guest: initCard.enemyRole }, (res) => {
                    roleTextHost.appendChild(document.createTextNode('\t\tHost : ' + yourRole + '\n'));
                    roleTextHost.appendChild(document.createTextNode('\t\tGuest : ' + enemyRole + '\n'));
                    console.log(res);
                });
            }),
            startButton,
            Card.backButton('Keluar', () => Card.show('room@create'))
        ]));
        Card.create('room@guest-waiting', new Card('Nama Room', [
            roleTextGuest,
            Card.button('Siap', () => {
                xhr.post('/api/room/' + initCard.roomName + '/ready', { status: 'ready' }, (res) => {
                    console.log(res);
                });
            }),
            Card.backButton('Keluar', () => Card.show('room@join'))
        ]));
    }
    
    static offline() {
        Card.create('offline@chaser-win', new Card('Pengejar Menang', [
            Card.backButton('Keluar', () => {
                location.reload();
            })
        ]));
        Card.create('offline@runner-win', new Card('Pelari Menang', [
            Card.backButton('Keluar', () => {
                location.reload();
            })
        ]));
    }    
}

module.exports = initCard;
