/**
 *  Open files and pass them to the image worker.
 *  Once they're compressed the buffers come back then are sent
 *  to the output channel.
 */

const { workerData, parentPort } = require("worker_threads");
const fs = require("fs/promises");
const EventEmitter = require("events");

const { getFusionDexSpritePaths } = require("../getPokespritePaths.js");

const chalk = require("chalk");
const log = (s) => console.log(`file worker: ${s}`);

const { numThreads, channel: imageWorker, outputChannel } = workerData;
const jobs = new Set();
let allPosted = false;

const workEmitter = new EventEmitter();
let hrstart;

workEmitter.on("done", () => {
  parentPort.postMessage("done");
  let ns = Number(process.hrtime.bigint() - hrstart);
  console.log(`Time: ${chalk.white(ns / 1000000)}ms`);
  process.exit(0);
});

imageWorker.on("message", (message) => {
  const { id, buffer } = message;
  const data = {
    path: id,
    contents: Buffer.from(buffer.buffer),
  };
  outputChannel.postMessage(data, [data.contents.buffer]);
  jobs.delete(id);
  if (allPosted && jobs.size === 0) {
    workEmitter.emit("done");
  }
});

// TODO: Use the additional threads somehow

const dispatchImageWork = async (path, jobPostTimer) => {
  const fd = await fs.readFile(path);
  imageWorker.postMessage({ id: path, imageBuffer: fd.buffer }, [fd.buffer]);
  const time = Number(process.hrtime.bigint() - jobPostTimer) / 1000000;
  log(`job posted: ${time}`);
};

const postJobs = (filePaths) => {
  const jobPostTimer = process.hrtime.bigint();
  log(`Job posting begins`);
  for (const path of filePaths) {
    dispatchImageWork(path, jobPostTimer);
    jobs.add(path);
  }
  allPosted = true;
};

const onStart = (message) => {
  hrstart = process.hrtime.bigint();
  postJobs(getFusionDexSpritePaths());
};

parentPort.once("message", (message) => {
  onStart(message);
});

log(`Posting ready`);
parentPort.postMessage("ready");
