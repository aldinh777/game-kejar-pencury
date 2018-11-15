"use strict";
exports.__esModule = true;
var Card = /** @class */ (function () {
    function Card(title, options) {
        var elem = document.createElement('div');
        elem.classList.add('card');
        this.elem = elem;
        var header = document.createElement('div');
        header.classList.add('title');
        header.appendChild(document.createTextNode(title));
        elem.appendChild(header);
        elem.appendChild(document.createElement('hr'));
        var opt = document.createElement('div');
        opt.classList.add('option');
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            opt.appendChild(option);
        }
        elem.appendChild(opt);
    }
    Card.create = function (name, card) {
        this.keyCards.push({ name: name, card: card });
    };
    Card.replace = function (name, card) {
        this.keyCards = this.keyCards.map(function (keyCard) {
            if (keyCard.name == name) {
                return { name: name, card: card };
            }
            return keyCard;
        });
    };
    Card["delete"] = function (name) {
        this.keyCards = this.keyCards.filter(function (keyCard) {
            return keyCard.name != name;
        });
    };
    Card.show = function (name) {
        this.hide();
        for (var _i = 0, _a = this.keyCards; _i < _a.length; _i++) {
            var keyCard = _a[_i];
            if (keyCard.name == name) {
                this.layer.appendChild(keyCard.card.elem);
                this.currentCard = keyCard.card;
                return;
            }
        }
        throw new Error('Card "' + name + '" not Found');
    };
    Card.hide = function () {
        if (this.currentCard) {
            this.layer.removeChild(this.currentCard.elem);
            this.currentCard = null;
        }
    };
    Card.button = function (text, callback) {
        var button = document.createElement('button');
        button.appendChild(document.createTextNode(text));
        button.onclick = callback;
        return button;
    };
    Card.backButton = function (text, callback) {
        var back = this.button(text, callback);
        back.classList.add('back');
        return back;
    };
    Card.label = function (text) {
        var elem = document.createElement('div');
        elem.classList.add('label');
        elem.appendChild(document.createTextNode(text));
        return elem;
    };
    Card.pre = function (text) {
        var elem = document.createElement('pre');
        elem.appendChild(document.createTextNode(text));
        return elem;
    };
    Card.input = function (idInput) {
        var input = document.createElement('input');
        input.id = idInput;
        return input;
    };
    Card.value = function (idElement) {
        var input = document.getElementById(idElement);
        if (!input) {
            throw new Error('input with ID ' + idElement + ' was not found');
        }
        return input.value;
    };
    Card.layer = document.getElementById('main');
    Card.keyCards = [];
    return Card;
}());
exports.Card = Card;
