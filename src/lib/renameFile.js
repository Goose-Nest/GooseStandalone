import { copyFileSync, rmSync, lstatSync } from 'fs';

import copyDirSync from './copyDirSync.js';

export default (oldPath, newPath) => {
  if (lstatSync(join(from, element)).isFile()) {
    copyFileSync(oldPath, newPath);
  } else {
    copyDirSync(oldPath, newPath);
  }

  rmSync(oldPath, { recursive: true, force: true });
};