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

let { channel, platform, name, patches } = await Inquirer.prompt([
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

    name: 'patches',

    message: 'Client patches',

    choices: [
      { checked: true, name: 'gooseupdate' },
      { checked: false, name: 'gooseupdate_runtime_choice' },

      { checked: true, name: 'portable' },

      { checked: true, name: 'branding_files' },
      { checked: false, name: 'branding_app' }
    ]
  }
]);

console.log('\nInitialising...');

const dirs = await init(platform, channel, buildPath);

console.log('\nLoading patches...');

for (const m of patches) {
  console.log(m);

  const exports = await import(join(__dirname, 'patches', `${m}.js`));
  await exports.default(dirs, {
    channel,
    name,
    platform
  });
}

console.log('Loaded patches\n\nFinalising...');

const finalPath = join(distPath, channel, platform);

await final(dirs, finalPath);