import { join } from 'path';

import Inquirer from 'inquirer';

import replaceInFile from '../lib/replaceInFile.js';

export default async ({ asarExtractPath }) => {
  let { branch } = await Inquirer.prompt([
    {
      type: 'checkbox',

      name: 'branch',

      message: 'GooseUpdate mods',

      choices: [
        { name: 'goosemod', checked: true },

        'smartcord',
        'betterdiscord'
      ]
    }
  ]);

  branch = branch.join('+');

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