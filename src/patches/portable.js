import { join } from 'path';

import replaceInFile from '../lib/replaceInFile.js';

export default ({ asarExtractPath }) => {
  replaceInFile(join(asarExtractPath, 'common', 'paths.js'),
    `function determineUserData(userDataRoot, buildInfo) {`,
    `function determineUserData(userDataRoot, buildInfo) { return _path.default.join(process.resourcesPath, '..', 'userData');`);
};