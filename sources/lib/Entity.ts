export interface Coord {
	x: number;
	y: number;
}

export interface Hitbox {
	minX: number;	maxX: number;
	minY: number;	maxY: number;
}

export interface KeyMap {
	name: string;
	key: string;
	callback: (ev: KeyboardEvent)=> void;
}

export interface EntityCallbackPair {
	entity: Entity;
	callback: ()=> boolean;
}

const keyDownListener: Array<Entity> = new Array<Entity>();
	
window.onkeydown = function(ev: KeyboardEvent) {
	for (const entity of keyDownListener) {
		for (const keymap of entity.getKeymaps()) {
			if (keymap.key.toUpperCase() == ev.key.toUpperCase()) {
				keymap.callback(ev);
			}				
		}
	}
}

export class Entity {
	public static layer: HTMLElement = document.getElementById('main');
	protected collisionListeners: Array<EntityCallbackPair>;
	protected element: HTMLElement;
	protected position: Coord;
	protected hitbox: Coord;
	protected hitboxStart: Coord;
	protected range: number;
	protected keyMaps: Array<KeyMap> = [
		{ name: 'right', key: 'd', callback: ()=> {this.moveRight()} },
		{ name: 'left', key: 'a', callback: ()=> {this.moveLeft()} },
		{ name: 'down', key: 's', callback: ()=> {this.moveDown()} },
		{ name: 'up', key: 'w', callback: ()=> {this.moveUp()} },
	];
	
	public constructor(element: HTMLElement, range?: number, position?: Coord, hitbox?: Coord, hitboxStart?: Coord) {
		this.collisionListeners = new Array<EntityCallbackPair>();
		this.element = element;
		this.range = range || (range==0?0:1);
		this.position = position || {x:0, y:0};
		this.hitbox = hitbox || {x:0, y:0};
		this.hitboxStart = hitboxStart || {x:0, y:0};
		this.move(this.position.x, this.position.y);
		keyDownListener.push(this);
	}
	public static createElement(tag: string, setting?: object): HTMLElement {
		const elem = document.createElement(tag);
		if (setting) {
			for (const key in setting) {
				elem[key] = setting[key];
			}
		}
		elem.classList.add('entity');
		this.layer.appendChild(elem);
		return elem;
	}
	private checkCollision(x?: number, y?: number): boolean {
		for (const listener of this.collisionListeners) {
			const self: Hitbox = this.getHitbox(x, y);
			const target: Hitbox = listener.entity.getHitbox();
			const collisionX: boolean = self.maxX > target.minX && self.minX < target.maxX;
			const collisionY: boolean = self.maxY > target.minY && self.minY < target.maxY;
			if (collisionX && collisionY) {
				if(listener.callback()) {
					return true;
				}
			}
		}
		return false;
	}
	protected move(x: number, y: number): void {
		if(this.checkCollision(x, y)) {
			return;
		}
		this.position.x = x;
		this.position.y = y;
		this.element.style.left = this.position.x+'px';
		this.element.style.top = this.position.y+'px';
	}
	public moveRight(): void {
		this.move(this.position.x + this.range, this.position.y);
	}
	public moveLeft(): void {
		this.move(this.position.x - this.range, this.position.y);
	}
	public moveDown(): void {
		this.move(this.position.x, this.position.y + this.range);
	}
	public moveUp(): void {
		this.move(this.position.x, this.position.y - this.range);
	}
	public getHitbox(x?: number, y?: number): Hitbox {
		return {
			minX:(x==0?0:x||this.position.x) + this.hitboxStart.x,
			minY:(y==0?0:y||this.position.y) + this.hitboxStart.y,
			maxX:(x==0?0:x||this.position.x) + this.hitbox.x,
			maxY:(y==0?0:y||this.position.y) + this.hitbox.y
		}
	}
	public addKeymap(name :string, key: string, callback: (ev: KeyboardEvent)=> void): void {
		this.keyMaps.push({name, key, callback});
	}
	public deleteKeymap(name: string): void {
		this.keyMaps = this.keyMaps.filter((keymap: KeyMap): boolean=> {
			return keymap.name != name;
		});
	}
	public getKeymaps(): Array<KeyMap> {
		return this.keyMaps;
	}
	public remap(name: string, remapKey: string, callback?: ()=>void): void {
		this.keyMaps = this.keyMaps.map<KeyMap>((keymap: KeyMap): KeyMap=> {
			if (keymap.name == name) {
				return { name, key:remapKey, callback:callback||keymap.callback }
			}
			return keymap;
		})
	}
	public destroy(): void {
		this.position = {x:0, y:0};
		this.hitbox = {x:0, y:0};
		this.hitboxStart = {x:0, y:0};
		this.element.parentNode.removeChild(this.element);
		this.keyMaps = [];
	}
	public onCollision(entity: Entity, callback: ()=> boolean): void {
		this.collisionListeners.push({entity, callback});
	}
	public onBothCollision(entity: Entity, callback: ()=> boolean): void {
		this.collisionListeners.push({entity, callback});
		entity.collisionListeners.push({entity: this, callback});
	}
}