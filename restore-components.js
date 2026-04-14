import fs from 'fs';

let chessGameFile = fs.readFileSync('src/components/ChessGame.tsx', 'utf-8');
let appFile = fs.readFileSync('src/App.tsx', 'utf-8');

const splitMarker = "function WordScramble";
const splitIndex = chessGameFile.indexOf(splitMarker);

if (splitIndex === -1) {
  console.error('Split marker not found');
  process.exit(1);
}

const chessGameOnly = chessGameFile.substring(0, splitIndex);
const restOfCode = chessGameFile.substring(splitIndex);

fs.writeFileSync('src/components/ChessGame.tsx', chessGameOnly);

const appSplitMarker = "const MemoryPalace = ({";
const appSplitIndex = appFile.indexOf(appSplitMarker);

if (appSplitIndex === -1) {
  console.error('App split marker not found');
  process.exit(1);
}

appFile = appFile.substring(0, appSplitIndex) + restOfCode + appFile.substring(appSplitIndex);

fs.writeFileSync('src/App.tsx', appFile);
console.log('Restored other components to App.tsx');
