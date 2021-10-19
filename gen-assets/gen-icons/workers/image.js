/**
 *  Receieve input from a fileWorker and return it compressed
 */

const chalk = require("chalk");
const log = (s) => console.log(chalk.green`image worker: ${s}`);

const { workerData, parentPort } = require("worker_threads");
const { numThreads, channel: fileWorker } = workerData;

const squoosh = require("@squoosh/lib");
const pool = new squoosh.ImagePool(numThreads);
const compressionOptions = {
  // webp: {
  //   quality: 100,
  //   lossless: 1, // lossless webp is different from lossy even at quality 100
  // }, //an empty object means 'use default settings'
  oxipng: {
    level: 2, // goes up to 3. 2 and 3 seem the same
  },
};

const timeFrame = process.hrtime.bigint();
const compressionJob = async (imageJob) => {
  const beginWork = Number(process.hrtime.bigint() - timeFrame) / 1000000;
  const { id: name, imageBuffer } = imageJob;
  const img = pool.ingestImage(imageBuffer);
  await img.decoded;
  await img.encode(compressionOptions);
  const work = (await img.encodedWith.oxipng).binary;
  fileWorker.postMessage(
    {
      id: name,
      buffer: work,
    },
    [work.buffer]
  );
  const endWork = Number(process.hrtime.bigint() - timeFrame) / 1000000;
  log(
    `Work started|finished: [${beginWork}|${endWork}] \tduration:${
      endWork - beginWork
    }`
  );
};

fileWorker.on("message", compressionJob);
log(`Posting ready`);
parentPort.postMessage("ready");
parentPort.on("message", () => {
  pool.close();
  process.exit(0);
});
