import express from 'express';

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

app.listen(5173, '0.0.0.0', () => {
  console.log('Test server running on http://0.0.0.0:5173');
});