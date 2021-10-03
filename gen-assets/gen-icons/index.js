"use strict";
// System libs
const fs = require("fs");
const path = require("path");
const process = require("process");

// Image Processing
const Spritesmith = require("spritesmith");
const squoosh = require("@squoosh/lib");
const os = require("os");

const chalk = require("chalk");
const ora = require("ora");

// PokeSprite Setup
const pokespritePath = require("pokesprite-images").baseDir;
const spritePath = path.join(pokespritePath, "pokemon-gen8", "regular/");

const readJSONSync = (filePath) =>
  JSON.parse(fs.readFileSync(path.resolve(filePath)));
const pokespriteDex = readJSONSync(`${pokespritePath}/data/pokemon.json`);
const vanillaDex = readJSONSync("./src/assets/VanillaDex.json");
const gameDex = readJSONSync("./src/assets/GameDex.json");

const lineFactory = (numMarkers, chalkStyle, marker) => () =>
  console.log(chalkStyle(marker.repeat(numMarkers)));

// Title
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

printTitle(chalk.bgMagentaBright.black, " gen-icons ", titleLine, 50);

console.group();
const sizeKB = (n) => {
  return (n / 1024).toFixed(2);
};
const fSizeKB = (f) => {
  return sizeKB(fs.statSync(f).size);
};
const getCumulativeSpriteSize = (spriteDir) => {
  const files = fs.readdirSync(spriteDir);
  let cumulativeSize = 0;
  files.forEach((f) => {
    const stats = fs.statSync(path.join(spriteDir, f));
    if (stats.isFile()) cumulativeSize += stats.size;
  });
  return cumulativeSize;
};

// Space information about the assets
const statusReport = {
  cumulativeSpriteSize: sizeKB(getCumulativeSpriteSize(spritePath)), // how big a naive sprite sheet could be
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
// get the filename entries from pokesprite
const getPokeSpriteNames = (targetMonIDs) => {
  const names = [];
  targetMonIDs.forEach((n) => {
    const mon = pokespriteDex[n];
    const basename = mon.slug.eng;
    names.push(basename);
  });
  return names;
};
const getTargetMons = () => {
  // push gen 2 dex
  const targetMons = [];
  for (let i = 1; i < 252; i++) {
    targetMons.push(i.toString().padStart(3, "0")); // pokesprite mon info is in "00X" format
  }

  // resolve the official IDs
  gameDex.idToName.forEach((mon) => {
    const entry = vanillaDex.nameToID[mon].toString();
    targetMons.push(entry);
  });
  return targetMons;
};

const targetMons = getTargetMons();
const spriteFileNames = getPokeSpriteNames(targetMons);

// put the path names+format on the filenames
const buildSpritePaths = (path, fileNames) => {
  console.log(`${chalk.green("Icon Sprites:")}\n  >${chalk.blue(path)}`);
  return fileNames.map((f) => `${path}${f}.png`);
};

// get the actual subfolder
const targetSpritePaths = buildSpritePaths(spritePath, spriteFileNames);

// This might save a bit of file handling time if done along with building the sprite paths
const targetSpriteSize = targetSpritePaths
  .map((f) => fs.statSync(f).size)
  .reduce((a, b) => a + b);

statusReport.cumulativeInputSize = sizeKB(targetSpriteSize);

// Run spritesmith
const pokeiconFolder = path.resolve("./src/assets/pokeicon/");
const minSheetPath = path.join(pokeiconFolder, "icon_sheet.webp");
console.log(`${chalk.green("Output:")}\n  >${chalk.blue(minSheetPath)}`);

const loaderSpin = () => {
  const spinner = ora("Minifying").start();

  setTimeout(() => {
    spinner.color = "white";
    spinner.text = "";
  }, 500);
  return spinner;
};
const spinner = loaderSpin();

const processImage = async (err, result) => {
  // result.image; // Buffer representation of image
  // result.coordinates; // Object mapping filename to {x, y, width, height} of image
  // result.properties; // Object with metadata about spritesheet {width, height}
  if (err) {
    throw err;
  }
  const image = result.image;
  const imageSize = Buffer.byteLength(image);

  statusReport.initialSheetSize = sizeKB(imageSize);

  const buildMinifiedSheet = async (imageBuffer, writePath) => {
    const imagePool = new squoosh.ImagePool(Math.max(1, os.cpus().length - 1));
    const sheetImage = imagePool.ingestImage(imageBuffer);
    const encodeOptions = {
      webp: {
        quality: 100,
        lossless: 1,
      }, //an empty object means 'use default settings'
    };

    await sheetImage.decoded;
    await sheetImage.encode(encodeOptions);
    const minifiedImage = (await sheetImage.encodedWith.webp).binary;
    imagePool.close(); // this doesn't delete the image just the pool

    fs.writeFileSync(writePath, minifiedImage);
    statusReport.minifiedOutputFileSize = fSizeKB(writePath);
  };
  await buildMinifiedSheet(image, minSheetPath);

  printStatusReport();
  console.groupEnd();
};

try {
  Spritesmith.run({ src: targetSpritePaths }, processImage);
  spinner.stop();

} catch (err) {
  console.log("Error writing sheet. Check any error output and path names.");
  console.error(err);
  spinner.stop();
  process.exit(1);
}