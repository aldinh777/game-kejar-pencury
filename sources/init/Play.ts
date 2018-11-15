import { SlideEntity } from "../entity/SlideEntity";
import { Entity } from "../lib/Entity";
import { WallEntity } from "../entity/WallEntity";
import { Card } from "../lib/Card";
import { xhr } from "../lib/XHRApi";

export namespace initPlay {

	const globalTimeLimit: number = 60;
	
	export let countStart;
	export let roomName: string = "yoyo";
	export let yourRole: 'chaser'|'runner';
	export let enemyRole: 'chaser'|'runner';

	function timerStart(): void {
		let timeLimit: number = globalTimeLimit;
		const countDown: ()=>void = ():void => {
			timeLimit--;
			if (timeLimit <= 0) {
				clearInterval(countStart);
				pengejar.destroy();
				Card.show('offline@runner-win');
			}
		}
		countStart = setInterval(countDown, 1000);
	}

	export let pengejar: SlideEntity;
	export let pelari: SlideEntity;
	
	export function online(): void {

		timerStart();

		WallEntity.drawHorizontalLine(0, 0, 32);
		WallEntity.drawHorizontalLine(0, 19, 32);
		WallEntity.drawVerticalLine(0, 0, 20);
		WallEntity.drawVerticalLine(31, 0, 20);

		pengejar = new SlideEntity(Entity.createElement('div', {id:'chaser'}), 1000, 4, {x:1*32, y:1*32}, {x:32, y:32});
		pelari = new SlideEntity(Entity.createElement('div', {id:'runner'}), 1000, 4, {x:30*32, y:1*32}, {x:32, y:32});

		WallEntity.sign(pengejar, ()=> {
			pengejar.stop();
			return true;
		});
		WallEntity.sign(pelari, ()=> {
			pelari.stop();
			return true;
		});

		pengejar.onBothCollision(pelari, ()=> {
			clearInterval(initPlay.countStart);
			pelari.destroy();
			Card.show('offline@chaser-win');
			return true;
		});

		const watchDog = ()=> {
			xhr.get('/api/room/'+initPlay.roomName+'/watch', (res)=> {
				const obj = JSON.parse(res);
				const entity: Entity = obj.role == 'chaser' ? pengejar : pelari;
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
		}

		console.log(initPlay.yourRole);
		if (initPlay.yourRole == 'chaser') {
			pelari.deleteKeymap('left');
			pelari.deleteKeymap('up');
			pelari.deleteKeymap('right');
			pelari.deleteKeymap('down');
			watchDog();
			pengejar.remap('left', 'a', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'left', role:'chaser'}, (res)=> {
					console.log(res);
				});
			});
			pengejar.remap('up', 'w', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'up', role:'chaser'}, (res)=> {
					console.log(res);
				});
			});
			pengejar.remap('right', 'd', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'right', role:'chaser'}, (res)=> {
					console.log(res);
				});
			});
			pengejar.remap('down', 's', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'down', role:'chaser'}, (res)=> {
					console.log(res);
				});
			});
		} else {
			pengejar.deleteKeymap('left');
			pengejar.deleteKeymap('up');
			pengejar.deleteKeymap('right');
			pengejar.deleteKeymap('down');
			watchDog();
			pelari.remap('left', 'a', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'left', role:'runner'}, (res)=> {
					console.log(res);
				});
			});
			pelari.remap('up', 'w', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'up', role:'runner'}, (res)=> {
					console.log(res);
				});
			});
			pelari.remap('right', 'd', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'right', role:'runner'}, (res)=> {
					console.log(res);
				});
			});
			pelari.remap('down', 's', ()=> {
				xhr.post('/api/room/'+initPlay.roomName+'/move', {dir:'down', role:'runner'}, (res)=> {
					console.log(res);
				});
			});	
		}
	}
	export function offline(): void {
		timerStart();

		WallEntity.drawHorizontalLine(0, 0, 32);
		WallEntity.drawHorizontalLine(0, 19, 32);
		WallEntity.drawVerticalLine(0, 0, 20);
		WallEntity.drawVerticalLine(31, 0, 20);

		pengejar = new SlideEntity(Entity.createElement('div', {id:'chaser'}), 1000, 4, {x:1*32, y:1*32}, {x:32, y:32});
		pelari = new SlideEntity(Entity.createElement('div', {id:'runner'}), 1000, 4, {x:30*32, y:1*32}, {x:32, y:32});

		pelari.remap('left', 'j');
		pelari.remap('up', 'i');
		pelari.remap('right', 'l');
		pelari.remap('down', 'k');

		WallEntity.sign(pengejar, ()=> {
			pengejar.stop();
			return true;
		});
		WallEntity.sign(pelari, ()=> {
			pelari.stop();
			return true;
		});

		pengejar.onBothCollision(pelari, ()=> {
			clearInterval(initPlay.countStart);
			pelari.destroy();
			Card.show('offline@chaser-win');
			return true;
		});
	}
}
