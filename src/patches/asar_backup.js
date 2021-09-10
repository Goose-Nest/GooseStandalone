import { copyFileSync } from 'fs';
import { join } from 'path';

export default ({ asarFilePath, basePath }) => {
  copyFileSync(asarFilePath, join(basePath, 'resources', 'app.asar.backup'));
};