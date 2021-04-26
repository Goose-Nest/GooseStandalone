import { join } from 'path';

import titleCase from '../lib/titleCase.js';

import replaceInFile from '../lib/replaceInFile.js';
import renameFile from '../lib/renameFile.js';

export default ({ basePath }, { name, channel }) => {
  // Desktop file
  const desktopPath = join(basePath, `discord${channel === 'stable' ? '' : `-${channel}`}.desktop`);

  // Replace discord with client name
  replaceInFile(desktopPath, 'discord', name.toLowerCase());
  replaceInFile(desktopPath, 'Discord', titleCase(name));

  // Rename file
  renameFile(desktopPath, join(basePath, `${name.toLowerCase()}${channel === 'stable' ? '' : `-${channel}`}.desktop`));


  // Exec file
  const execPath = join(basePath, `Discord${channel === 'stable' ? '' : titleCase(channel)}`);

  // Rename file
  renameFile(execPath, join(basePath, `${titleCase(name)}${channel === 'stable' ? '' : titleCase(channel)}`));
};