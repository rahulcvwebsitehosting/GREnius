import fs from 'fs';

let file = fs.readFileSync('src/components/ChessGame.tsx', 'utf-8');

file = file.replace(/\\\\`/g, '`');
file = file.replace(/\\\\\\$/g, '$');
file = file.replace(/\\\`/g, '`');
file = file.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/ChessGame.tsx', file);
console.log('Fixed backslashes again');
