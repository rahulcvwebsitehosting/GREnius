import fs from 'fs';

let file = fs.readFileSync('src/App.tsx', 'utf-8');

file = file.replace(/className="([^"]*)p-12([^"]*)"/g, 'className="$1p-6 sm:p-12$2"');
file = file.replace(/className="([^"]*) p-12 ([^"]*)"/g, 'className="$1 p-6 sm:p-12 $2"');

fs.writeFileSync('src/App.tsx', file);
console.log('Fixed padding in App.tsx');
