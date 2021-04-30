import { rmSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

import Asar from 'asar';

import copyDirSync from './lib/copyDirSync.js';


export default async ({ basePath, asarFilePath, asarExtractPath }, { }, finalPath) => {
  await Asar.createPackage(asarExtractPath, asarFilePath);

  console.log('Repacked asar');

  if (existsSync(finalPath)) {
    rmSync(finalPath, { recursive: true, force: true });
  }

  mkdirSync(join(finalPath, '..'), { recursive: true });

  copyDirSync(basePath, finalPath);
  rmSync(basePath, { recursive: true, force: true });

  console.log('Finalised');
};