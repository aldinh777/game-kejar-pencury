import { Entity, Coord } from "../lib/Entity";

export class WallEntity extends Entity {
	protected static walls: Array<WallEntity> = new Array<WallEntity>();
	protected static gap: number = 32;

	public constructor(element: HTMLElement, position?: Coord, hitbox?: Coord, hitboxStart?: Coord) {
		super(element, 0, position, hitbox, hitboxStart);
		this.deleteKeymap('left');
		this.deleteKeymap('right');
		this.deleteKeymap('up');
		this.deleteKeymap('down');
		WallEntity.layer.appendChild(element);
	}
	public static drawPoint(x: number, y: number) {
		WallEntity.walls.push(new WallEntity(Entity.createElement('div', {className: 'wall'}), {x:x*WallEntity.gap, y:y*WallEntity.gap}, {x:32, y:32}));
	}
	public static drawVerticalLine(x: number, y: number, size: number): void {
		for (let i=y; i<size; i++) {
			WallEntity.drawPoint(x, y+i);
		}
	}
	public static drawHorizontalLine(x: number, y: number, size: number): void {
		for (let i=x; i<size; i++) {
			WallEntity.drawPoint(x+i, y);
		}
	}
	public static sign(entity: Entity, callback: ()=>boolean): void {
		for (const wall of WallEntity.walls) {
			entity.onCollision(wall, callback);
		}
	}
	public static clearAll(): void {
		while(WallEntity.walls.length) {
			const wall = WallEntity.walls.pop();
			WallEntity.layer.removeChild(wall.element);
		}
	}
}