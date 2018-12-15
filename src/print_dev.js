/**
 * Same functionality as console.log() if print developer mode is enabled (PRINT_DEV === true)
 *    else do nothing
 * @param  {convertible to string} ...args Same parameter requirements as console.log()
 * @return void
 */

let config = require('./config.json');

let print_dev = (...args) => {
   if (config._print_dev) {
      console.log(...args);
   }
};

module.exports = print_dev;