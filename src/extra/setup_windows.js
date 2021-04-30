import { execSync } from 'child_process';

import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const [ channel ] = process.argv.slice(2);

console.log('Computing paths...');

const basePath = join(__dirname, '..', '..', 'dist', channel, 'windows');
const oldAppPath = join(basePath, `app-0.0.0`);

const exePath = join(oldAppPath, readdirSync(oldAppPath).find((x) => x.includes('.exe')));

console.log('Running Discord to generate installer.db...');

execSync(`"${exePath}"`, { stdio: 'inherit' });

console.log('Ran, finding new app dir');

const newAppPath = join(basePath, readdirSync(basePath).find((x) => x.startsWith(`app-1.`)));

console.log(newAppPath);

console.log('Copying modules from new to old...');

execSync(`xcopy "${join(newAppPath, 'modules')}" "${join(oldAppPath, 'modules')}" /E /H /C /I`, { stdio: 'inherit' });

console.log('Removing new...');

execSync(`rmdir "${newAppPath}" /Q /S`, { stdio: 'inherit' });

console.log('Renaming old to new...');

execSync(`move "${oldAppPath}" "${newAppPath}"`, { stdio: 'inherit' });