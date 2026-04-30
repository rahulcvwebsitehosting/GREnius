import { Chess } from 'chess.js';
const chess = new Chess();
// Test moves(square, verbose)
const moves = chess.moves({ square: 'e2', verbose: true });
console.log('Moves from e2:', JSON.stringify(moves[0]));
// Test move object
try {
    const m = chess.move({ from: 'e2', to: 'e4', promotion: 'q' });
    console.log('Move e2-e4 success:', !!m);
} catch (e) {
    console.log('Move e2-e4 throw:', e.message);
}
// Test board()
const board = chess.board();
console.log('Board[0][0]:', JSON.stringify(board[0][0]));
