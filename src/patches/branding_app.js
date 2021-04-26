import { join } from 'path';

import Inquirer from 'inquirer';

import replaceInFile from '../lib/replaceInFile.js';
import downloadFile from '../lib/downloadFile.js';


export default async ({ basePath }) => {
  const path = join(basePath, 'discord.png');

  const { url } = await Inquirer.prompt([
    {
      type: 'input',

      name: 'url',

      message: 'App image URL',

      default: 'https://cdn.discordapp.com/icons/756146058320674998/44c23ad62f0db80b01280e77f1562d25.png?size=256'
    }
  ]);

  await downloadFile(path, url);
};