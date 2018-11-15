interface KeyCard {
	name: string;
	card: Card;
}

export class Card {
	protected static layer: HTMLElement = document.getElementById('main');
	protected static currentCard: Card;
	protected static keyCards: Array<KeyCard> = [];
	protected elem: HTMLElement;
	protected options;

	public constructor(title: string, options: Array<HTMLElement>) {
		const elem = document.createElement('div');
		elem.classList.add('card');
		this.elem = elem;

		const header = document.createElement('div');
		header.classList.add('title');
		header.appendChild(document.createTextNode(title));
		elem.appendChild(header);
		elem.appendChild(document.createElement('hr'));

		const opt = document.createElement('div');
		opt.classList.add('option');

		for (const option of options) {
			opt.appendChild(option);
		}
		elem.appendChild(opt);
	}
	public static create(name: string, card: Card): void {
		this.keyCards.push({name, card})
	}
	public static replace(name: string, card: Card): void {
		this.keyCards = this.keyCards.map<KeyCard>((keyCard: KeyCard): KeyCard=> {
			if (keyCard.name == name) {
				return { name, card }
			}
			return keyCard;
		})
	}
	public static delete(name: string): void {
		this.keyCards = this.keyCards.filter((keyCard: KeyCard): boolean=> {
			return keyCard.name != name;
		});
	}
	public static show(name: string): void {
		this.hide();
		for (const keyCard of this.keyCards) {
			if (keyCard.name == name) {
				this.layer.appendChild(keyCard.card.elem);
				this.currentCard = keyCard.card;
				return;
			}
		}
		throw new Error('Card "'+name+'" not Found');
	}
	public static hide(): void {
		if (this.currentCard) {
			this.layer.removeChild(this.currentCard.elem);
			this.currentCard = null;
		}
	}
	public static button(text: string, callback?: ()=>void): HTMLElement {
		const button: HTMLElement = document.createElement('button');
		button.appendChild(document.createTextNode(text));
		button.onclick = callback;
		return button;
	}
	public static backButton(text: string, callback?: ()=>void): HTMLElement {
		const back: HTMLElement = this.button(text, callback);
		back.classList.add('back');
		return back;
	}
	public static label(text: string): HTMLElement {
		const elem = document.createElement('div');
		elem.classList.add('label');
		elem.appendChild(document.createTextNode(text));
		return elem;
	}
	public static pre(text: string): HTMLElement {
		const elem = document.createElement('pre');
		elem.appendChild(document.createTextNode(text));
		return elem;
	}
	public static input(idInput: string): HTMLElement {
		const input: HTMLInputElement = document.createElement('input');
		input.id = idInput;
		return input;
	}
	public static value(idElement: string): string {
		const input: HTMLInputElement = <HTMLInputElement>document.getElementById(idElement);
		if (!input) {
			throw new Error('input with ID '+idElement+' was not found');
		}
		return input.value;
	}
}
