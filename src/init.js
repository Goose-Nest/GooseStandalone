import fetch from 'node-fetch';

import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'fs';

import Tar from 'tar';

import Asar from 'asar';

import titleCase from './lib/titleCase.js';


const downloadTar = async (platform, channel, path) => {
  switch (platform) {
    case 'linux': {
      const url = `https://discord.com/api/download/${channel}?platform=linux&format=tar.gz`;

      console.log('Downloading tar (', url, ')');

      const res = (await fetch(url));

      const fileStream = createWriteStream(path);

      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);

        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
    }
  }
};

export default async (platform, channel, buildPath) => {
  const dirPath = join(buildPath, channel, platform);
  const tarPath = join(dirPath, `discord.tar.gz`);
  const exPath = join(dirPath);

  const basePath = join(dirPath, `Discord${channel === 'stable' ? '' : titleCase(channel)}`);

  const asarFilePath = join(basePath, 'resources', 'app.asar');
  const asarExtractPath = join(dirPath, 'asar');

  if (!existsSync(tarPath)) {
    mkdirSync(join(tarPath, '..'), { recursive: true });

    await downloadTar(platform, channel, tarPath);
  }

  console.log('Got tar');

  rmSync(basePath, { recursive: true, force: true });
  rmSync(asarExtractPath, { recursive: true, force: true });

  if (!existsSync(basePath)) {
    await Tar.x({
      file: tarPath,
      cwd: exPath
    });
  }

  console.log('Extracted tar');

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