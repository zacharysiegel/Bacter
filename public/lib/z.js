class Z {
   constructor() {}
   
   /**
    * Maps to document.getElementById()
    * @param  {String} string Element id
    * @return {HTML DOM Element} Element corresponding to id
    */
   static eid(string) {
      return document.getElementById(string);
   }

   /**
    * Get the frequency of an element in an array or string
    * @param  {Array}   arr Array to be traversed
    * @param  {Generic} elt Element for which to search
    * @return {Number}     The frequency of elt in arr
    */
   static freq(arr, elt) {
      let freq = 0;
      let index = arr.indexOf(elt);
      if (index === -1) {
         return freq;
      } else {
         do {
            freq++;
            arr = arr.slice(index + 1);
            index = arr.indexOf(elt);
         } while (index !== -1);
         return freq;
      }
   };
   
   /**
    * Set the character at the specified index in a string to c
    * @param   {String}  string   String to be modified
    * @param   {Number} index Index in string to be modified
    * @param   {String}  c     Character to be set in index
    * @returns {String}        The modified string
    */
   static setCharAt(string, index, c) {
      if(index > string.length-1) {
         console.error('Invalid Argument: setCharAt(): index out of bounds')
         return string;
      }
      return string.substr(0, index) + c + string.substr(index + 1);
   }
   
   /**
    * Capitalize the first character of every word in the given string
    * @param  {String} string    String to be capitalized
    * @param  {String} delimeter String used to deliminate between words within string
                                    Defaults to ' '
    * @return {String} A
    */
   static capitalize(string, delimeter = ' ') {
      let arr = string.split(delimeter);
      for (let i = 0; i < arr.length; i++) {
         let char1 = arr[i].charAt(0).toUpperCase();
         arr[i] = this.setCharAt(arr[i], 0, char1);
      }
      return arr.join(delimeter);
   }

   /**
    * Returns an array of strings representing keys of an object
    * @param  {Object}   obj Object over which to be iterated
    * @return {String[]}     An array of strings representing keys of an object
    */
   static getKeys(obj) {
      let arr = [];
      for (let i in obj) {
         arr.push(i);
      }
      return arr;
   };

   /**
    * Request that the browser place the specified element into fulscreen mode
    * @param  {DOM Element} elt Element to be placed in fulscreen mode
    * @return Void
    *         If a browser's fullscreen api is not supported, returns undefined
    */
   static requestFullscreen(elt) {
      if (elt.requestFullscreen) {
         elt.requestFullscreen();
      } else if (elt.mozRequestFullScreen) {
         elt.mozRequestFullScreen();
      } else if (elt.webkitRequestFullscreen) {
         elt.webkitRequestFullscreen();
      } else if (elt.msRequestFullscreen) {
         elt.msRequestFullscreen();
      } else {
         console.error('Error: z.js: requestFullscreen() does not support your browser\'s fullscreen api');
         return undefined;
      }
   }

   /**
    * Request that the browser return the specified element from fulscreen to normal mode
    *    Usually no element needs to be specified
    * @param  {DOM Element} elt Fullscreen element to be returned to normal
    * @return Void
    *         If a browser's fullscreen api is not supported, returns undefined
    */
   static exitFullscreen(elt) {
      if (elt === undefined) {
         elt = getFullscreenElement()
      }
      if (elt.exitFullscreen) {
         elt.requestFullscreen();
      } else if (elt.mozCancelFullScreen) {
         elt.mozRequestCancelScreen();
      } else if (elt.webkitExitFullscreen) {
         elt.webkitRequestFullscreen();
      } else if (elt.msExitFullscreen) {
         elt.msRequestFullscreen();
      } else {
         console.error('Error: z.js: exitFullscreen() does not support your browser\'s fullscreen api');
         return undefined;
      }
   }
   
   /**
    * Get the current DOM element which is in fullscreen
    * @return {DOM Element} The current DOM element in fullscreen mode or null if no element is in fullscreen
    *                       If a browser's fullscreen api is not supported, returns undefined
    */
   static getFullscreenElement() {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement && 
          !document.msFullscreenElement) {
         console.error('Error: z.js: getFullscreenElement() does not support your browser\'s fullscreen api');
         return undefined;
      }
      return (document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement || 
              null);
   }

   /**
    * Determine if the browser is in fullscreen mode
    * @return {Boolean} True: Browser is fullscreen; False: Browser is not in fullscreen
    *                         If a browser's fullscreen api is not supported, returns undefined
    */
   static isFullscreen() {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement && 
          !document.msFullscreenElement) {
         console.error('Error: z.js: getFullscreenElement() does not support your browser\'s fullscreen api');
         return undefined;
      }
      var fullElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
      if (fullElement === null) { // If no element is in full-screen
         return false;
      } else {
         return true;
      }
   }  
}
