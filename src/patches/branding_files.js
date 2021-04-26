import { join } from 'path';

import titleCase from '../lib/titleCase.js';

import replaceInFile from '../lib/replaceInFile.js';
import renameFile from '../lib/renameFile.js';

export default ({ basePath }, { name, channel }) => {
  // Desktop file
  const desktopPath = join(basePath, `discord-${channel}.desktop`);

  // Replace discord with client name
  replaceInFile(desktopPath, 'discord', name.toLowerCase());
  replaceInFile(desktopPath, 'Discord', titleCase(name));

  // Rename file
  renameFile(desktopPath, join(basePath, `${name.toLowerCase()}-${channel}.desktop`));


  // Exec file
  const execPath = join(basePath, `Discord${titleCase(channel)}`);

  // Rename file
  renameFile(execPath, join(basePath, `${titleCase(name)}${titleCase(channel)}`));
};