const express = require('express');
const app = express();
app.use(express.json());
app.get('/test', (req, res) => res.json({ok: true}));
app.post('/api/stockfish/move', (req, res) => res.json({bestMove: 'e2e4'}));
app.post('/api/stockfish/configure', (req, res) => res.json({success: true}));
const server = app.listen(5175, '0.0.0.0', () => {
  console.log('Server listening on', server.address());
  console.log('Listening:', server.listening);
});
server.on('error', (err) => console.error('Server error:', err));
server.on('listening', () => console.log('Server listening event fired'));