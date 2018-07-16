/* eslint-disable no-console,no-await-in-loop */
const fs = require('fs');

const { promisify } = require('util');
const proxymise = require('..');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

async function benchmark() {
  const dir = 'benchmark';
  const count = 10000;

  await mkdir(dir);

  console.log(`${count} iterations`);

  console.time('with proxymise');
  for (let i = 0; i < count; i += 1) {
    const path = `${dir}/${i}.txt`;
    await proxymise(writeFile)(path, i);
    const value = await proxymise(readFile)(path).toString();
    if (value !== i.toString()) throw new Error(value);
    await proxymise(unlink)(path);
  }
  console.timeEnd('with proxymise');

  console.time('without proxymise');
  for (let i = 0; i < count; i += 1) {
    const path = `${dir}/${i}.txt`;
    await writeFile(path, i);
    const buffer = await readFile(path);
    const value = buffer.toString();
    if (value !== i.toString()) throw new Error(value);
    await unlink(path);
  }
  console.timeEnd('without proxymise');

  await rmdir(dir);
}

benchmark().catch(console.error);
