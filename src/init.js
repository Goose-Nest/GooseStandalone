import { join } from 'path';
import { existsSync, mkdirSync, rmSync, writeFileSync, readdirSync, lstatSync } from 'fs';
import { brotliDecompressSync } from 'zlib';

import Tar from 'tar';
import fetch from 'node-fetch';
import Asar from 'asar';
import Inquirer from 'inquirer';


import titleCase from './lib/titleCase.js';
import downloadFile from './lib/downloadFile.js';
import copyDirSync from './lib/copyDirSync.js';


export default async (platform, channel, source, buildPath) => {
  const dirPath = join(buildPath, channel, platform);

  const basePath = join(dirPath, platform === 'windows' ? 'files' : `Discord${channel === 'stable' ? '' : titleCase(channel)}`);

  const asarFilePath = join(basePath, 'resources', 'app.asar');
  const asarExtractPath = join(dirPath, 'asar');

  rmSync(basePath, { recursive: true, force: true });
  rmSync(asarExtractPath, { recursive: true, force: true });

  const tarPath = join(dirPath, `discord.tar.gz`);
  const exPath = join(dirPath);


  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  if (!existsSync(tarPath) || source === 'local') {
    mkdirSync(join(tarPath, '..'), { recursive: true });

    switch (source) {
      case 'download': {
        switch (platform) {
          case 'linux': {
            const url = `https://discord.com/api/download/${channel}?platform=linux&format=tar.gz`;
    
            console.log('Downloading tar (', url, ')');
          
            await downloadFile(path, url);
    
            break;
          }
    
          case 'windows': {
            const manifestUrl =`https://discord.com/api/updates/distributions/app/manifests/latest?channel=${channel}&platform=win&arch=x86`;
    
            console.log('Downloading tar ( 1/2 - manifest -', manifestUrl, ')');
    
            const manifest = await (await fetch(manifestUrl)).json();
    
            console.log('Downloading tar ( 2/2 - tar -', manifest.full.url, ')');
    
            const data = brotliDecompressSync(await (await fetch(manifest.full.url)).arrayBuffer());
    
            writeFileSync(tarPath, data);
    
            break;
          }
        }

        break;
      }

      case 'local': {
        switch (platform) {
          case 'linux': {
            const { local_source } = await Inquirer.prompt([
              {
                type: 'list',
                loop: false,
            
                name: 'local_source',
            
                default: 'opt',
            
                message: 'Discord local Linux source',
                choices: [
                  'opt',
                  'flatpak',
                  'snap'
                ]
              }
            ]);

            let localPath = '';

            switch (local_source) {
              case 'opt': {
                localPath = `/opt/discord${channel !== 'stable' ? `-${channel}` : ''}`;
                break;
              }

              case 'flatpak': {
                break;
              }

              case 'snap': {
                break;
              }
            }

            console.log(localPath);

            copyDirSync(localPath, basePath);

            break;
          }
    
          case 'windows': {
            const localPath = process.env.APPDATALOCAL + `\\discord${channel !== 'stable' ? channel : ''}`;

            copyDirSync(localPath, basePath);

            break;
          }
        }

        break;
      }
    }
  }

  console.log('Got tar');

  if (!existsSync(basePath) && source !== 'local') {
    await Tar.x({
      file: tarPath,
      cwd: exPath
    });
  }

  console.log('Extracted tar');

  if (platform === 'windows') {
    // Update package has files in "/files/" subdir, so move all to there and remove manifest

    rmSync(join(dirPath, `delta_manifest.json`));

    /* const filesPath = join(basePath, 'files');
    for (const f of readdirSync(filesPath)) {
      const oldPath = join(filesPath, f);
      const newPath = join(basePath, f);

      if (lstatSync(oldPath).isFile()) {
        copyFileSync(oldPath, newPath);
      } else {
        copyDirSync(oldPath, newPath);
      }
    }

    rmSync(filesPath, { force: true, recursive: true }); */

    console.log('Completed windows specific post-extract update package fixing');
  }

  if (!existsSync(asarExtractPath)) {
    mkdirSync(asarExtractPath, { recursive: true });

    Asar.extractAll(asarFilePath, asarExtractPath);
  }

  console.log('Extracted asar');

  console.log('Initialised');

  return {
    dirPath,
    basePath,

    asarFilePath,
    asarExtractPath
  };
};