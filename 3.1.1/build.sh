cd ./www/bundle
rm bundle.js
rm bundle.js.map
cd ../../
npx babel ./www/js -o ./www/bundle/bundle.js -s
# npx eslint ./www/bundle/bundle.js