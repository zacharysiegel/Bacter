cd ./www/js
rm bundle.js
rm bundle.js.map
cd ../../
npx babel ./www/js -o ./www/js/bundle.js -s
npx eslint ./www/js/bundle.js