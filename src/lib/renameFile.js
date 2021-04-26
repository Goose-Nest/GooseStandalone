import { copyFileSync, rmSync } from 'fs';

export default (oldPath, newPath) => {
  copyFileSync(oldPath, newPath);
  rmSync(oldPath);
};