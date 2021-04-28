import { rmSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import titleCase from '../lib/titleCase.js';
import replaceInFile from '../lib/replaceInFile.js';

export default ({ basePath, asarExtractPath }, { name, channel }) => {
  // Exec file
  const execPath = join(basePath, `Discord${channel === 'stable' ? '' : titleCase(channel)}`);

  const allowlist = [
    'discord.png',
    `discord${channel === 'stable' ? '' : `-${channel}`}.desktop`,
    'resources'
  ];

  for (const f of readdirSync(basePath)) {
    if (!allowlist.includes(f)) {
      rmSync(join(basePath, f), { force: true, recursive: true });
    }
  }

  writeFileSync(execPath, `#!/bin/sh
electron "$(dirname "\${BASH_SOURCE[0]}")/resources/app.asar"`);

  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'index.js'), `"use strict";`, `"use strict";
process.resourcesPath = require('path').join(require.main.filename, '..', '..', '..');
process.execPath = require('path').join(require.main.filename, '..', '..', '..', '..', 'DiscordCanary');

console.log(process.resourcesPath, process.execPath, __dirname, process.platform, process.versions.electron);`);

  replaceInFile(join(asarExtractPath, 'app_bootstrap', 'buildInfo.js'), `process.resourcesPath`, `__dirname, '..', '..'`)
};