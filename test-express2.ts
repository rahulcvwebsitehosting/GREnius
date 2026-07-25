import express from 'express';

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const server = app.listen(5173, '0.0.0.0', () => {
  console.log('Test server running on http://0.0.0.0:5173');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});