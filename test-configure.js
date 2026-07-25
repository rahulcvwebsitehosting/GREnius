fetch('http://localhost:5174/api/stockfish/configure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    skillLevel: 8,
    elo: 1200
  })
}).then(r => r.json()).then(console.log).catch(console.error);