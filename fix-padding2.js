import fs from 'fs';

let file = fs.readFileSync('src/App.tsx', 'utf-8');

file = file.replace(/gap-6 sm:p-12/g, 'gap-12');
file = file.replace(/p-6 sm:p-6 sm:p-12/g, 'p-6 sm:p-12');
file = file.replace(/md:p-6 sm:p-12/g, 'md:p-12');

fs.writeFileSync('src/App.tsx', file);
console.log('Fixed padding mistakes in App.tsx');
