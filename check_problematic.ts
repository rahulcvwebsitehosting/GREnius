import fs from 'fs';

const filePath = './src/data.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const match = content.match(/export const ALL_GRE_WORDS: Word\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find ALL_GRE_WORDS array');
  process.exit(1);
}

const arrayStr = match[1];
const objects: any[] = [];
const objectRegex = /\{[\s\S]*?\}(?=\s*[,\]])/g;
let objMatch;
while ((objMatch = objectRegex.exec(arrayStr)) !== null) {
  const objStr = objMatch[0];
  const wordMatch = objStr.match(/"word":\s*"([^"]+)"/);
  const defMatch = objStr.match(/"definition":\s*"([^"]*)"/);
  if (wordMatch && defMatch) {
    objects.push({ word: wordMatch[1], definition: defMatch[1] });
  }
}

console.log('Total words:', objects.length);

const problematic = objects.filter(obj => {
  return obj.word.length < 3 || obj.definition.length < 5;
});

if (problematic.length > 0) {
  console.log('Problematic words found:', problematic);
} else {
  console.log('No obviously problematic words found.');
}
