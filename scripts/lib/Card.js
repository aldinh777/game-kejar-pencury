class Card {
    constructor(title, options) {
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
    static create(name, card) {
        this.keyCards.push({ name, card });
    }
    static replace(name, card) {
        this.keyCards = this.keyCards.map((keyCard) => {
            if (keyCard.name == name) {
                return { name, card };
            }
            return keyCard;
        });
    }
    static delete(name) {
        this.keyCards = this.keyCards.filter((keyCard) => {
            return keyCard.name != name;
        });
    }
    static show(name) {
        this.hide();
        for (const keyCard of this.keyCards) {
            if (keyCard.name == name) {
                this.layer.appendChild(keyCard.card.elem);
                this.currentCard = keyCard.card;
                return;
            }
        }
        throw new Error('Card "' + name + '" not Found');
    }
    static hide() {
        if (this.currentCard) {
            this.layer.removeChild(this.currentCard.elem);
            this.currentCard = null;
        }
    }
    static button(text, callback) {
        const button = document.createElement('button');
        button.appendChild(document.createTextNode(text));
        button.onclick = callback;
        return button;
    }
    static backButton(text, callback) {
        const back = this.button(text, callback);
        back.classList.add('back');
        return back;
    }
    static label(text) {
        const elem = document.createElement('div');
        elem.classList.add('label');
        elem.appendChild(document.createTextNode(text));
        return elem;
    }
    static pre(text) {
        const elem = document.createElement('pre');
        elem.appendChild(document.createTextNode(text));
        return elem;
    }
    static input(idInput) {
        const input = document.createElement('input');
        input.id = idInput;
        return input;
    }
    static value(idElement) {
        const input = document.getElementById(idElement);
        if (!input) {
            throw new Error('input with ID ' + idElement + ' was not found');
        }
        return input.value;
    }
}
Card.layer = document.getElementById('main');
Card.keyCards = new Array();

module.exports = Card;
