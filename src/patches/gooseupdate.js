import { join } from 'path';

import replaceInFile from '../lib/replaceInFile.js';

export default ({ asarExtractPath }, { branch }) => {
  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'Constants.js'),
    `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT`,
    `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}'`);

  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'Constants.js'),
    `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'`,
    `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}/'`);

  replaceInFile(join(asarExtractPath, 'common', 'Settings.js'),
    `return defaultValue`,
    `return key === 'SKIP_HOST_UPDATE' ? true : defaultValue`);
};