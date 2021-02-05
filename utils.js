import fs from 'fs';

export const readFile = file => {
  return JSON.parse(fs.readFileSync(`./server/data/${file}.json`));
};

export const writeFile = (file, content) => {
  fs.writeFileSync(`./server/data/${file}.json`, JSON.stringify(content, null, 2));
};