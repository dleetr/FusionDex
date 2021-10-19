"use strict";
// System libs
const fs = require("fs");
const path = require("path");
const process = require("process");

const sizeKB = (n) => {
  return (n / 1024).toFixed(2);
};
const fSizeKB = (f) => {
  return sizeKB(fs.statSync(f).size);
};

// threading
//
// WARNING - DO NOT IGNORE THE MINIMUM NODE VERSION
//
// When I tried using postMessage to transfer data it did not properly
// detach, it instead copied (despite the docs saying it should)
// const workerpool = require("workerpool");
const { Worker } = require("worker_threads");
const Vinyl = require("Vinyl");

// Image Processing
const Spritesmith = require("spritesmith");
const os = require("os");
const squoosh = require("@squoosh/lib");

const chalk = require("chalk");
const ora = require("ora");
process.env["FORCE_COLOR"] = chalk.level.toString(); // Chalk on workers fix
// PokeSprite Setup
const { spritePath } = require("./getPokeSpritePaths");

// region logging
const lineFactory = (numMarkers, chalkStyle, marker) => () =>
  console.log(chalkStyle(marker.repeat(numMarkers)));

const titleChalk = chalk.bgWhite.black;
const titleLine = lineFactory(50, titleChalk, "/");
const printTitle = (titleChalk, title, titleLine, lineLength) => {
  titleLine();

  const titleText = title
    .padStart(
      (title.length + lineLength) / 2,
      /*TODO: chalk this line with an accent color*/ "/"
    )
    .padEnd(lineLength, "/");
  console.log(titleText);

  titleLine();
};
printTitle(undefined, " gen-icons ", titleLine, 50);

console.group();

const getOutputPath = () => {
  const outputFolder = path.resolve("./src/assets/pokeicon/");
  return path.join(outputFolder, "icon_sheet.webp");
};
const outputPath = getOutputPath();

const printPaths = () => {
  console.log(`${chalk.green("Images:")}\n  >${chalk.blue(spritePath)}`);
  console.log(`${chalk.green("Output:")}\n  >${chalk.blue(outputPath)}`);
};
printPaths();

const getCumulativeSpriteSize = (spriteDir) => {
  const files = fs.readdirSync(spriteDir);
  let cumulativeSize = 0;
  files.forEach((f) => {
    const stats = fs.statSync(path.join(spriteDir, f));
    if (stats.isFile()) cumulativeSize += stats.size;
  });
  return cumulativeSize;
};

const statusReport = {
  // cumulativeSpriteSize: sizeKB(getCumulativeSpriteSize(spritePath)), // how big a naive sprite sheet could be
  cumulativeInputSize: undefined,
  initialSheetSize: undefined,
  minifiedOutputFileSize: undefined,
};

const printStatusReport = () => {
  const logLine = lineFactory(40, chalk.black, "=");

  logLine();
  console.log(chalk.greenBright("Stats:"));
  console.group();
  const scale = process.stdout.columns >= 80 ? 25 : 40;
  const symbol = "~";
  for (const stat of Object.keys(statusReport)) {
    const line =
      chalk.green((stat + ": ").padEnd(25, " ")) +
      chalk.blue("(" + (statusReport[stat] + " kB)").padEnd(12, " ")) +
      chalk.cyan(" [" + symbol.repeat(statusReport[stat] / scale) + "]");
    console.log(line);
  }

  const calcStats = (initialSize, finalSize) => {
    const memory = initialSize - finalSize;
    const percent = (memory / initialSize) * 100;
    return {
      memory: memory.toPrecision(4),
      percent: percent.toPrecision(4) + "%",
    };
  };

  const cullStats = calcStats(
    statusReport.cumulativeSpriteSize,
    statusReport.cumulativeInputSize
  );

  const minStats = calcStats(
    statusReport.initialSheetSize,
    statusReport.minifiedOutputFileSize
  );

  lineFactory(14, chalk.whiteBright, " * ")();

  console.log(
    chalk.magenta(
      `Input reduction: [${chalk.whiteBright(
        cullStats.memory + " kB"
      )}|${chalk.whiteBright(cullStats.percent)}]`
    )
  );
  console.log(
    chalk.magenta(
      `Compression saved: [${chalk.whiteBright(
        minStats.memory + " kB"
      )}|${chalk.whiteBright(minStats.percent)}]`
    )
  );
  console.groupEnd();
  logLine();
};
// endregion

// region getPokemon
const getSpritePaths = (monIDs) => {
  if (!monIDs) {
    // get the pokemon IDs we want in official dex format
    const getMonIDs = () => {
      const targetMons = [];

      // push gen 2 dex
      for (let i = 1; i < 252; i++) {
        targetMons.push(i.toString().padStart(3, "0")); // pokesprite mon info: "00X"
      }

      // get the real IDs for the custom pokedex
      gameDex.idToName.forEach((mon) => {
        const entry = vanillaDex.nameToID[mon].toString();
        targetMons.push(entry);
      });

      return targetMons;
    };
    monIDs = getMonIDs();
  }

  // we need the filename handle for the target pokemon from pokesprite's JSON
  const getPokeSpriteNames = (targetMonIDs) => {
    const names = [];
    targetMonIDs.forEach((n) => {
      const mon = pokespriteDex[n];
      const basename = mon.slug.eng;
      names.push(basename);
    });
    return names;
  };

  const spriteFileNames = getPokeSpriteNames(monIDs);

  // put the path names+format on the filenames
  const buildImagePaths = (path, fileNames) => {
    return fileNames.map((f) => `${path}${f}.png`);
  };

  const targetImagePaths = buildImagePaths(spritePath, spriteFileNames);

  // Get input size
  const targetSpriteSize = targetImagePaths
    .map((f) => fs.statSync(f).size)
    .reduce((a, b) => a + b);

  statusReport.cumulativeInputSize = sizeKB(targetSpriteSize);

  return targetImagePaths;
};
// endregion

// region threaded
const buildSheet = async (params) => {
  let hrstart = process.hrtime.bigint();

  const { port1: subChannel1, port2: subChannel2 } = new MessageChannel();
  const { port1: mainChannel1, port2: mainChannel2 } = new MessageChannel();

  const numCores = os.cpus().length;
  const imgThreads = Math.max(Math.floor(numCores) * 0.5, 1);
  const fileThreads = Math.max(numCores - imgThreads, 1);
  console.log(`img cores: ${imgThreads} file cores:${fileThreads}`);

  const imageWorker = new Worker("./gen-assets/gen-icons/workers/image.js", {
    workerData: { numThreads: imgThreads, channel: subChannel1 },
    transferList: [subChannel1],
  });
  const fileWorker = new Worker("./gen-assets/gen-icons/workers/file.js", {
    workerData: {
      numThreads: fileThreads,
      channel: subChannel2,
      outputChannel: mainChannel1,
    },
    transferList: [subChannel2, mainChannel1],
  });
  const fileWorkerReady = new Promise((resolve, reject) => {
    fileWorker.once("message", () => {
      // imageWorker.postMessage("ready");
      resolve(true);
    });
  });
  const imageWorkerReady = new Promise((resolve, reject) => {
    imageWorker.once("message", () => {
      resolve(true);
    });
  });
  await Promise.all([fileWorkerReady, imageWorkerReady]);
  console.log("sending start to fileWorker");
  fileWorker.postMessage("ready");

  const sheetAssets = [];
  // const smith = new Spritesmith();
  mainChannel2.on("message", (message) => {
    console.log("Rendering completed work into vinyl");
    sheetAssets.push(
      new Vinyl({
        path: message.path,
        contents: Buffer.from(message.contents.buffer),
      })
    );
  });
  fileWorker.on("message", (message) => {
    console.log("file work finished");
    imageWorker.postMessage("exit");

    Spritesmith.run(
      {
        src: sheetAssets,
      },
      (err, result) => {
        if (err) throw err;

        fs.writeFileSync(outputPath, result.image);

        let ns = Number(process.hrtime.bigint() - hrstart);
        console.log(chalk.blue(`Time: ${chalk.white(ns / 1000000)}ms`));
      }
    );
  });
};
// endregion

const loaderSpin = () => {
  const spinner = ora("Minifying").start();

  setTimeout(() => {
    spinner.color = "white";
    spinner.text = "";
  }, 500);
  return spinner;
};
const spinner = loaderSpin();

const proccessImagesFactory = (smith) => async (err, images) => {
  if (err) {
    throw err;
  }
  const result = smith.processImages(images);
  // const metadataWriter = writeMetadata(metadataPath, result.coordinates);
  // statusReport.initialSheetSize = sizeKB(imageSize);
  const imagePool = new squoosh.ImagePool(1); // Threads can only work on a single image at a time, so adding more doesn't help unless we break down the compression to be per image
  const encodeOptions = {
    webp: {
      quality: 100,
      lossless: 1, // lossless webp is different from lossy even at quality 100
    }, //an empty object means 'use default settings'
  };
  const streamToBuffer = async (stream, imagePool, encodeOptions) => {
    const hrstart = process.hrtime.bigint();

    const chunks = [];
    // const encodedChunks = [];
    // const processedChunks = [];
    return new Promise((resolve, reject) => {
      stream.on("data", async (chunk) => {
        const buffer = Buffer.from(
          chunk.buffer.slice(
            input.byteOffset,
            input.byteOffset + input.byteLength
          )
        );
        imagePool.ingestImage(buffer);
        // reading the entire stream and then concatenating it works correctly -
        // attempting to do work on the chunks as the stream comes in does not
        chunks.push(buffer);
      });
      stream.on("error", (err) => {
        return reject(err);
      });
      stream.on("end", async () => {
        resolve(Buffer.concat(chunks));
        const ns = Number(process.hrtime.bigint() - hrstart);
        console.log(
          chalk.blue(`streamToBuffer: ${chalk.white(ns / 1000000)}ms`)
        );
      });
    });
  };

  const imageBuffer = await streamToBuffer(result.image, imagePool);
  let hrstart = process.hrtime.bigint();
  const work = imagePool.ingestImage(imageBuffer);
  await work.decoded;
  await work.encode(encodeOptions);
  const minifiedImage = (await work.encodedWith.webp).binary;
  imagePool.close();
  // const imageBuffer = result.image;
  // await buildMinifiedSheet(imageBuffer);
  let ns = Number(process.hrtime.bigint() - hrstart);
  console.log(chalk.blue(`Compression: ${chalk.white(ns / 1000000)}ms`));

  hrstart = process.hrtime.bigint();
  // fs.writeFileSync(outputPath, minifiedImage);
  fs.writeFileSync(outputPath, minifiedImage);
  ns = Number(process.hrtime.bigint() - hrstart);
  statusReport.minifiedOutputFileSize = fSizeKB(outputPath);

  printStatusReport();
  console.groupEnd();
};

const fusionDexRealIDS = () => {
  const targetMons = [];
  for (let i = 1; i < 252; i++) {
    targetMons.push(i.toString().padStart(3, "0")); // pokesprite mon info: "00X"
  }
  gameDex.idToName.forEach((mon) => {
    const entry = vanillaDex.nameToID[mon].toString();
    targetMons.push(entry);
  });
  return targetMons;
};

const getFusionDexIconSheet = () => buildSheet(fusionDexRealIDS());

try {
  // Spritesmith.run({ src: getSpritePaths() }, processImage);
  // const smith = new Spritesmith();
  // const processImages = proccessImagesFactory(smith);
  // smith.createImages(getSpritePaths(), processImages);
  buildSheet().then(spinner.stop());
  // spinner.stop();
} catch (err) {
  console.log("Error writing sheet. Check any error output and path names.");
  console.error(err);
  spinner.stop();
  process.exit(1);
}

// const processImage = async (buffer, pool, options) => {
//   try {
//     const imageWorker = pool.ingestImage(buffer);
//     await imageWorker.decoded;
//     console.log(imageWorker.decoded);
//     await imageWorker.encode(options);
//     const minifiedImage = (await imageWorker.encodedWith.webp).binary;
//     return new Promise((resolve, reject) => resolve(minifiedImage));
//   } catch (e) {
//     console.error(e);
//   }
// };
