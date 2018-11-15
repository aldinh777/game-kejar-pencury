import { Entity, Coord } from "../lib/Entity";

export class SlideEntity extends Entity {
	protected direction: 'left'|'right'|'up'|'down'|'none';
	protected queueDirection: 'left'|'right'|'up'|'down'|'none';
	protected isMoving: boolean;
	protected speed: number;

	public constructor(element: HTMLElement, speed?: number, range?: number, position?: Coord, hitbox?: Coord, hitboxStart?: Coord) {
		super(element, range, position, hitbox, hitboxStart);
		this.speed = speed || 10;
		this.direction = 'none';
	}
	protected slide(): void {
		if (!this.isMoving) {
			this.isMoving = true;
			this.direction = this.queueDirection;
			this.queueDirection = 'none';
			const slideInterval = setInterval(()=> {
				switch (this.direction) {
					case 'left':
						super.moveLeft();
						break;
					case 'right':
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
			}, 1000/this.speed);	
		}
	}
	public stop(): void {
		this.direction = 'none';
	}
	public moveLeft(): void {
		this.queueDirection = 'left';
		this.slide();
	}
	public moveRight(): void {
		this.queueDirection = 'right';
		this.slide();
	}
	public moveUp(): void {
		this.queueDirection = 'up';
		this.slide();
	}
	public moveDown(): void {
		this.queueDirection = 'down';
		this.slide();
	}
}