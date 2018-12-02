const PRINT_DEV = true; // Developer mode for printing to the console

/**
 * Same functionality as console.log() if print developer mode is enabled (PRINT_DEV === true)
 *    else do nothing
 * @param  {convertible to string} ...args Same parameter requirements as console.log()
 * @return void
 */
let print_dev = (...args) => {
   if (PRINT_DEV) {
      console.log(...args);
   }
};

module.exports = print_dev;