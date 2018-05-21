module.exports = {
   "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true
   },
   "extends": "eslint:recommended",
   "parserOptions": {
      "ecmaFeatures": {
         "jsx": true
      },
      "sourceType": "script"
   },
   "globals": {
      "angular": true
   },
   "plugins": [

   ],
   "rules": {
      "indent": [
         "off",
         3
      ],
      "linebreak-style": [
         "off",
         "windows"
      ],
      "quotes": [
         "warn",
         "single"
      ],
      "semi": [
         "error",
         "always"
      ],
      "no-undef": [
         "off"
      ],
      "no-unused-vars": [
         "off"
      ],
      "no-inner-declarations": [
         "off"
      ]
   }
};