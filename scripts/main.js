const initCards = require('./init/Cards');
const Card = require('./lib/Card');

initCards.title();
initCards.online();
initCards.offline();
Card.show('main-menu');
document.getElementById('main').style.backgroundSize = `100% 100%`;
