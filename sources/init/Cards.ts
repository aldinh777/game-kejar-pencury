import { Card } from "../lib/Card";
import { initPlay } from "./Play";
import { WallEntity } from "../entity/WallEntity";
import { xhr } from "../lib/XHRApi";

export namespace initCards {
	
	export function title(): void {
		Card.create('main-menu', new Card('Game Kejar-Kejaran', [
			Card.button('Play', ()=> Card.show('play')),
			Card.button('Control', ()=> Card.show('control')),
			Card.button('Help', ()=> Card.show('help')),
			Card.button('About', ()=> Card.show('about'))
		]));
	
		Card.create('play', new Card('Play', [
			Card.button('Online', ()=> Card.show('online')),
			Card.button('Offline', ()=> {
				Card.hide();
				initPlay.offline();
			}),
			Card.backButton('Kembali', ()=> Card.show('main-menu'))
		]));
		
		Card.create('control', new Card('Play', [
			Card.label('Pengejar'),
			Card.pre('\ta : Kiri | w : Atas | d : Kanan | s : Bawah'),
			Card.label('Pelari'),
			Card.pre('\tj : Kiri | i : Atas | l : Kanan | k : Bawah'),
			Card.backButton('Kembali', ()=> Card.show('main-menu'))
		]));
	
		Card.create('help', new Card('Help', [
			Card.pre(
				'\tApabila pengejar berhasil menangkap pelari,\n'+
				'\tmaka pengejar yang menang\n'+
				'\n'+
				'\tNamun apabila waktu habis terlebih dahulu\n'+
				'\tmaka pelari yang menang\n'
			),
			Card.backButton('Kembali', ()=> Card.show('main-menu'))
		]));
	
		Card.create('about', new Card('About', [
			Card.label('Director : Muhamad Rizal'),
			Card.label('Designer : Reyhan Yulianata'),
			Card.label('Programmer : Aldi Nur Hendra'),
			Card.backButton('Kembali', ()=> Card.show('main-menu'))
		]));			
	}

	export function online(): void {
		const roleTextHost = document.createElement('pre');
		const roleTextGuest = document.createElement('pre');
		const startButton = Card.button('Mulai', ()=> {
			xhr.post('/api/room/'+initPlay.roomName+'/start', {}, (res: string)=> {
				Card.hide();
				initPlay.online();
				console.log(res);
			});
		});
	
		Card.create('online', new Card('Online', [
			Card.button('Buat Room', ()=> Card.show('room@create')),
			Card.button('Join Room', ()=> Card.show('room@join')),
			Card.backButton('Kembali', ()=> Card.show('play'))
		]));
	
		Card.create('room@create', new Card('Buat Room', [
			Card.label('Masukkan Nama Room'),
			Card.input('roomCreate'),
			Card.button('Buat Room', ()=> {
				const roomName = Card.value('roomCreate');
				if (roomName) {
					initPlay.roomName = roomName;
					initPlay.yourRole = 'chaser';
					initPlay.enemyRole = 'runner';
					xhr.post('/api/room/create', {name:initPlay.roomName, host:initPlay.yourRole, guest:initPlay.enemyRole}, (res: string)=> {
						function checkButton() {
							xhr.get('/api/room/'+roomName+'/wait', (res: string)=> {
								if (res == 'ready') {
									startButton.removeAttribute('disabled');
								} else {
									startButton.setAttribute('disabled', 'disabled');
								}
								checkButton();
								console.log(res);
							});
						}
						
						while (roleTextHost.lastChild) {
							roleTextHost.removeChild(roleTextHost.lastChild);
						}
						const yourRole = initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
						const enemyRole = initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
						roleTextHost.appendChild(document.createTextNode('\t\tHost : '+yourRole+'\n'));
						roleTextHost.appendChild(document.createTextNode('\t\tGuest : '+enemyRole+'\n'));
						startButton.setAttribute('disabled', 'disabled');
						Card.show('room@host-waiting');
						checkButton();
						console.log(res);
					});
				} else {
					alert('Harap isi Nama Room');
				}
			}),
			Card.backButton('Kembali', ()=> Card.show('online'))
		]));
	
		Card.create('room@join', new Card('Join Room', [
			Card.label('Masukkan Nama Room'),
			Card.input('roomJoin'),
			Card.button('Join Room', ()=> {
				const roomName = Card.value('roomJoin');
				initPlay.roomName = roomName;
				xhr.get('/api/room/'+roomName+'/join', (res)=> {
					if (res == 'Not Found') {
						alert('Room Not Found');
					} else {
						const checkSwitch = ()=> {
							xhr.get('/api/room/'+roomName+'/switch', (res)=> {
								const roomInfo = JSON.parse(res);
								initPlay.yourRole = roomInfo.guest;
								initPlay.enemyRole = roomInfo.host;
									while (roleTextGuest.lastChild) {
									roleTextGuest.removeChild(roleTextGuest.lastChild);
								}
								const yourRole = initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
								const enemyRole = initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
								roleTextGuest.appendChild(document.createTextNode('\t\tHost : '+enemyRole+'\n'));
								roleTextGuest.appendChild(document.createTextNode('\t\tGuest : '+yourRole+'\n'));	
								checkSwitch();
								console.log(res);
							});
						}
	
						const roomInfo = JSON.parse(res);
						initPlay.yourRole = roomInfo.guest;
						initPlay.enemyRole = roomInfo.host;
						while (roleTextGuest.lastChild) {
							roleTextGuest.removeChild(roleTextGuest.lastChild);
						}
						const yourRole = initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
						const enemyRole = initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
						roleTextGuest.appendChild(document.createTextNode('\t\tHost : '+enemyRole+'\n'));
						roleTextGuest.appendChild(document.createTextNode('\t\tGuest : '+yourRole+'\n'));
						Card.show('room@guest-waiting');
						checkSwitch();
						xhr.get('/api/room/'+roomName+'/waitPlay', (res)=> {
							Card.hide();
							initPlay.online();
							console.log(res);
						});
						console.log(res);
					}
				});
			}),
			Card.backButton('Kembali', ()=> Card.show('play'))
		]));
	
		Card.create('room@host-waiting', new Card('Nama Room', [
			roleTextHost,
			Card.button('Tukar Role', ()=> {
				if (initPlay.yourRole == 'chaser') {
					initPlay.yourRole = 'runner';
					initPlay.enemyRole = 'chaser';
				} else {
					initPlay.yourRole = 'chaser';
					initPlay.enemyRole = 'runner';
				}
				while (roleTextHost.lastChild) {
					roleTextHost.removeChild(roleTextHost.lastChild);
				}
				const yourRole = initPlay.yourRole == 'chaser' ? 'Pengejar' : 'Pelari';
				const enemyRole = initPlay.enemyRole == 'chaser' ? 'Pengejar' : 'Pelari';
				xhr.post('/api/room/'+initPlay.roomName+'/switch', { name:initPlay.roomName, host:initPlay.yourRole, guest:initPlay.enemyRole }, (res: string)=> {
					roleTextHost.appendChild(document.createTextNode('\t\tHost : '+yourRole+'\n'));
					roleTextHost.appendChild(document.createTextNode('\t\tGuest : '+enemyRole+'\n'));
					console.log(res);
				});
			}),
			startButton,
			Card.backButton('Keluar', ()=> Card.show('room@create'))
		]));
		
		Card.create('room@guest-waiting', new Card('Nama Room', [
			roleTextGuest,
			Card.button('Siap', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/ready', {status:'ready'}, (res: string)=> {
					console.log(res);
				})
			}),
			Card.backButton('Keluar', ()=> Card.show('room@join'))
		]));
	}

	export function offline(): void {
		Card.create('offline@chaser-win', new Card('Pengejar Menang', [
			Card.button('Main Lagi', ()=> {
				initPlay.pengejar.destroy();
				WallEntity.clearAll();
				Card.hide();
				initPlay.offline();
			}),
			Card.backButton('Keluar', ()=> {
				initPlay.pengejar.destroy();
				WallEntity.clearAll();
				Card.show('main-menu');
			})
		]));
	
		Card.create('offline@runner-win', new Card('Pelari Menang', [
			Card.button('Main Lagi', ()=> {
				initPlay.pelari.destroy();
				WallEntity.clearAll();
				Card.hide();
				initPlay.offline();
			}),
			Card.backButton('Keluar', ()=> {
				initPlay.pelari.destroy();
				WallEntity.clearAll();
				Card.show('main-menu');
			})
		]));
	}
}
