import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { rmSync } from 'fs';

import Inquirer from 'inquirer';

import init from './init.js';
import final from './final.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const buildPath = join(__dirname, '..', 'build');
const distPath = join(__dirname, '..', 'dist');

// rmSync(buildPath, { recursive: true, force: true });

let { channel, platform, name, branch, patches } = await Inquirer.prompt([
  {
    type: 'input',

    name: 'name',

    default: 'goosestandalone',

    message: 'Client name'
  },

  {
    type: 'list',
    loop: false,

    name: 'platform',

    default: 'linux',

    message: 'Discord platform',
    choices: [
      'linux'
    ]
  },

  {
    type: 'list',
    loop: false,

    name: 'channel',

    default: 'canary',

    message: 'Discord channel',
    choices: [
      'stable',
      'ptb',
      'canary'
    ]
  },

  {
    type: 'checkbox',

    name: 'branch',

    message: 'GooseUpdate mods',

    choices: [
      { name: 'goosemod', checked: true },

      'smartcord',
      'betterdiscord'
    ]
  },

  {
    type: 'checkbox',

    name: 'patches',

    message: 'Client patches',

    choices: [
      'gooseupdate',
      'portable',
      'branding_files'
    ].map((x) => ({ name: x, checked: true }))
  }
]);

console.log();

branch = branch.join('+');

const dirs = await init(platform, channel, buildPath);


console.log('Patching client');

for (const m of patches) {
  console.log(m);

  const exports = await import(join(__dirname, 'patches', `${m}.js`));
  await exports.default(dirs, {
    channel,
    name,
    branch,
    platform
  });
}

const finalPath = join(distPath, channel, platform);

await final(dirs, finalPath);