import { mkdirSync, readdirSync, lstatSync, copyFileSync } from 'fs';
import { resolve, join } from 'path';

const copyDirSync = (from, to) => {
  mkdirSync(to);

  readdirSync(from).forEach(element => {
    const outPath = resolve(join(to, element));
    if (lstatSync(join(from, element)).isFile()) {
      copyFileSync(join(from, element), outPath);
    } else {
      copyDirSync(join(from, element), outPath);
    }
  });
};

export default copyDirSync;