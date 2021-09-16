import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { rmSync, readFileSync, readdirSync } from 'fs';

import Inquirer from 'inquirer';

import init from './init.js';
import final from './final.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const buildPath = join(__dirname, '..', 'build');
const distPath = join(__dirname, '..', 'dist');

const defaultPatches = [ 'gooseupdate', 'portable', 'branding_files' ];
const allPatches = readdirSync(join(__dirname, 'patches')).map((x) => x.split('.').slice(0, -1).join('.'));


let { channel, platform, name, source, patches } = await Inquirer.prompt([
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
      'linux',
      'windows'
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
    type: 'list',
    loop: false,

    name: 'source',

    default: 'download',

    message: 'Discord client source',
    choices: [
      'download',
      'local'
    ]
  },

  {
    type: 'checkbox',

    name: 'patches',

    message: 'Client patches',

    choices: allPatches.map((x) => ({ checked: defaultPatches.includes(x), name: x }))
  }
]);

console.log('\nInitialising...');

const dirs = await init(platform, channel, source, buildPath);

const buildInfo = JSON.parse(readFileSync(join(dirs.basePath, 'resources', 'build_info.json'), 'utf8'));

console.log('\nPatching...');

const extraInfo = {
  channel,
  name,
  platform,
  buildInfo
};

for (const m of patches) {
  console.log(m);

  const exports = await import(`./patches/${m}.js`);
  await exports.default(dirs, extraInfo);
}

console.log('\n\nFinalising...');

const finalPath = join(distPath, channel, platform, platform === 'windows' ? `app-0.0.0` : '');

rmSync(finalPath, { recursive: true, force: true });

await final(dirs, extraInfo, finalPath);