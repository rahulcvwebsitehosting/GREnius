fetch('http://localhost:5174/api/stockfish/move', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    depth: 12
  })
}).then(r => r.json()).then(console.log).catch(console.error);