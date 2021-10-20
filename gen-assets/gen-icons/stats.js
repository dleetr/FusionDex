const chalk = require("chalk");
const process = require("process");
const fs = require("fs");
const { lineFactory } = require("./logging");

const sizeKB = (n) => {
  return (n / 1024).toFixed(2);
};
exports.sizeKB = sizeKB;
exports.fSizeKB = (f) => {
  return sizeKB(fs.statSync(f).size);
};

const reductionStats = (initial, finish) => {
  const difference = initial - finish;
  const percent = (difference / initial) * 100;
  return {
    diff: difference.toPrecision(4) + "KB",
    percent: percent.toPrecision(4) + "%",
  };
};

// Space information about the assets
const metrics = {
  initialSheet: undefined,
  minifiedSheet: undefined,
};
exports.metrics = metrics;
exports.report = (maxWidth) => {
  maxWidth = maxWidth ?? process.stdout.columns; // default to terminal width
  const scale = Math.floor(maxWidth / 3);
  const logLine = lineFactory(maxWidth, chalk.bgCyan.black, "/");

  logLine();
  console.log(chalk.greenBright("Stats:"));
  console.group();

  const symbol = "~";
  const labelChalk = chalk.green;
  const fillChalk = chalk.cyan;
  const statTextChalk = chalk.blue;

  for (const stat of Object.keys(metrics)) {
    const graphLine =
      labelChalk((stat + ": ").padEnd(25, " ")) +
      statTextChalk("(" + (metrics[stat] + " kB)").padEnd(10, " ")) +
      fillChalk(" [" + symbol.repeat(metrics[stat] / scale) + "]");
    console.log(graphLine);
  }

  const { diff: delta, percent } = reductionStats(
    metrics.initialSheet,
    metrics.minifiedSheet
  );
  console.log(
    chalk`{blue Savings: [{white {bold ${delta}}|{white {bold ${percent}}}}]}`
  );
  console.groupEnd();
  logLine();
};
