import { readFileSync, writeFileSync } from 'fs';

export default (filePath, toReplace, replaceWith) => {
  let content = readFileSync(filePath, 'utf8');
  
  content = content.replaceAll(toReplace, replaceWith);

  writeFileSync(filePath, content);
};