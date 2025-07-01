const chalk = require('chalk');

const levels = {
  info: chalk.cyan('[INFO]'),
  warn: chalk.yellow('[WARN]'),
  error: chalk.red('[ERROR]'),
  debug: chalk.gray('[DEBUG]'),
};

function log(level, ...args) {
  const prefix = levels[level] || '[LOG]';
  const timestamp = new Date().toISOString();
  console.log(`${prefix} ${timestamp} -`, ...args);
}

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args),
};
