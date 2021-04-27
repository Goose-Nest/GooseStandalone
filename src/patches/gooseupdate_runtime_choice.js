import { join } from 'path';

import Inquirer from 'inquirer';

import replaceInFile from '../lib/replaceInFile.js';

export default async ({ asarExtractPath }) => {
  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'Constants.js'),
    `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT`,
    `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || 'https://updates.goosemod.com/' + (process.stdout.write('GooseUpdate mods:\\n1. GooseMod\\n2. BetterDiscord\\n3. SmartCord\\n\\nEnter number(s) of mods> ') ? require('child_process').execSync("bash -c 'read -p \\"foobar\\" inp; echo $inp'", {stdio: ['inherit', 'pipe', 'pipe'] }).toString().replace('1', 'goosemod ').replace('2', 'betterdiscord ').replace('3', 'smartcord ').trim().replace(' ', '+') : '')`);

  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'Constants.js'),
    `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'`,
    `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || (UPDATE_ENDPOINT + '/')`);

  replaceInFile(join(asarExtractPath, 'common', 'Settings.js'),
    `return defaultValue`,
    `return key === 'SKIP_HOST_UPDATE' ? true : defaultValue`);
};