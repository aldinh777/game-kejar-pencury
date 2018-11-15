"use strict";
exports.__esModule = true;
var Cards_1 = require("./init/Cards");
var Card_1 = require("./lib/Card");
Cards_1.initCards.title();
Cards_1.initCards.online();
Cards_1.initCards.offline();
Card_1.Card.show('main-menu');
