"use strict";
const fs = require("fs");
const path = require("path");
const process = require("process");

const logging = require("./logging");
logging.printTitle();
const loadingDisplay = logging.loader();
const stats = require("./stats");
const metrics = stats.metrics;

const pokeiconFolder = "./src/assets/pokeicon/";
const { getFusionDexSpritePaths } = require("./getFusionDexSpritePaths");

const Spritesmith = require("spritesmith");
const squoosh = require("@squoosh/lib");
const imageOutputPath = path.join(pokeiconFolder, "icon_sheet.webp");
const cssOutputStream = fs.createWriteStream(
  path.join(pokeiconFolder, "icon_sheet.css")
);
const encodeOptions = {
  webp: {
    quality: 100,
    lossless: 1,
  }, //an empty object means 'use default settings'
};

const processImage = async (err, result) => {
  // result.image; // Buffer representation of image
  // result.coordinates; // Object mapping filename to {x, y, width, height} of image
  // result.properties; // Object with metadata about spritesheet {width, height}
  if (err) {
    throw err;
  }
  const image = result.image;
  const imageSize = image;
  metrics.initialSheet = stats.sizeKB(Buffer.byteLength(image));

  for (const spritePathEntry in result.coordinates) {
    const { height, width, x, y } = result.coordinates[spritePathEntry];
    const spriteName = path.basename(spritePathEntry, ".png");
    cssOutputStream.write(
      "." +
        spriteName +
        "{\n" +
        `  width:${width}px;\n` +
        `  height:${height}px;\n` +
        `  background:url(${path.basename(imageOutputPath)}) ${x} ${y};\n` +
        "}\n"
    );
  }
  cssOutputStream.close();

  const buildMinifiedSheet = async (imageBuffer, writePath) => {
    const imagePool = new squoosh.ImagePool(1);
    // Additional threads only aid if working with many files
    const sheetImage = imagePool.ingestImage(imageBuffer);

    await sheetImage.decoded;
    await sheetImage.encode(encodeOptions);
    const minifiedImage = (await sheetImage.encodedWith.webp).binary;
    imagePool.close();

    fs.writeFileSync(writePath, minifiedImage);
    metrics.minifiedSheet = stats.fSizeKB(writePath);
  };
  await buildMinifiedSheet(image, imageOutputPath);

  loadingDisplay.stop();
  stats.report();
};

// Clean up any resources
const cleanup = (err) => {
  if (err) console.error(err);
  loadingDisplay.stop();
  process.exit(1);
};

try {
  Spritesmith.run({ src: [...getFusionDexSpritePaths()] }, processImage);
} catch (err) {
  console.log("Error writing sheet. Check error output and paths.");
  cleanup(err);
}
