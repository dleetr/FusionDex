const chalk = require("chalk");
const ora = require("ora");
const maxWidth = process.stdout.columns;

const lineFactory = (numMarkers, chalkStyle, marker) => () =>
  console.log(chalkStyle(marker.repeat(numMarkers)));
exports.lineFactory = lineFactory;

const titleChalk = chalk.bgWhite.black;
const printTitle = (titleChalk, title, lineLength) => {
  const titleLine = lineFactory(lineLength, titleChalk, "/");

  titleLine();

  const titleText = title
    .padStart((title.length + lineLength) / 2, "/")
    .padEnd(lineLength, "/");
  console.log(titleText);

  titleLine();
};

exports.printTitle = () =>
  printTitle(titleChalk, " gen-icons ", maxWidth * 0.6);

/*
 * Returns a logger that receives a string and outputs the baseMessage followed by
 * the string.
 */
exports.logger = (logChalk, baseMessage) => (message) =>
  console.log(logChalk`${baseMessage}${message}`);

exports.loader = () => {
  const spinner = ora("Minifying").start();

  setTimeout(() => {
    spinner.color = "white";
    spinner.text = "";
  }, 500);
  return spinner;
};
