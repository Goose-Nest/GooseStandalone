import { copyFileSync, rmSync, lstatSync } from 'fs';

import copyDirSync from './copyDirSync.js';

export default (oldPath, newPath) => {
  copyFileSync(oldPath, newPath);

  rmSync(oldPath, { recursive: true, force: true });
};