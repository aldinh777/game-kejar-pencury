var express = require('express');
var router = express.Router();
var events = require('events');
var roomEmitter = new events.EventEmitter();

let rooms = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Game Kejar Pencury' });
});

router.post('/api/room/create', function(req, res, next) {
  rooms[req.body.name] = { host: req.body.host, guest: req.body.guest };
  res.send('Room Created');
});

router.get('/api/room/:roomName/wait', function(req, res, next) {
  roomEmitter.once('ready', ()=> {
    res.send('ready');
  });
});

router.post('/api/room/switch', function(req, res, next) {
  rooms[req.body.name] = { host: req.body.host, guest: req.body.guest };
  roomEmitter.emit('switch');
  res.send('Switched');
});

router.get('/api/room/:roomName/switch', function(req, res, next) {
  roomEmitter.once('switch', ()=> {
    res.json(rooms[req.params.roomName]);
  });
});

router.get('/api/room/:roomName/join', function(req, res, next) {
  if (rooms[req.params.roomName]) {
    return res.json(rooms[req.params.roomName]);
  }
  res.send('Not Found');
});

router.get('/api/room/:roomName/waitPlay', function(req, res, next) {
  roomEmitter.once('start', ()=> {
    res.send('start');
  });
});

router.post('/api/room/:roomName/start', function(req, res, next) {
  roomEmitter.emit('start');
  res.send('start');
});

router.post('/api/room/:roomName/ready/', function(req, res, next) {
  roomEmitter.emit('ready');
  res.send('ready');
});

router.get('/api/room/:roomName/watch', function(req, res, next) {
  roomEmitter.once('move', (args)=> {
    res.send(JSON.stringify(args));
  });
});

router.post('/api/room/:roomName/move', function(req, res, next) {
  roomEmitter.emit('move', {dir:req.body.dir, role:req.body.role});
  res.send({dir:req.body.dir, role:req.body.role});
});

module.exports = router;
