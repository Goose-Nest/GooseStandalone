import fetch from 'node-fetch';

import { createWriteStream } from 'fs';

export default async (path, url) => {
  const res = (await fetch(url));

  const fileStream = createWriteStream(path);

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);

    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};