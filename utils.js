import fs from 'fs';

export const isExistFile = (type, file) => {
  return fs.existsSync(`./data/${type}/${file}.json`);
};

export const readFile = (type, file) => {
  return JSON.parse(fs.readFileSync(`./data/${type}/${file}.json`));
};

export const writeFile = (type, file, content) => {
  fs.writeFileSync(`./data/${type}/${file}.json`, JSON.stringify(content, null, 2));
};